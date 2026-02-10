import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import AppRoutes from './routes/AppRoutes'
import { useAuth } from './hooks/useAuth'

export default function App() {
  const { user, checkAuth } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-slate-100 to-slate-50">
        <AppRoutes />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-100 to-slate-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <AppRoutes />
          </div>
        </main>
      </div>
    </div>
  )
}
