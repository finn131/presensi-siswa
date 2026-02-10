from . import db
from datetime import datetime


class Siswa(db.Model):
    """Student model"""
    __tablename__ = 'siswa'
    
    id = db.Column(db.Integer, primary_key=True)
    nis = db.Column(db.String(50), unique=True, nullable=False, index=True)
    nama = db.Column(db.String(120), nullable=False, index=True)
    kelas = db.Column(db.String(100), nullable=True)
    jenis_kelamin = db.Column(db.String(1), nullable=True)  # L, P
    alamat = db.Column(db.Text, nullable=True)
    no_telp = db.Column(db.String(20), nullable=True)
    status = db.Column(db.String(20), default='aktif')  # aktif, tidak_aktif
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # relationships
    rfid_cards = db.relationship('RFIDCard', backref='siswa', lazy=True, cascade='all, delete-orphan')
    absensis = db.relationship('Absensi', backref='siswa', lazy=True, cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<Siswa {self.nama}>'
