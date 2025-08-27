from fastapi import FastAPI
from .db import Base, engine
from . import models 
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, notes

app = FastAPI()

# create tables - run it once
# Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "https://notes-add-app.netlify.app/"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Notes API is running!"}

app.include_router(auth.router)
app.include_router(notes.router)