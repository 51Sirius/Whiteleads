from sqlalchemy import Column, Integer, String
from .base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password = Column(String)
    
    def json(self):
        return {
            "id": self.id,
            "username": self.username
        }
    
    @classmethod
    def find_by_username(cls, db, username):
        return db.query(cls).filter_by(username=username).first()
    
    @classmethod
    def find_by_id(cls, db, id):
        return db.query(cls).filter_by(id=id).first()
    
    @classmethod
    def find_all(cls, db):
        return db.query(cls).all()
    
    @classmethod
    def create(cls, db, username, password):
        user = cls(username=username, password=password)
        db.add(user)
        db.commit()
        return user
    
    @classmethod
    def delete(cls, db, user):
        db.delete(user)
        db.commit()