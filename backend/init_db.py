from app import create_app
from models import db, User, Siswa, RFIDCard
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
        
        # Sample students (32 data)
        sample_students = [
            ('Ahmad Fauzi', 'L'),
            ('Siti Nurhaliza', 'P'),
            ('Budi Santoso', 'L'),
            ('Dewi Lestari', 'P'),
            ('Eko Prasetyo', 'L'),
            ('Rina Oktaviani', 'P'),
            ('Fajar Ramadhan', 'L'),
            ('Nabila Azzahra', 'P'),
            ('Rizky Maulana', 'L'),
            ('Intan Permata', 'P'),
            ('Dimas Saputra', 'L'),
            ('Alya Putri', 'P'),
            ('Yoga Pratama', 'L'),
            ('Citra Maharani', 'P'),
            ('Hendra Wijaya', 'L'),
            ('Larasati Dewi', 'P'),
            ('Andi Setiawan', 'L'),
            ('Nadia Safitri', 'P'),
            ('Bagas Nugroho', 'L'),
            ('Maya Sari', 'P'),
            ('Rafi Kurniawan', 'L'),
            ('Shania Putri', 'P'),
            ('Arif Hidayat', 'L'),
            ('Tiara Anindya', 'P'),
            ('Gilang Permana', 'L'),
            ('Zahra Khairunnisa', 'P'),
            ('Iqbal Firmansyah', 'L'),
            ('Dinda Ayu', 'P'),
            ('Farhan Akbar', 'L'),
            ('Nisa Rahma', 'P'),
            ('Yusuf Hamdani', 'L'),
            ('Safira Amelia', 'P'),
        ]

        classes = ['XII-RPL-1', 'XII-RPL-2', 'XII-TKJ-1', 'XII-TKJ-2']
        students = []
        for idx, (nama, jk) in enumerate(sample_students, start=1):
            students.append(
                Siswa(
                    nis=f'2024{idx:03d}',
                    nama=nama,
                    kelas=classes[(idx - 1) % len(classes)],
                    jenis_kelamin=jk
                )
            )
        
        db.session.add_all(students)
        db.session.commit()

        # Register RFID cards for students
        rfid_cards = []
        for idx, siswa in enumerate(students, start=1):
            if idx == 1:
                uid = 'A1B2C3D4'
            elif idx == 2:
                uid = 'E5F6G7H8'
            elif idx == 3:
                uid = 'I9J0K1L2'
            elif idx == 4:
                uid = 'M3N4O5P6'
            elif idx == 5:
                uid = 'Q7R8S9T0'
            else:
                uid = f'RFID{idx:04d}'
            rfid_cards.append(RFIDCard(uid=uid, siswa_id=siswa.id))
        
        db.session.add_all(rfid_cards)
        db.session.commit()
        
        print('✓ Database initialized successfully')
        print('  - Admin: admin / admin')
        print('  - Petugas: petugas / petugas')
        print(f'  - {len(students)} sample students created')


if __name__ == '__main__':
    init_db()
