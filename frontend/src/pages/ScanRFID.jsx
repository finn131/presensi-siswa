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
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-800">Scan RFID</h1>

      <div className="card">
        <form onSubmit={handleScan} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              UID Kartu RFID
            </label>
            <input
              ref={inputRef}
              type="text"
              value={uid}
              onChange={(e) => setUid(e.target.value)}
              placeholder="Letakkan kartu RFID..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 text-lg"
              disabled={loading}
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={loading || !uid.trim()}
            className="w-full btn-primary py-3 font-medium disabled:opacity-50 text-lg"
          >
            {loading ? 'Scanning...' : 'Scan'}
          </button>
        </form>
      </div>

      {loading && <LoadingSpinner />}

      {result && (
        <div
          className={`card animate__animated animate__fadeIn ${
            result.success ? 'border-2 border-green-500' : 'border-2 border-red-500'
          }`}
        >
          <div className="mb-4">
            <p className={`text-lg font-semibold ${
              result.success ? 'text-green-700' : 'text-red-700'
            }`}>
              {result.message}
            </p>
          </div>

          {result.data && (
            <div className="space-y-3 bg-white/50 p-4 rounded-lg">
              <div>
                <p className="text-xs text-gray-600">Nama Siswa</p>
                <p className="text-lg font-semibold">{result.data.siswa.nama}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">NIS</p>
                <p className="text-lg font-semibold">{result.data.siswa.nis}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Kelas</p>
                <p className="text-lg font-semibold">{result.data.siswa.kelas}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Status</p>
                <p className={`text-lg font-semibold ${
                  result.data.status === 'Hadir' ? 'text-green-600' : 'text-amber-600'
                }`}>
                  {result.data.status}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Waktu Masuk</p>
                <p className="text-lg font-semibold">
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
