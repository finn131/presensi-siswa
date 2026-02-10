from app import create_app
from models import db, User, Siswa, Absensi, RFIDCard
from werkzeug.security import generate_password_hash


def init_db():
    """Initialize database with sample data"""
    app, _ = create_app()
    
    with app.app_context():
        # Drop and recreate tables
        db.drop_all()
        db.create_all()
        
        # Create admin user
        admin = User(
            username='admin',
            password=generate_password_hash('admin'),
            role='admin'
        )
        db.session.add(admin)
        
        # Create petugas user
        petugas = User(
            username='petugas',
            password=generate_password_hash('petugas'),
            role='petugas'
        )
        db.session.add(petugas)
        
        # Sample students
        students = [
            Siswa(nis='2024001', nama='Ahmad Fauzi', kelas='XII-RPL-1', jenis_kelamin='L'),
            Siswa(nis='2024002', nama='Siti Nurhaliza', kelas='XII-RPL-1', jenis_kelamin='P'),
            Siswa(nis='2024003', nama='Budi Santoso', kelas='XII-RPL-1', jenis_kelamin='L'),
            Siswa(nis='2024004', nama='Dewi Lestari', kelas='XII-RPL-2', jenis_kelamin='P'),
            Siswa(nis='2024005', nama='Eko Prasetyo', kelas='XII-TKJ-1', jenis_kelamin='L'),
        ]
        
        db.session.add_all(students)
        db.session.commit()
        
        # Register RFID cards for students
        rfid_cards = [
            RFIDCard(uid='A1B2C3D4', siswa_id=1),
            RFIDCard(uid='E5F6G7H8', siswa_id=2),
            RFIDCard(uid='I9J0K1L2', siswa_id=3),
            RFIDCard(uid='M3N4O5P6', siswa_id=4),
            RFIDCard(uid='Q7R8S9T0', siswa_id=5),
        ]
        
        db.session.add_all(rfid_cards)
        db.session.commit()
        
        print('✓ Database initialized successfully')
        print('  - Admin: admin / admin')
        print('  - Petugas: petugas / petugas')
        print(f'  - {len(students)} sample students created')


if __name__ == '__main__':
    init_db()
