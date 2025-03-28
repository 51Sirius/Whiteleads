from .core.database_engine import SessionLocal
from .models import User
from sqlalchemy.orm import Session
from .core.security import pwd_context


def create_initial_user(db: Session):
    if User.find_by_username(db, "root") is None:
        User.create(db, "root", pwd_context.hash("rootroot"))

db = SessionLocal()
create_initial_user(db)
db.close()