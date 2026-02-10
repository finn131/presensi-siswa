import { useState, useEffect } from 'react'
import { siswaAPI } from '../services/api'
import Table from '../components/Table'
import LoadingSpinner from '../components/LoadingSpinner'

export default function DataSiswa() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('aktif')

  useEffect(() => {
    loadStudents()
  }, [filter])

  const loadStudents = async () => {
    setLoading(true)
    try {
      const res = await siswaAPI.getAll(filter)
      setStudents(res.data.data)
    } catch (err) {
      console.error('Error loading students:', err)
    } finally {
      setLoading(false)
    }
  }

  const rows = students.map((s) => ({
    nis: s.nis,
    nama: s.nama,
    kelas: s.kelas || '-',
    jekel: s.jenis_kelamin || '-',
    rfid: s.rfid_cards?.[0]?.uid || 'tidak terdaftar',
  }))

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Data Siswa</h1>

      <div className="card">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('aktif')}
            className={`px-4 py-2 rounded-lg transition ${
              filter === 'aktif'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Aktif
          </button>
          <button
            onClick={() => setFilter('tidak_aktif')}
            className={`px-4 py-2 rounded-lg transition ${
              filter === 'tidak_aktif'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Tidak Aktif
          </button>
        </div>
      </div>

      <div className="card">
        <Table
          headers={['NIS', 'Nama', 'Kelas', 'Jenis Kelamin', 'RFID']}
          rows={rows}
          loading={loading}
        />
      </div>
    </div>
  )
}
