# Sistem Presensi Siswa - Backend

Flask API untuk sistem presensi siswa dengan integrasi RFID.

## Setup

### 1. Buat Virtual Environment
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# atau
venv\Scripts\activate  # Windows
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Konfigurasi Environment
```bash
cp .env.example .env
```

### 4. Initialize Database
```bash
python init_db.py
```

Sample data:
- Admin: `admin` / `admin`
- Petugas: `petugas` / `petugas`
- 5 sample students dengan RFID UIDs

### 5. Run Server
```bash
python app.py
```

Server akan berjalan di `http://localhost:5000`

## API Endpoints

### Auth
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Absensi
- `POST /api/absensi/scan` - Scan RFID UID
- `GET /api/absensi/today` - Get today's attendance
- `GET /api/absensi/stats` - Get statistics
- `GET /api/absensi/report` - Get attendance report

### Siswa
- `GET /api/siswa/` - Get all students
- `GET /api/siswa/<id>` - Get student detail
- `POST /api/siswa/` - Create student (admin)
- `PUT /api/siswa/<id>` - Update student (admin)
- `POST /api/siswa/<id>/rfid` - Register RFID (admin)

### Laporan
- `GET /api/laporan/rekap` - Get recap
- `GET /api/laporan/export/csv` - Export CSV

## Test RFID Scan

```bash
curl -X POST http://localhost:5000/api/absensi/scan \
  -H "Content-Type: application/json" \
  -d '{"uid":"A1B2C3D4"}'
```

Sample UIDs: A1B2C3D4, E5F6G7H8, I9J0K1L2, M3N4O5P6, Q7R8S9T0
