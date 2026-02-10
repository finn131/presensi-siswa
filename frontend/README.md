# Sistem Presensi Siswa - Frontend

React + Vite frontend untuk sistem presensi siswa.

## Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Konfigurasi Environment
```bash
cp .env.example .env.local
```

### 3. Run Development Server
```bash
npm run dev
```

Frontend akan berjalan di `http://localhost:5173`

### 4. Build Production
```bash
npm run build
```

## Features

- **Login** - Multi-user authentication (Admin/Petugas)
- **Dashboard** - Real-time statistics dengan Socket.IO
- **Scan RFID** - Input UID kartu RFID
- **Data Siswa** - Manage student data
- **Rekap Absensi** - View dan filter attendance records
- **Export CSV** - Export attendance report

## Technology Stack

- React 18
- Vite 5
- React Router 6
- Axios
- Socket.IO Client
- Tailwind CSS
- Animate.css

## Component Structure

```
src/
├── components/      # Reusable components
│   ├── Navbar.jsx
│   ├── Sidebar.jsx
│   ├── Card.jsx
│   ├── Table.jsx
│   └── LoadingSpinner.jsx
├── pages/           # Page components
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── Rekap.jsx
│   ├── DataSiswa.jsx
│   └── ScanRFID.jsx
├── services/        # API services
│   └── api.js
├── context/         # React context
│   └── AuthContext.jsx
├── hooks/           # Custom hooks
│   └── useAuth.js
├── routes/          # Route config
│   └── AppRoutes.jsx
└── styles/          # Stylesheets
    └── index.css
```

## Environment Variables

- `VITE_API_URL` - Backend API URL (default: http://localhost:5000)
