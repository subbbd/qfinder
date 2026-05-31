"""Run once to populate the database with sample Indian shops for testing."""
from database import SessionLocal, engine, Base
from models.models import Place, PlaceCategory, CrowdReport, CrowdLevel
from datetime import datetime, timedelta
import random

Base.metadata.create_all(bind=engine)

SAMPLE_PLACES = [
    # Mumbai - Andheri area
    {"name": "Ramesh Medical Store", "category": "pharmacy", "area": "Andheri West", "city": "Mumbai", "lat": 19.1136, "lon": 72.8697, "hours": "8am-10pm"},
    {"name": "D-Mart Andheri", "category": "grocery", "area": "Andheri East", "city": "Mumbai", "lat": 19.1076, "lon": 72.8786, "hours": "8am-10pm"},
    {"name": "Suresh Kirana Store", "category": "grocery", "area": "Andheri West", "city": "Mumbai", "lat": 19.1180, "lon": 72.8360, "hours": "7am-9pm"},
    {"name": "Apollo Pharmacy", "category": "pharmacy", "area": "Versova", "city": "Mumbai", "lat": 19.1310, "lon": 72.8167, "hours": "24 hours"},
    {"name": "Fresh Sabziwala", "category": "vegetable", "area": "Andheri West", "city": "Mumbai", "lat": 19.1200, "lon": 72.8310, "hours": "6am-1pm"},

    # Delhi - Saket area
    {"name": "Jan Aushadhi Kendra", "category": "pharmacy", "area": "Saket", "city": "Delhi", "lat": 28.5245, "lon": 77.2066, "hours": "9am-8pm"},
    {"name": "Big Bazaar Saket", "category": "grocery", "area": "Saket", "city": "Delhi", "lat": 28.5218, "lon": 77.2041, "hours": "10am-10pm"},
    {"name": "Sharma Ji Ki Dukaan", "category": "general", "area": "Malviya Nagar", "city": "Delhi", "lat": 28.5330, "lon": 77.2090, "hours": "8am-9pm"},
    {"name": "Mother Dairy Booth", "category": "dairy", "area": "Saket", "city": "Delhi", "lat": 28.5280, "lon": 77.2100, "hours": "6am-1pm, 4pm-8pm"},

    # Bangalore - Koramangala
    {"name": "Medplus Pharmacy", "category": "pharmacy", "area": "Koramangala", "city": "Bangalore", "lat": 12.9279, "lon": 77.6271, "hours": "8am-10pm"},
    {"name": "More Supermarket", "category": "grocery", "area": "HSR Layout", "city": "Bangalore", "lat": 12.9121, "lon": 77.6446, "hours": "9am-9pm"},
    {"name": "Mahalakshmi Stores", "category": "grocery", "area": "Koramangala 4th Block", "city": "Bangalore", "lat": 12.9345, "lon": 77.6167, "hours": "7am-9pm"},
    {"name": "Iyer Bakery", "category": "bakery", "area": "Indiranagar", "city": "Bangalore", "lat": 12.9784, "lon": 77.6408, "hours": "7am-9pm"},
]

def seed():
    db = SessionLocal()
    try:
        if db.query(Place).count() > 0:
            print("Database already has places. Skipping seed.")
            return

        places = []
        for p in SAMPLE_PLACES:
            place = Place(
                name=p["name"],
                category=PlaceCategory(p["category"]),
                area=p["area"],
                city=p["city"],
                latitude=p["lat"],
                longitude=p["lon"],
                hours_open=p["hours"],
                is_verified=True,
            )
            db.add(place)
            places.append(place)

        db.commit()

        # Add some recent crowd reports
        levels = [CrowdLevel.quiet, CrowdLevel.moderate, CrowdLevel.busy]
        for place in places:
            for mins_ago in [10, 40, 90]:
                report = CrowdReport(
                    place_id=place.id,
                    level=random.choice(levels),
                    created_at=datetime.utcnow() - timedelta(minutes=mins_ago),
                )
                db.add(report)

        db.commit()
        print(f"Seeded {len(places)} places with crowd data.")
    finally:
        db.close()

if __name__ == "__main__":
    seed()
