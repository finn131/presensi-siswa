from flask import Blueprint, request
from flask_login import login_required, current_user
from datetime import datetime, date
from models import db, Siswa, Absensi, RFIDCard
from services.absensi_service import AbsensiService, RFIDService
from utils.response import success_response, error_response, require_role
from utils.helpers import format_datetime, format_date

absensi_bp = Blueprint('absensi', __name__, url_prefix='/api/absensi')


@absensi_bp.route('/scan', methods=['POST'])
def scan_rfid():
    """RFID scan endpoint - records attendance"""
    data = request.get_json() or {}
    uid = data.get('uid')
    
    if not uid:
        return error_response('UID required', 400)
    
    # Find student by RFID UID
    siswa = RFIDService.find_student_by_uid(uid)
    
    if not siswa:
        return error_response('UID tidak terdaftar', 404)
    
    if siswa.status != 'aktif':
        return error_response('Siswa tidak aktif', 400)
    
    # Record attendance
    absensi, msg = AbsensiService.record_attendance(siswa.id, uid)
    
    if not absensi:
        return error_response(msg, 409)
    
    payload = {
        'id': absensi.id,
        'siswa': {
            'id': siswa.id,
            'nama': siswa.nama,
            'nis': siswa.nis,
            'kelas': siswa.kelas
        },
        'waktu_masuk': format_datetime(absensi.waktu_masuk),
        'status': absensi.status,
        'tanggal': format_date(absensi.tanggal)
    }
    
    return success_response(payload, 'Absensi berhasil', 201)


@absensi_bp.route('/today', methods=['GET'])
@login_required
def get_today_attendance():
    """Get today's attendance records"""
    records = AbsensiService.get_today_attendance()
    
    data = [{
        'id': r.id,
        'siswa': {
            'id': r.siswa.id,
            'nama': r.siswa.nama,
            'nis': r.siswa.nis,
            'kelas': r.siswa.kelas
        },
        'waktu_masuk': format_datetime(r.waktu_masuk),
        'status': r.status,
        'tanggal': format_date(r.tanggal)
    } for r in records]
    
    return success_response(data)


@absensi_bp.route('/stats', methods=['GET'])
@login_required
def get_stats():
    """Get attendance statistics"""
    tanggal = request.args.get('tanggal')
    
    if tanggal:
        try:
            tanggal = datetime.strptime(tanggal, '%Y-%m-%d').date()
        except Exception:
            return error_response('Format tanggal tidak valid', 400)
    
    stats = AbsensiService.get_attendance_stats(tanggal)
    total_siswa = Siswa.query.filter_by(status='aktif').count()
    
    stats['total_siswa'] = total_siswa
    stats['total_tidak_hadir'] = total_siswa - stats['total_masuk']
    
    return success_response(stats)


@absensi_bp.route('/report', methods=['GET'])
@login_required
def get_report():
    """Get attendance report with filters"""
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    siswa_id = request.args.get('siswa_id')
    
    try:
        if start_date:
            start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
        if end_date:
            end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
    except Exception:
        return error_response('Format tanggal tidak valid', 400)
    
    records = AbsensiService.get_attendance_report(start_date, end_date, siswa_id)
    
    data = [{
        'id': r.id,
        'siswa': {
            'id': r.siswa.id,
            'nama': r.siswa.nama,
            'nis': r.siswa.nis,
            'kelas': r.siswa.kelas
        },
        'waktu_masuk': format_datetime(r.waktu_masuk),
        'status': r.status,
        'tanggal': format_date(r.tanggal)
    } for r in records]
    
    return success_response(data)
