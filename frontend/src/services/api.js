import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || ''

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Auth endpoints
export const authAPI = {
  login: (username, password) => api.post('/auth/login', { username, password }),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
}

// Absensi endpoints
export const absensiAPI = {
  scan: (uid) => api.post('/absensi/scan', { uid }),
  getToday: () => api.get('/absensi/today'),
  getStats: (tanggal) => api.get('/absensi/stats', { params: { tanggal } }),
  getReport: (start_date, end_date, siswa_id) => 
    api.get('/absensi/report', { params: { start_date, end_date, siswa_id } }),
}

// Siswa endpoints
export const siswaAPI = {
  getAll: (status, kelas) => api.get('/siswa/', { params: { status, kelas } }),
  getById: (id) => api.get(`/siswa/${id}`),
  create: (data) => api.post('/siswa/', data),
  update: (id, data) => api.put(`/siswa/${id}`, data),
  registerRFID: (id, uid) => api.post(`/siswa/${id}/rfid`, { uid }),
}

// Laporan endpoints
export const laporanAPI = {
  getRekap: (start_date, end_date, kelas) => 
    api.get('/laporan/rekap', { params: { start_date, end_date, kelas } }),
  exportCSV: (start_date, end_date) => 
    api.get('/laporan/export/csv', { params: { start_date, end_date }, responseType: 'blob' }),
}

export default api
