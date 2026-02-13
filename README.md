# Sistem Presensi Siswa (RFID)

Aplikasi presensi siswa berbasis RFID dengan backend Flask dan frontend React (Vite).

## Fitur Utama
- Login multi-user (`admin` / `petugas`) + CAPTCHA gambar
- Scan RFID untuk mencatat absensi harian
- Statistik dan tabel absensi harian
- Rekap absensi dengan filter tanggal
- Manajemen data siswa dan kartu RFID
- Penyimpanan `nama_siswa` langsung di tabel `absensi`
- Seed data bawaan: 32 siswa + UID RFID

## Struktur Project

```text
absensi-siswa/
├── docker-compose.yml
├── README.md
├── backend/
│   ├── app.py
│   ├── config.py
│   ├── init_db.py
│   ├── requirements.txt
│   ├── database.db
│   ├── routes/
│   │   ├── auth_routes.py
│   │   ├── absensi_routes.py
│   │   ├── siswa_routes.py
│   │   └── laporan_routes.py
│   ├── services/
│   │   ├── absensi_service.py
│   │   └── rfid_service.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── siswa.py
│   │   ├── rfid_card.py
│   │   └── absensi.py
│   └── utils/
│       ├── helpers.py
│       └── response.py
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── nginx.conf
    ├── Dockerfile
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── components/
        ├── context/
        ├── hooks/
        ├── pages/
        ├── routes/
        ├── services/
        └── styles/
```

## Jalankan Dengan Docker (Disarankan)

Dari folder `absensi-siswa`:

```bash
docker compose up --build
```

Akses:
- Frontend: `http://localhost:8080`
- Backend API: `http://localhost:5000`

Catatan:
- Database SQLite disimpan di volume `backend_data`
- `init_db.py` otomatis dijalankan jika database belum ada

## Jalankan Manual (Tanpa Docker)

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python init_db.py
python app.py
```

### Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Kredensial Default
- Admin: `admin` / `admin`
- Petugas: `petugas` / `petugas`

## Seed Data Siswa & UID
- Total sample siswa: **32**
- UID siswa 1-5:
  - `A1B2C3D4`
  - `E5F6G7H8`
  - `I9J0K1L2`
  - `M3N4O5P6`
  - `Q7R8S9T0`
- UID siswa 6-32 mengikuti pola: `RFID0006` s/d `RFID0032`

## Endpoint API

### Auth
- `GET /api/auth/captcha`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Absensi
- `POST /api/absensi/scan`
- `GET /api/absensi/today`
- `GET /api/absensi/stats`
- `GET /api/absensi/report`

### Siswa
- `GET /api/siswa/`
- `GET /api/siswa/<id>`
- `POST /api/siswa/`
- `PUT /api/siswa/<id>`
- `POST /api/siswa/<id>/rfid`

### Laporan
- `GET /api/laporan/rekap`
- `GET /api/laporan/export/csv`

## Skema Data Penting

### `absensi`
Kolom utama:
- `id`
- `siswa_id`
- `nama_siswa`
- `rfid_uid`
- `waktu_masuk`
- `status`
- `tanggal`

`nama_siswa` diisi saat proses scan agar nama pelaku absensi tetap tersimpan langsung di record.

## Re-init Database

Kalau ingin reset semua data dan generate ulang 32 siswa:

```bash
cd backend
python init_db.py
```
