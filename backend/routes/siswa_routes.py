from flask import Blueprint, request
from flask_login import login_required
from models import db, Siswa, RFIDCard
from utils.response import success_response, error_response, require_role
from utils.helpers import format_datetime

siswa_bp = Blueprint('siswa', __name__, url_prefix='/api/siswa')


@siswa_bp.route('/', methods=['GET'])
@login_required
def get_students():
    """Get all students"""
    status = request.args.get('status', 'aktif')
    kelas = request.args.get('kelas')
    
    query = Siswa.query
    
    if status:
        query = query.filter_by(status=status)
    
    if kelas:
        query = query.filter_by(kelas=kelas)
    
    students = query.order_by(Siswa.nama).all()
    
    data = [{
        'id': s.id,
        'nis': s.nis,
        'nama': s.nama,
        'kelas': s.kelas,
        'jenis_kelamin': s.jenis_kelamin,
        'alamat': s.alamat,
        'no_telp': s.no_telp,
        'status': s.status,
        'rfid_cards': [{'id': rc.id, 'uid': rc.uid} for rc in s.rfid_cards]
    } for s in students]
    
    return success_response(data)


@siswa_bp.route('/<int:siswa_id>', methods=['GET'])
@login_required
def get_student(siswa_id):
    """Get student by ID"""
    siswa = Siswa.query.get(siswa_id)
    
    if not siswa:
        return error_response('Siswa tidak ditemukan', 404)
    
    data = {
        'id': siswa.id,
        'nis': siswa.nis,
        'nama': siswa.nama,
        'kelas': siswa.kelas,
        'jenis_kelamin': siswa.jenis_kelamin,
        'alamat': siswa.alamat,
        'no_telp': siswa.no_telp,
        'status': siswa.status,
        'rfid_cards': [{'id': rc.id, 'uid': rc.uid} for rc in siswa.rfid_cards]
    }
    
    return success_response(data)


@siswa_bp.route('/', methods=['POST'])
@login_required
@require_role('admin')
def create_student():
    """Create new student"""
    data = request.get_json() or {}
    
    required = ['nis', 'nama']
    if not all(k in data for k in required):
        return error_response('NIS dan Nama diperlukan', 400)
    
    # Check if NIS exists
    if Siswa.query.filter_by(nis=data['nis']).first():
        return error_response('NIS sudah terdaftar', 409)
    
    siswa = Siswa(
        nis=data['nis'],
        nama=data['nama'],
        kelas=data.get('kelas'),
        jenis_kelamin=data.get('jenis_kelamin'),
        alamat=data.get('alamat'),
        no_telp=data.get('no_telp'),
        status=data.get('status', 'aktif')
    )
    
    db.session.add(siswa)
    db.session.commit()
    
    return success_response({'id': siswa.id}, 'Siswa berhasil ditambahkan', 201)


@siswa_bp.route('/<int:siswa_id>', methods=['PUT'])
@login_required
@require_role('admin')
def update_student(siswa_id):
    """Update student"""
    siswa = Siswa.query.get(siswa_id)
    
    if not siswa:
        return error_response('Siswa tidak ditemukan', 404)
    
    data = request.get_json() or {}
    
    # Update fields
    for field in ['nis', 'nama', 'kelas', 'jenis_kelamin', 'alamat', 'no_telp', 'status']:
        if field in data:
            setattr(siswa, field, data[field])
    
    db.session.commit()
    
    return success_response({'id': siswa.id}, 'Siswa berhasil diupdate')


@siswa_bp.route('/<int:siswa_id>/rfid', methods=['POST'])
@login_required
@require_role('admin')
def register_rfid(siswa_id):
    """Register RFID card for student"""
    siswa = Siswa.query.get(siswa_id)
    
    if not siswa:
        return error_response('Siswa tidak ditemukan', 404)
    
    data = request.get_json() or {}
    uid = data.get('uid')
    
    if not uid:
        return error_response('UID required', 400)
    
    # Check if UID already exists
    existing = RFIDCard.query.filter_by(uid=uid).first()
    if existing:
        return error_response('UID sudah terdaftar', 409)
    
    rfid = RFIDCard(uid=uid, siswa_id=siswa_id)
    db.session.add(rfid)
    db.session.commit()
    
    return success_response({'id': rfid.id}, 'RFID berhasil didaftarkan', 201)
