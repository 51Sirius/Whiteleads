from fastapi import Depends, HTTPException, status
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from fastapi.security import HTTPBearer,HTTPAuthorizationCredentials
from datetime import datetime, timedelta, timezone
from .db_dependency import get_db
from ..models import User
from ..config.settings import settings


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

def authenticate_user(db: Session, username: str, password: str):
    try:
        user = User.find_by_username(db, username)
        if not user:
            return False
            
        if not pwd_context.verify(password, user.password):
            return False
            
        return user
    except Exception as e:
        return False
    
def create_token(data: dict, expires_delta: timedelta, secret_key: str):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, secret_key, algorithm=settings.ALGORITHM)

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security), 
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        token = credentials.credentials
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username: str = payload.get("sub")
        if not username:
            raise credentials_exception
            
        user = User.find_by_username(db, username)
        if not user:
            raise credentials_exception
            
        return user
    except JWTError as e:
        raise credentials_exception
