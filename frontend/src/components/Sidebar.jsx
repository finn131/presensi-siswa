import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Sidebar() {
  const location = useLocation()
  const { user } = useAuth()
  
  const isActive = (path) => location.pathname === path ? 'bg-blue-600 text-white' : 'hover:bg-white/40'

  return (
    <aside className="hidden md:block w-64 bg-gradient-to-b from-slate-100 to-slate-50 p-6">
      <div className="glass p-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Sistem Presensi</h2>
        <p className="text-xs text-gray-600 mt-1">{user?.role}</p>
      </div>
      
      <nav className="space-y-2">
        <Link to="/dashboard" className={`block px-4 py-3 rounded-lg transition ${isActive('/dashboard')}`}>
          📊 Dashboard
        </Link>
        <Link to="/scan" className={`block px-4 py-3 rounded-lg transition ${isActive('/scan')}`}>
          📱 Scan RFID
        </Link>
        <Link to="/data-siswa" className={`block px-4 py-3 rounded-lg transition ${isActive('/data-siswa')}`}>
          👥 Data Siswa
        </Link>
        <Link to="/rekap" className={`block px-4 py-3 rounded-lg transition ${isActive('/rekap')}`}>
          📈 Rekap Absensi
        </Link>
      </nav>
    </aside>
  )
}
