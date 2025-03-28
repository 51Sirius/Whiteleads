from fastapi import APIRouter, Depends, Request, Response, HTTPException, status
from sqlalchemy.orm import Session
from ..core.db_dependency import get_db
from ..core.security import get_current_user, create_token, authenticate_user
from ..models import User
from datetime import timedelta
from jose import JWTError, jwt
from ..config.settings import settings
from ..schemas import Token, TokenData, UserCreate


router = APIRouter(prefix='/api/v1/auth')

@router.get('/me', response_model=TokenData)
async def me(user: User = Depends(get_current_user)):
    return {"username": user.username}

@router.post('/token', response_model=Token)
async def login(
    response: Response,
    form_data: UserCreate,
    db: Session = Depends(get_db)
):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )
        
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_token(
        data={"sub": user.username}, 
        expires_delta=access_token_expires,
        secret_key=settings.SECRET_KEY
    )
    
    refresh_token_expires = timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    refresh_token = create_token(
        data={"sub": user.username},
        expires_delta=refresh_token_expires,
        secret_key=settings.SECRET_KEY
    )
    
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
        secure=True,
        samesite="Lax"
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.post('/refresh', response_model=Token)
async def refresh_token(
    response: Response, 
    request: Request,
    db: Session = Depends(get_db), 
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
    )
    
    try:
        refresh_token = request.cookies.get("refresh_token")
        if not refresh_token:
            raise credentials_exception
            
        payload = jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username: str = payload.get("sub")
        if not username:
            raise credentials_exception
            
        user = User.find_by_username(db, username)
        if not user:
            raise credentials_exception
            
        access_token = create_token(
            data={"sub": user.username}, 
            expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
            secret_key=settings.SECRET_KEY
        )
        
        new_refresh_token = create_token(
            data={"sub": user.username},
            expires_delta=timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
            secret_key=settings.SECRET_KEY
        )
        
        response.set_cookie(
            key="refresh_token",
            value=new_refresh_token,
            httponly=True,
            max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
            secure=True,
            samesite="Lax"
        )
        
        return {"access_token": access_token, "token_type": "bearer"}
        
    except JWTError:
        raise credentials_exception
    
@router.post('/logout')
async def logout(response: Response):
    response.delete_cookie(key="refresh_token")
    return {"message": "Successfully logged out"}