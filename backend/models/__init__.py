from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from .user import User
from .siswa import Siswa
from .rfid_card import RFIDCard
from .absensi import Absensi

__all__ = ['db', 'User', 'Siswa', 'RFIDCard', 'Absensi']
