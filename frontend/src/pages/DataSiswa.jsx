import { useState, useEffect } from 'react'
import { siswaAPI } from '../services/api'
import Table from '../components/Table'

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
    <div className="space-y-6 animate__animated animate__fadeIn">
      <div>
        <h1 className="page-title">Data Siswa</h1>
        <p className="page-subtitle">Lihat data identitas siswa dan status kartu RFID yang terdaftar.</p>
      </div>

      <div className="card panel-smooth">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter('aktif')}
            className={filter === 'aktif' ? 'btn-primary' : 'btn-secondary'}
          >
            Siswa Aktif
          </button>
          <button
            onClick={() => setFilter('tidak_aktif')}
            className={filter === 'tidak_aktif' ? 'btn-primary' : 'btn-secondary'}
          >
            Siswa Tidak Aktif
          </button>
        </div>
      </div>

      <div className="card panel-smooth">
        <Table headers={['NIS', 'Nama', 'Kelas', 'Jenis Kelamin', 'RFID']} rows={rows} loading={loading} />
      </div>
    </div>
  )
}
