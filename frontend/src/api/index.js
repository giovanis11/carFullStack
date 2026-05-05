import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || ''

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auto-refresh token on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      const refresh = localStorage.getItem('refresh_token')
      if (refresh) {
        try {
          const res = await axios.post(`${BASE_URL}/api/auth/token/refresh/`, { refresh })
          localStorage.setItem('access_token', res.data.access)
          original.headers.Authorization = `Bearer ${res.data.access}`
          return api(original)
        } catch {
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          window.location.href = '/admin/login'
        }
      }
    }
    return Promise.reject(error)
  }
)

export const carsApi = {
  list: (params) => api.get('/cars/', { params }),
  detail: (id) => api.get(`/cars/${id}/`),
  featured: () => api.get('/cars/featured/'),
  brands: () => api.get('/cars/brands/'),
}

export const requestsApi = {
  createRental: (data) => api.post('/rental-requests/', data),
  createSale: (data) => api.post('/sale-inquiries/', data),
  createTransfer: (data) => api.post('/transfer-requests/', data),
}

export const adminApi = {
  login: (credentials) => api.post('/auth/token/', credentials),
  getRequests: () => api.get('/admin/requests/'),
  updateStatus: (type, id, status) =>
    api.patch(`/admin/requests/${type}/${id}/`, { status }),
}

export default api
