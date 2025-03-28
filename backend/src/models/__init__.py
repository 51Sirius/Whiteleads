from .base import Base
from ..core.database_engine import engine
from .user import User
from .vacancy import Vacancy


Base.metadata.create_all(engine)