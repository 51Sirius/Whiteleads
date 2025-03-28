from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..core.db_dependency import get_db
from ..models import Vacancy, User
from ..schemas import VacancyCreate, VacancyUpdate
from ..core.security import get_current_user
from ..service.hh_parse import get_vacancy
import datetime

router = APIRouter(prefix='/api/v1/vacancy')


@router.get('/get')
async def get_vacancy_all(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    vacancies = Vacancy.find_all(db)
    return {"vacancies": [v.json() for v in vacancies]}

@router.get('/get/{id}')
async def get_vacancy_by_id(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    vacancy = Vacancy.find_by_id(db, id)
    return {"vacancy": vacancy.json()}

@router.post('/create')
async def create_vacancy(vacancy: VacancyCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        if vacancy.hh_id != "":
            v = await get_vacancy(vacancy.hh_id)
            print(v)
            Vacancy.create(db, v['title'], v['description'], v['vacancy_created_at'], v['company_address'], v['company_name'], v['archived'], v['company_logo'])
            return {"vacancy": v}
        else:
            Vacancy.create(db, vacancy.company_name, vacancy.description, datetime.datetime.now, vacancy.company_address, vacancy.company_name, "active", vacancy.logo)


    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error creating vacancy: {str(e)}"
        )

@router.put('/update/{id}')
async def update_vacancy(id: int, vacancy: VacancyUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        v = Vacancy.find_by_id(db, id)
        Vacancy.update(db, v, vacancy.title, vacancy.description, datetime.datetime.now, vacancy.company_address, vacancy.company_name, vacancy.status, vacancy.logo)
        return {"vacancy": v.json()}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error updating vacancy: {str(e)}"
        )
    
@router.delete('/delete/{id}')
async def delete_vacancy(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        v = Vacancy.find_by_id(db, id)
        Vacancy.delete(db, v)
        return {"vacancy": v.json()}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error deleting vacancy: {str(e)}"
        )