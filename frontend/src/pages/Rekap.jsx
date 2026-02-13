import { useState, useEffect } from 'react'
import { absensiAPI } from '../services/api'
import Table from '../components/Table'

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
      <span className={r.status === 'Hadir' ? 'badge-success' : 'badge-warning'}>
        {r.status}
      </span>
    ),
  }))

  return (
    <div className="space-y-6 animate__animated animate__fadeIn">
      <div>
        <h1 className="page-title">Rekap Absensi</h1>
        <p className="page-subtitle">Filter data kehadiran berdasarkan rentang tanggal.</p>
      </div>

      <div className="card panel-smooth">
        <form onSubmit={handleFilter} className="flex gap-3 flex-wrap items-end">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Mulai</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Sampai</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input-field"
            />
          </div>
          <button type="submit" className="btn-primary">
            Filter
          </button>
        </form>
      </div>

      <div className="card panel-smooth">
        <Table headers={['Tanggal', 'NIS', 'Nama', 'Kelas', 'Waktu', 'Status']} rows={rows} loading={loading} />
      </div>
    </div>
  )
}
