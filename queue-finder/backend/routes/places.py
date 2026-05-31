from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timedelta
from database import get_db
from models.models import Place, CrowdReport, CrowdLevel, PlaceCategory, User
from services.geo import haversine_km, bounding_box
from routes.auth import current_user

router = APIRouter(prefix="/places", tags=["places"])

FRESH_WINDOW_HOURS = 2


def crowd_summary(place: Place, db: Session) -> dict:
    """Return current crowd level based on last 3 reports within 2 hours."""
    cutoff = datetime.utcnow() - timedelta(hours=FRESH_WINDOW_HOURS)
    recent = (
        db.query(CrowdReport)
        .filter(CrowdReport.place_id == place.id, CrowdReport.created_at >= cutoff)
        .order_by(CrowdReport.created_at.desc())
        .limit(3)
        .all()
    )
    if not recent:
        return {"level": "none", "report_count": 0, "last_reported_at": None}

    level_scores = {"quiet": 1, "moderate": 2, "busy": 3}
    avg = sum(level_scores[r.level.value] for r in recent) / len(recent)
    level = "quiet" if avg < 1.67 else "moderate" if avg < 2.34 else "busy"
    return {
        "level": level,
        "report_count": len(recent),
        "last_reported_at": recent[0].created_at.isoformat(),
    }


def place_to_dict(place: Place, db: Session, user_lat: float = None, user_lon: float = None) -> dict:
    distance = None
    if user_lat and user_lon:
        dist_km = haversine_km(user_lat, user_lon, place.latitude, place.longitude)
        distance = f"{dist_km:.1f} km" if dist_km >= 1 else f"{int(dist_km * 1000)} m"

    return {
        "id": place.id,
        "name": place.name,
        "category": place.category.value,
        "address": place.address,
        "area": place.area,
        "city": place.city,
        "latitude": place.latitude,
        "longitude": place.longitude,
        "hours_open": place.hours_open,
        "is_verified": place.is_verified,
        "distance": distance,
        **crowd_summary(place, db),
    }


@router.get("/nearby")
def nearby_places(
    lat: float = Query(..., description="User latitude"),
    lon: float = Query(..., description="User longitude"),
    radius_km: float = Query(3.0, le=20),
    category: Optional[str] = None,
    db: Session = Depends(get_db),
):
    min_lat, max_lat, min_lon, max_lon = bounding_box(lat, lon, radius_km)
    q = db.query(Place).filter(
        Place.latitude.between(min_lat, max_lat),
        Place.longitude.between(min_lon, max_lon),
    )
    if category:
        q = q.filter(Place.category == category)
    places = q.all()

    results = []
    for p in places:
        dist_km = haversine_km(lat, lon, p.latitude, p.longitude)
        if dist_km <= radius_km:
            results.append((dist_km, p))

    results.sort(key=lambda x: x[0])
    return [place_to_dict(p, db, lat, lon) for _, p in results]


@router.get("/search")
def search_places(
    q: str = Query(..., min_length=1),
    lat: Optional[float] = None,
    lon: Optional[float] = None,
    db: Session = Depends(get_db),
):
    places = db.query(Place).filter(Place.name.ilike(f"%{q}%")).limit(20).all()
    return [place_to_dict(p, db, lat, lon) for p in places]


@router.get("/{place_id}")
def get_place(place_id: int, lat: Optional[float] = None, lon: Optional[float] = None, db: Session = Depends(get_db)):
    place = db.query(Place).filter(Place.id == place_id).first()
    if not place:
        raise HTTPException(status_code=404, detail="Place not found")
    return place_to_dict(place, db, lat, lon)


class AddPlaceRequest(BaseModel):
    name: str
    category: str = "general"
    latitude: float
    longitude: float
    address: Optional[str] = None
    area: Optional[str] = None
    city: Optional[str] = None
    hours_open: Optional[str] = None


@router.post("/")
def add_place(body: AddPlaceRequest, db: Session = Depends(get_db), user: Optional[User] = Depends(current_user)):
    try:
        cat = PlaceCategory(body.category)
    except ValueError:
        cat = PlaceCategory.general

    place = Place(
        name=body.name,
        category=cat,
        latitude=body.latitude,
        longitude=body.longitude,
        address=body.address,
        area=body.area,
        city=body.city,
        hours_open=body.hours_open,
        added_by_user_id=user.id if user else None,
    )
    db.add(place)
    db.commit()
    db.refresh(place)
    return place_to_dict(place, db)
