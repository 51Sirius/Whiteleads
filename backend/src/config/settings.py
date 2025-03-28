from pydantic import BaseSettings
import os

class Settings(BaseSettings):
    DATABASE_URL: str = os.environ["DATABASE_URL"]
    DB_DATABASE: str = os.environ["DB_DATABASE"]

    SECRET_KEY: str = os.environ["SECRET_KEY"]
    ACCESS_TOKEN_EXPIRE_MINUTES: int = os.environ["ACCESS_TOKEN_EXPIRE_MINUTES"]
    REFRESH_TOKEN_EXPIRE_DAYS: int = os.environ["REFRESH_TOKEN_EXPIRE_DAYS"]
    ALGORITHM: str = os.environ["ALGORITHM"]

    CLIENT_ORIGIN: str = os.environ["CLIENT_ORIGIN"]

    class Config:
        env_file = ".env"
        
settings = Settings()