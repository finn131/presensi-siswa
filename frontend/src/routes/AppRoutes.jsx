import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'
import Login from '../pages/Login'
import Rekap from '../pages/Rekap'
import DataSiswa from '../pages/DataSiswa'
import ScanRFID from '../pages/ScanRFID'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/scan" element={<ScanRFID />} />
      <Route path="/data-siswa" element={<DataSiswa />} />
      <Route path="/rekap" element={<Rekap />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
