import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import Card from '../components/Card'
import Table from '../components/Table'
import LoadingSpinner from '../components/LoadingSpinner'
import { absensiAPI } from '../services/api'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
    loadRecent()

    const socket = io()
    socket.on('scan', (data) => {
      setRecent((prev) => [data, ...prev.slice(0, 7)])
      loadStats()
    })

    return () => socket.disconnect()
  }, [])

  const loadStats = async () => {
    try {
      const res = await absensiAPI.getStats()
      setStats(res.data.data)
    } catch (err) {
      console.error('Error loading stats:', err)
    }
  }

  const loadRecent = async () => {
    try {
      setLoading(true)
      const res = await absensiAPI.getToday()
      setRecent(res.data.data)
    } catch (err) {
      console.error('Error loading recent:', err)
    } finally {
      setLoading(false)
    }
  }


  if (loading || !stats) {
    return <LoadingSpinner />
  }

  const recentRows = recent.map((r) => ({
    waktu: new Date(r.waktu_masuk).toLocaleTimeString('id-ID'),
    nis: r.siswa.nis,
    nama: r.siswa.nama,
    kelas: r.siswa.kelas,
    status: (
      <span className={r.status === 'Hadir' ? 'badge-success' : 'badge-warning'}>
        {r.status}
      </span>
    ),
  }))

  return (
    <div className="space-y-6 animate__animated animate__fadeIn">
      <div>
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Ringkasan kehadiran siswa hari ini secara real-time.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card title="Total Siswa" value={stats.total_siswa} tone="cyan" />
        <Card title="Hadir" value={stats.total_hadir} tone="emerald" />
        <Card title="Terlambat" value={stats.total_terlambat} tone="amber" />
        <Card title="Tidak Hadir" value={stats.total_tidak_hadir} tone="rose" />
      </div>

      <div className="card panel-smooth">
        <div className="flex items-center justify-between mb-4 gap-3">
          <h2 className="text-xl font-bold text-slate-900">Absensi Hari Ini</h2>
          <button onClick={loadRecent} className="btn-secondary text-sm">
            Refresh
          </button>
        </div>
        <Table headers={['Waktu', 'NIS', 'Nama', 'Kelas', 'Status']} rows={recentRows} loading={loading} />
      </div>

    </div>
  )
}
