from . import db
from datetime import datetime


class RFIDCard(db.Model):
    """RFID card model"""
    __tablename__ = 'rfid_cards'
    
    id = db.Column(db.Integer, primary_key=True)
    uid = db.Column(db.String(100), unique=True, nullable=False, index=True)
    siswa_id = db.Column(db.Integer, db.ForeignKey('siswa.id'), nullable=False)
    status = db.Column(db.String(20), default='aktif')  # aktif, tidak_aktif
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<RFIDCard {self.uid}>'
