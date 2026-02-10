import { useState, useEffect } from 'react'
import { absensiAPI } from '../services/api'
import Table from '../components/Table'
import LoadingSpinner from '../components/LoadingSpinner'

export default function Rekap() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await absensiAPI.getReport(startDate || undefined, endDate || undefined)
      setData(res.data.data)
    } catch (err) {
      console.error('Error loading report:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleFilter = (e) => {
    e.preventDefault()
    loadData()
  }

  const rows = data.map((r) => ({
    tanggal: r.tanggal,
    nis: r.siswa.nis,
    nama: r.siswa.nama,
    kelas: r.siswa.kelas,
    waktu: new Date(r.waktu_masuk).toLocaleTimeString('id-ID'),
    status: (
      <span className={`px-2 py-1 rounded text-xs font-medium ${
        r.status === 'Hadir' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
      }`}>
        {r.status}
      </span>
    ),
  }))

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Rekap Absensi</h1>

      <div className="card">
        <form onSubmit={handleFilter} className="flex gap-4 flex-wrap">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          />
          <button type="submit" className="btn-primary">
            Filter
          </button>
        </form>
      </div>

      <div className="card">
        <Table
          headers={['Tanggal', 'NIS', 'Nama', 'Kelas', 'Waktu', 'Status']}
          rows={rows}
          loading={loading}
        />
      </div>
    </div>
  )
}
