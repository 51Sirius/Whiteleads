from sqlalchemy import Column, Integer, String
from .base import Base

class Vacancy(Base):
    __tablename__ = "vacancies" 

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    date = Column(String)
    address = Column(String)
    company = Column(String)
    status = Column(String)
    logo = Column(String)
    
    def json(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "date": self.date,
            "address": self.address,
            "company": self.company,
            "status": self.status,
            "logo": self.logo
        }
    
    @classmethod
    def find_by_id(cls, db, id):
        return db.query(cls).filter_by(id=id).first()
    
    @classmethod
    def find_all(cls, db):
        return db.query(cls).all()
    
    @classmethod
    def create(cls, db, title, description, date, address, company, status, logo):
        vacancy = cls(title=title, description=description, date=date, address=address, company=company, status=status, logo=logo)
        db.add(vacancy)
        db.commit()
        return vacancy
    
    @classmethod
    def delete(cls, db, vacancy):
        db.delete(vacancy)
        db.commit()

    @classmethod
    def detele_by_id(cls, db, id):
        db.query(cls).filter_by(id=id).delete()
        db.commit()

    @classmethod
    def update(cls, db, vacancy, title, description, date, address, company, status, logo):
        vacancy.title = title
        vacancy.description = description
        vacancy.date = date
        vacancy.address = address
        vacancy.company = company
        vacancy.status = status
        vacancy.logo = logo
        db.commit()