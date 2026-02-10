from flask import Blueprint, request
from flask_login import login_required
from datetime import datetime
from models import db, Absensi, Siswa
from utils.response import success_response, error_response, require_role

laporan_bp = Blueprint('laporan', __name__, url_prefix='/api/laporan')


@laporan_bp.route('/rekap', methods=['GET'])
@login_required
def get_rekap():
    """Get attendance recap with summary per student"""
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    kelas = request.args.get('kelas')
    
    try:
        if start_date:
            start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
        if end_date:
            end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
    except Exception:
        return error_response('Format tanggal tidak valid', 400)
    
    query = Siswa.query.filter_by(status='aktif')
    
    if kelas:
        query = query.filter_by(kelas=kelas)
    
    students = query.order_by(Siswa.nama).all()
    
    data = []
    
    for siswa in students:
        abs_query = Absensi.query.filter_by(siswa_id=siswa.id)
        
        if start_date:
            abs_query = abs_query.filter(Absensi.tanggal >= start_date)
        if end_date:
            abs_query = abs_query.filter(Absensi.tanggal <= end_date)
        
        absensis = abs_query.all()
        
        summary = {
            'hadir': sum(1 for a in absensis if a.status == 'Hadir'),
            'terlambat': sum(1 for a in absensis if a.status == 'Terlambat'),
            'sakit': sum(1 for a in absensis if a.status == 'Sakit'),
            'izin': sum(1 for a in absensis if a.status == 'Izin'),
            'alpha': sum(1 for a in absensis if a.status == 'Alpha'),
        }
        
        data.append({
            'siswa': {
                'id': siswa.id,
                'nis': siswa.nis,
                'nama': siswa.nama,
                'kelas': siswa.kelas
            },
            'summary': summary,
            'total_masuk': summary['hadir'] + summary['terlambat']
        })
    
    return success_response(data)


@laporan_bp.route('/export/csv', methods=['GET'])
@login_required
def export_csv():
    """Export attendance report as CSV"""
    import csv
    from io import StringIO
    from flask import make_response
    
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    
    try:
        if start_date:
            start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
        if end_date:
            end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
    except Exception:
        return error_response('Format tanggal tidak valid', 400)
    
    query = Absensi.query
    
    if start_date:
        query = query.filter(Absensi.tanggal >= start_date)
    if end_date:
        query = query.filter(Absensi.tanggal <= end_date)
    
    records = query.order_by(Absensi.tanggal.desc(), Absensi.waktu_masuk.desc()).all()
    
    # Create CSV
    output = StringIO()
    writer = csv.writer(output)
    
    writer.writerow(['Tanggal', 'NIS', 'Nama', 'Kelas', 'Waktu Masuk', 'Status'])
    
    for r in records:
        writer.writerow([
            r.tanggal.strftime('%Y-%m-%d'),
            r.siswa.nis,
            r.siswa.nama,
            r.siswa.kelas,
            r.waktu_masuk.strftime('%H:%M:%S') if r.waktu_masuk else '',
            r.status
        ])
    
    response = make_response(output.getvalue())
    response.headers['Content-Disposition'] = 'attachment; filename=rekap_absensi.csv'
    response.headers['Content-Type'] = 'text/csv'
    
    return response
