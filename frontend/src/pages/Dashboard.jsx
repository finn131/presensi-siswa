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
    
    // Connect to Socket.IO
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
      <span className={`px-2 py-1 rounded text-xs font-medium ${
        r.status === 'Hadir' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
      }`}>
        {r.status}
      </span>
    ),
  }))

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card title="Total Siswa" value={stats.total_siswa} />
        <Card title="Hadir" value={stats.total_hadir} />
        <Card title="Terlambat" value={stats.total_terlambat} />
        <Card title="Tidak Hadir" value={stats.total_tidak_hadir} />
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Absensi Hari Ini</h2>
        <Table
          headers={['Waktu', 'NIS', 'Nama', 'Kelas', 'Status']}
          rows={recentRows}
          loading={loading}
        />
      </div>
    </div>
  )
}
