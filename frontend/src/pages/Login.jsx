import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { authAPI } from '../services/api'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [captchaImage, setCaptchaImage] = useState('')
  const [captchaAnswer, setCaptchaAnswer] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [captchaLoading, setCaptchaLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const loadCaptcha = async () => {
    setCaptchaLoading(true)
    try {
      const response = await authAPI.getCaptcha()
      if (response.data?.success) {
        setCaptchaImage(response.data.data.image)
      }
      setCaptchaAnswer('')
    } catch (_) {
      setCaptchaImage('')
    } finally {
      setCaptchaLoading(false)
    }
  }

  useEffect(() => {
    loadCaptcha()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(username, password, captchaAnswer)

    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.message)
      await loadCaptcha()
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <section className="card animate__animated animate__fadeInUp">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-slate-900">Masuk</h2>
            <p className="text-slate-600 text-sm mt-1">Akses dashboard presensi siswa</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-100 text-rose-800 rounded-xl text-sm border border-rose-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field"
                placeholder="admin"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="Masukkan password"
                disabled={loading}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-semibold text-slate-700">CAPTCHA</label>
                <button
                  type="button"
                  onClick={loadCaptcha}
                  disabled={loading || captchaLoading}
                  className="text-xs font-semibold text-teal-700 hover:text-teal-900 disabled:opacity-50"
                >
                  {captchaLoading ? 'Memuat...' : 'Refresh'}
                </button>
              </div>

              <div className="bg-white/80 border border-slate-200 rounded-xl px-3 py-2 mb-2 min-h-[78px] flex items-center">
                {captchaImage ? (
                  <img src={captchaImage} alt="Captcha" className="w-full max-w-[220px] h-auto" />
                ) : (
                  <p className="text-sm text-slate-600">Captcha gagal dimuat</p>
                )}
              </div>

              <input
                type="text"
                value={captchaAnswer}
                onChange={(e) => setCaptchaAnswer(e.target.value)}
                className="input-field"
                placeholder="Masukkan teks captcha"
                disabled={loading || captchaLoading}
              />
            </div>

            <button
              type="submit"
              disabled={loading || captchaLoading || !captchaImage}
              className="w-full btn-primary py-3 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Login'}
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}
