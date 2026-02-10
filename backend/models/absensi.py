from . import db
from datetime import datetime, date


class Absensi(db.Model):
    """Attendance record model"""
    __tablename__ = 'absensi'
    
    id = db.Column(db.Integer, primary_key=True)
    siswa_id = db.Column(db.Integer, db.ForeignKey('siswa.id'), nullable=False)
    rfid_uid = db.Column(db.String(100), nullable=True)
    waktu_masuk = db.Column(db.DateTime, default=datetime.utcnow)
    waktu_keluar = db.Column(db.DateTime, nullable=True)
    status = db.Column(db.String(20), default='Hadir')  # Hadir, Terlambat, Sakit, Izin, Alpha
    keterangan = db.Column(db.Text, nullable=True)
    tanggal = db.Column(db.Date, default=date.today, index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<Absensi {self.siswa_id} {self.tanggal}>'
