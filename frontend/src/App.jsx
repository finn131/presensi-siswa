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

  return (
    <div className="app-container">
      <div className="blob h-64 w-64 top-4 -left-16 bg-cyan-400/60" />
      <div className="blob h-72 w-72 -top-12 right-4 bg-orange-400/60" />
      <div className="blob h-80 w-80 -bottom-20 left-1/3 bg-sky-300/60" />

      {!user ? (
        <div className="min-h-screen relative z-10">
          <AppRoutes />
        </div>
      ) : (
        <div className="min-h-screen relative z-10">
          <Navbar />
          <div className="flex">
            <Sidebar />
            <main className="flex-1 p-4 md:p-6 lg:p-8">
              <div className="max-w-7xl mx-auto">
                <AppRoutes />
              </div>
            </main>
          </div>
        </div>
      )}
    </div>
  )
}
