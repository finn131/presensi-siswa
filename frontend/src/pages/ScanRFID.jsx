import { useState, useRef, useEffect } from 'react'
import { absensiAPI } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

export default function ScanRFID() {
  const [uid, setUid] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleScan = async (e) => {
    e.preventDefault()
    if (!uid.trim()) return

    setLoading(true)
    setResult(null)

    try {
      const res = await absensiAPI.scan(uid)
      setResult({
        success: true,
        message: 'Absensi berhasil',
        data: res.data.data,
      })
    } catch (err) {
      setResult({
        success: false,
        message: err.response?.data?.message || 'Scan gagal',
        error: err.response?.status,
      })
    } finally {
      setLoading(false)
      setUid('')
      inputRef.current?.focus()
    }
  }

  return (
    <div className="space-y-6 max-w-3xl animate__animated animate__fadeIn">
      <div>
        <h1 className="page-title">Scan RFID</h1>
        <p className="page-subtitle">Tempelkan kartu RFID untuk mencatat kehadiran secara otomatis.</p>
      </div>

      <div className="card panel-smooth">
        <form onSubmit={handleScan} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">UID Kartu RFID</label>
            <input
              ref={inputRef}
              type="text"
              value={uid}
              onChange={(e) => setUid(e.target.value)}
              placeholder="Letakkan kartu RFID..."
              className="input-field text-lg"
              disabled={loading}
              autoFocus
            />
          </div>
          <button type="submit" disabled={loading || !uid.trim()} className="w-full btn-primary py-3 text-lg disabled:opacity-50">
            {loading ? 'Scanning...' : 'Scan'}
          </button>
        </form>
      </div>

      {loading && <LoadingSpinner />}

      {result && (
        <div
          className={`card panel-smooth animate__animated animate__fadeIn border-2 ${
            result.success ? 'border-emerald-400/70' : 'border-rose-400/70'
          }`}
        >
          <div className="mb-4">
            <p className={`text-xl font-bold ${result.success ? 'text-emerald-700' : 'text-rose-700'}`}>
              {result.message}
            </p>
          </div>

          {result.data && (
            <div className="grid sm:grid-cols-2 gap-3 rounded-xl bg-white/75 border border-slate-200 p-4 transition-all duration-300 hover:shadow-md">
              <div>
                <p className="text-xs text-slate-500">Nama Siswa</p>
                <p className="text-lg font-bold text-slate-900">{result.data.siswa.nama}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">NIS</p>
                <p className="text-lg font-bold text-slate-900">{result.data.siswa.nis}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Kelas</p>
                <p className="text-lg font-bold text-slate-900">{result.data.siswa.kelas}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Status</p>
                <p className={`text-lg font-bold ${result.data.status === 'Hadir' ? 'text-emerald-600' : 'text-orange-600'}`}>
                  {result.data.status}
                </p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs text-slate-500">Waktu Masuk</p>
                <p className="text-lg font-bold text-slate-900">
                  {new Date(result.data.waktu_masuk).toLocaleTimeString('id-ID')}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
