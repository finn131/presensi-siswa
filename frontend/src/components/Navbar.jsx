import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/70 backdrop-blur-xl">
      <div className="w-full px-4 md:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-4">
          <Link to="/dashboard" className="flex items-center gap-3">
            <span className="grid place-content-center h-9 w-9 rounded-xl bg-gradient-to-br from-teal-500 to-orange-500 text-white text-sm font-bold">
              AS
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900">Absensi Siswa</p>
              <p className="text-xs text-slate-500">Monitoring Kehadiran Real-Time</p>
            </div>
          </Link>

          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden sm:block rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-right">
              <p className="text-xs text-slate-500">Login sebagai</p>
              <p className="text-sm font-semibold text-slate-800">{user?.username}</p>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-br from-rose-500 to-orange-500 hover:brightness-110 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
