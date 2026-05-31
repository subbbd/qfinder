from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Enum, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from database import Base


class CrowdLevel(str, enum.Enum):
    quiet = "quiet"
    moderate = "moderate"
    busy = "busy"


class PlaceCategory(str, enum.Enum):
    pharmacy = "pharmacy"
    grocery = "grocery"
    general = "general"
    medical = "medical"
    vegetable = "vegetable"       # kirana / sabzi mandi
    dairy = "dairy"
    bakery = "bakery"
    electronics = "electronics"
    other = "other"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    display_name = Column(String, nullable=True)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    is_shop_owner = Column(Boolean, default=False)
    points = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    crowd_reports = relationship("CrowdReport", back_populates="reporter")
    owned_places = relationship("Place", foreign_keys="Place.owner_id", back_populates="owner")


class Place(Base):
    __tablename__ = "places"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    category = Column(Enum(PlaceCategory), default=PlaceCategory.general)
    address = Column(String, nullable=True)         # optional for small shops
    area = Column(String, nullable=True)            # neighbourhood / locality
    city = Column(String, nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    hours_open = Column(String, nullable=True)      # e.g. "9am-9pm"
    is_verified = Column(Boolean, default=False)    # owner has claimed it
    added_by_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    google_place_id = Column(String, nullable=True) # link to Google Places if available
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    owner = relationship("User", foreign_keys=[owner_id], back_populates="owned_places", primaryjoin="Place.owner_id == User.id")
    crowd_reports = relationship("CrowdReport", back_populates="place")


class CrowdReport(Base):
    __tablename__ = "crowd_reports"

    id = Column(Integer, primary_key=True, index=True)
    place_id = Column(Integer, ForeignKey("places.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # null = guest
    level = Column(Enum(CrowdLevel), nullable=False)
    note = Column(Text, nullable=True)              # optional short comment
    latitude = Column(Float, nullable=True)         # GPS at time of report
    longitude = Column(Float, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    place = relationship("Place", back_populates="crowd_reports")
    reporter = relationship("User", back_populates="crowd_reports")
