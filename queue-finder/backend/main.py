from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
from routes import auth, places, crowd

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Qfinder API", version="1.0.0", description="Real-time crowd and inventory finder")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(places.router, prefix="/api")
app.include_router(crowd.router, prefix="/api")


@app.get("/api/health")
def health():
    return {"status": "ok", "service": "Qfinder API"}
