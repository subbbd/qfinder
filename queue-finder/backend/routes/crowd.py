from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timedelta
from collections import defaultdict
from database import get_db
from models.models import CrowdReport, CrowdLevel, Place, User
from routes.auth import current_user

router = APIRouter(prefix="/crowd", tags=["crowd"])

FRESH_HOURS = 2
STALE_HOURS = 4
POINTS_PER_REPORT = 5


class CrowdReportRequest(BaseModel):
    place_id: int
    level: str           # quiet / moderate / busy
    note: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None


@router.post("/report")
def submit_report(
    body: CrowdReportRequest,
    db: Session = Depends(get_db),
    user: Optional[User] = Depends(current_user),
):
    place = db.query(Place).filter(Place.id == body.place_id).first()
    if not place:
        raise HTTPException(status_code=404, detail="Place not found")

    try:
        level = CrowdLevel(body.level)
    except ValueError:
        raise HTTPException(status_code=400, detail="Level must be quiet, moderate, or busy")

    # Prevent spam: same user same place within 30 min
    if user:
        cutoff = datetime.utcnow() - timedelta(minutes=30)
        duplicate = db.query(CrowdReport).filter(
            CrowdReport.place_id == body.place_id,
            CrowdReport.user_id == user.id,
            CrowdReport.created_at >= cutoff,
        ).first()
        if duplicate:
            raise HTTPException(status_code=429, detail="You already reported this place recently. Wait 30 minutes.")

    report = CrowdReport(
        place_id=body.place_id,
        user_id=user.id if user else None,
        level=level,
        note=body.note,
        latitude=body.latitude,
        longitude=body.longitude,
    )
    db.add(report)

    points_earned = 0
    if user:
        user.points += POINTS_PER_REPORT
        points_earned = POINTS_PER_REPORT

    db.commit()
    return {"success": True, "points_earned": points_earned, "total_points": user.points if user else None}


@router.get("/place/{place_id}")
def get_crowd(place_id: int, db: Session = Depends(get_db)):
    place = db.query(Place).filter(Place.id == place_id).first()
    if not place:
        raise HTTPException(status_code=404, detail="Place not found")

    cutoff = datetime.utcnow() - timedelta(hours=FRESH_HOURS)
    recent = (
        db.query(CrowdReport)
        .filter(CrowdReport.place_id == place_id, CrowdReport.created_at >= cutoff)
        .order_by(CrowdReport.created_at.desc())
        .limit(3)
        .all()
    )

    if not recent:
        return {"level": "none", "report_count": 0, "last_reported_at": None, "reports": []}

    scores = {"quiet": 1, "moderate": 2, "busy": 3}
    avg = sum(scores[r.level.value] for r in recent) / len(recent)
    level = "quiet" if avg < 1.67 else "moderate" if avg < 2.34 else "busy"

    return {
        "level": level,
        "report_count": len(recent),
        "last_reported_at": recent[0].created_at.isoformat(),
        "reports": [
            {"level": r.level.value, "note": r.note, "reported_at": r.created_at.isoformat()}
            for r in recent
        ],
    }


@router.get("/place/{place_id}/history")
def get_history(place_id: int, db: Session = Depends(get_db)):
    """Returns hourly crowd averages for the last 7 days (for the trend chart)."""
    cutoff = datetime.utcnow() - timedelta(days=90)
    reports = db.query(CrowdReport).filter(
        CrowdReport.place_id == place_id,
        CrowdReport.created_at >= cutoff,
    ).all()

    hour_buckets = defaultdict(list)
    scores = {"quiet": 1, "moderate": 2, "busy": 3}
    for r in reports:
        hour_buckets[r.created_at.hour].append(scores[r.level.value])

    result = []
    for hour in range(24):
        vals = hour_buckets.get(hour, [])
        avg = sum(vals) / len(vals) if vals else 0
        label = f"{hour % 12 or 12}{'am' if hour < 12 else 'pm'}"
        result.append({"hour": label, "level": round(avg / 3 * 100)})  # 0-100 scale for chart

    return result
