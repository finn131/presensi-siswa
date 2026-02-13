import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const menus = [
  { to: '/dashboard', label: 'Dashboard', icon: 'Stats' },
  { to: '/scan', label: 'Scan RFID', icon: 'Scan' },
  { to: '/data-siswa', label: 'Data Siswa', icon: 'Data' },
  { to: '/rekap', label: 'Rekap Absensi', icon: 'Report' },
]

export default function Sidebar() {
  const location = useLocation()
  const { user } = useAuth()

  const linkClass = (path) => {
    const active = location.pathname === path
    return [
      'menu-link',
      active
        ? 'menu-link-active'
        : 'text-slate-700 hover:bg-white/85 hover:shadow-md hover:shadow-slate-200/70',
    ].join(' ')
  }

  return (
    <aside className="hidden md:block w-72 p-5 lg:p-6">
      <div className="glass panel-smooth p-5 mb-4">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Sistem</p>
        <h2 className="text-xl font-bold text-slate-900 mt-2">Panel Presensi</h2>
        <p className="text-xs text-slate-600 mt-1">Role: {user?.role}</p>
      </div>

      <nav className="glass panel-smooth p-3 space-y-1">
        {menus.map((menu) => (
          <Link key={menu.to} to={menu.to} className={linkClass(menu.to)}>
            <span className="inline-block min-w-[52px] text-xs uppercase tracking-wide opacity-80">
              {menu.icon}
            </span>
            <span>{menu.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}
