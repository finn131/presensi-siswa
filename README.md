# Sistem Presensi Siswa dengan RFID

Aplikasi web lengkap untuk manajemen presensi siswa menggunakan kartu RFID, dibangun dengan Flask (Backend) dan React (Frontend).

## 📋 Fitur

### Backend (Flask)
- ✅ Login multi-user (Admin/Petugas) dengan hashed password
- ✅ Integrasi RFID - endpoint `/api/absensi/scan` menerima UID
- ✅ Realtime update menggunakan Flask-SocketIO
- ✅ Database SQLite dengan SQLAlchemy ORM
- ✅ RESTful API dengan role-based access control
- ✅ Export CSV untuk laporan absensi
- ✅ Modular architecture (models, routes, services, utils)

### Frontend (React + Vite)
- ✅ UI modern dengan Tailwind CSS dan glassmorphism design
- ✅ Smooth animations menggunakan Animate.css
- ✅ Dashboard dengan real-time stats
- ✅ Halaman scan RFID dengan feedback
- ✅ Manajemen data siswa
- ✅ Rekap absensi dengan filter tanggal
- ✅ Responsive sidebar navigation
- ✅ Toast notifications
- ✅ Auth context dan custom hooks

## 🚀 Quick Start

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate

pip install -r requirements.txt
python init_db.py
python app.py
```

Backend running at: `http://localhost:5000`

Credentials:
- Admin: `admin` / `admin`
- Petugas: `petugas` / `petugas`

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Frontend running at: `http://localhost:5173`

## 📊 Project Structure

```
absensi-rfid/
├── backend/
│   ├── app.py                    # Flask app entry point
│   ├── config.py                 # Configuration
│   ├── init_db.py                # Database initialization
│   ├── requirements.txt
│   │
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py               # Admin/Petugas model
│   │   ├── siswa.py              # Student model
│   │   ├── rfid_card.py          # RFID card model
│   │   └── absensi.py            # Attendance record model
│   │
│   ├── routes/
│   │   ├── auth_routes.py        # Login/logout endpoints
│   │   ├── absensi_routes.py     # RFID scan & attendance
│   │   ├── siswa_routes.py       # Student management
│   │   └── laporan_routes.py     # Attendance reports
│   │
│   ├── services/
│   │   ├── rfid_service.py       # RFID card operations
│   │   └── absensi_service.py    # Attendance logic
│   │
│   └── utils/
│       ├── response.py           # Standard JSON responses
│       └── helpers.py            # Helper functions
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   │
│   ├── public/
│   │   └── index.html
│   │
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       │
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Sidebar.jsx
│       │   ├── Card.jsx
│       │   ├── Table.jsx
│       │   └── LoadingSpinner.jsx
│       │
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── Dashboard.jsx
│       │   ├── Rekap.jsx
│       │   ├── DataSiswa.jsx
│       │   └── ScanRFID.jsx
│       │
│       ├── services/
│       │   └── api.js
│       │
│       ├── hooks/
│       │   └── useAuth.js
│       │
│       ├── context/
│       │   └── AuthContext.jsx
│       │
│       ├── routes/
│       │   └── AppRoutes.jsx
│       │
│       └── styles/
│           └── index.css
│
├── docs/
└── README.md
```

## 🧪 Testing

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'
```

### Test RFID Scan (Sample UIDs)
```bash
curl -X POST http://localhost:5000/api/absensi/scan \
  -H "Content-Type: application/json" \
  -d '{"uid":"A1B2C3D4"}'
```

Available UIDs: A1B2C3D4, E5F6G7H8, I9J0K1L2, M3N4O5P6, Q7R8S9T0

## 📚 Database Schema

### Users
- id, username, password (hashed), role, is_active, created_at

### Siswa
- id, nis, nama, kelas, jenis_kelamin, alamat, no_telp, status, created_at, updated_at

### RFID Cards
- id, uid (unique), siswa_id (FK), status, created_at

### Absensi
- id, siswa_id (FK), rfid_uid, waktu_masuk, waktu_keluar, status, keterangan, tanggal, created_at

## 🔐 Security Features

- Password hashing dengan Werkzeug
- Flask-Login for session management
- Role-based access control (RBAC)
- CORS configured for security
- Input validation on all endpoints

## 📦 Tech Stack

**Backend:**
- Flask 2.3.3
- Flask-Login 0.6.2
- Flask-SQLAlchemy 3.0.3
- Flask-SocketIO 6.5.3

**Frontend:**
- React 18.2.0
- Vite 5.0.0
- React Router 6
- Tailwind CSS 3.3
- Animate.css 4.1.1

## 🤝 Konhibusi

Untuk menyarankan fitur atau melaporkan bug, silakan buat issue atau pull request.

## 📄 License

MIT License
