import os
from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from passlib.hash import bcrypt
from sqlalchemy.orm import Session
from uuid import UUID

from ..db import get_db
from ..models import User

# env/config
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("JWT_ALGO", "HS256")
ACCESS_TOKEN_EXPIRE_MIN = int(os.getenv("ACCESS_TOKEN_EXPIRE_MIN", "60"))

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_password_hash(password: str) -> str:
    return bcrypt.hash(password)

def verify_password(password: str, password_hash: str) -> bool:
    return bcrypt.verify(password, password_hash)

def create_access_token(sub: str, expires_minutes: int = ACCESS_TOKEN_EXPIRE_MIN) -> str:
    now = datetime.now(timezone.utc)
    payload = {"sub": sub, "iat": int(now.timestamp())}
    if expires_minutes:
        payload["exp"] = int((now + timedelta(minutes=expires_minutes)).timestamp())
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    cred_exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        sub = payload.get("sub")
        if not sub:
            raise cred_exc
        user_id = UUID(sub)
    except JWTError:
        raise cred_exc

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise cred_exc
    return user