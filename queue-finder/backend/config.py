from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:password@localhost:5432/qfinder"
    SECRET_KEY: str = "change-this-to-a-long-random-string"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080  # 7 days
    GOOGLE_PLACES_API_KEY: str = ""
    ALGORITHM: str = "HS256"

    class Config:
        env_file = ".env"

settings = Settings()
