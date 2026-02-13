from datetime import datetime, date
from models import db, RFIDCard, Siswa, Absensi
from utils.helpers import get_attendance_status


class RFIDService:
    """Service for RFID card operations"""
    
    @staticmethod
    def find_student_by_uid(uid):
        """Find student by RFID UID"""
        rfid_card = RFIDCard.query.filter_by(uid=uid, status='aktif').first()
        if rfid_card:
            return rfid_card.siswa
        return None
    
    @staticmethod
    def register_card(uid, siswa_id):
        """Register new RFID card for student"""
        existing = RFIDCard.query.filter_by(uid=uid).first()
        if existing:
            raise ValueError(f'UID {uid} already registered')
        
        card = RFIDCard(uid=uid, siswa_id=siswa_id)
        db.session.add(card)
        db.session.commit()
        return card
    
    @staticmethod
    def deactivate_card(uid):
        """Deactivate RFID card"""
        card = RFIDCard.query.filter_by(uid=uid).first()
        if card:
            card.status = 'tidak_aktif'
            db.session.commit()
        return card


class AbsensiService:
    """Service for attendance operations"""
    
    @staticmethod
    def check_attendance(siswa_id, tanggal=None):
        """Check if student already attended today"""
        if tanggal is None:
            tanggal = date.today()
        
        return Absensi.query.filter_by(
            siswa_id=siswa_id,
            tanggal=tanggal
        ).first()
    
    @staticmethod
    def record_attendance(siswa_id, rfid_uid=None, scan_time=None):
        """Record student attendance"""
        now = scan_time or datetime.now()
        today = now.date()
        
        # Check if already attended
        existing = AbsensiService.check_attendance(siswa_id, today)
        if existing:
            return None, 'Sudah Absen'
        
        # Determine status
        status = get_attendance_status(now.time())
        siswa = Siswa.query.get(siswa_id)
        nama_siswa = siswa.nama if siswa else None
        
        # Create attendance record
        absensi = Absensi(
            siswa_id=siswa_id,
            nama_siswa=nama_siswa,
            rfid_uid=rfid_uid,
            waktu_masuk=now,
            status=status,
            tanggal=today
        )
        
        db.session.add(absensi)
        db.session.commit()
        
        return absensi, 'ok'
    
    @staticmethod
    def get_today_attendance():
        """Get all attendance records for today"""
        today = date.today()
        return Absensi.query.filter_by(tanggal=today).order_by(
            Absensi.waktu_masuk.desc()
        ).all()
    
    @staticmethod
    def get_attendance_report(start_date=None, end_date=None, siswa_id=None):
        """Get attendance report with filters"""
        query = Absensi.query
        
        if start_date:
            query = query.filter(Absensi.tanggal >= start_date)
        
        if end_date:
            query = query.filter(Absensi.tanggal <= end_date)
        
        if siswa_id:
            query = query.filter_by(siswa_id=siswa_id)
        
        return query.order_by(Absensi.waktu_masuk.desc()).all()
    
    @staticmethod
    def get_attendance_stats(tanggal=None):
        """Get attendance statistics for a given date"""
        if tanggal is None:
            tanggal = date.today()
        
        query = Absensi.query.filter_by(tanggal=tanggal)
        
        stats = {
            'total_hadir': query.filter_by(status='Hadir').count(),
            'total_terlambat': query.filter_by(status='Terlambat').count(),
            'total_sakit': query.filter_by(status='Sakit').count(),
            'total_izin': query.filter_by(status='Izin').count(),
            'total_alpha': query.filter_by(status='Alpha').count(),
        }
        
        stats['total_masuk'] = stats['total_hadir'] + stats['total_terlambat']
        
        return stats
