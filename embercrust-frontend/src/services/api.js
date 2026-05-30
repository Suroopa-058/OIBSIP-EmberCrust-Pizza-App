import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Auto attach token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Auto handle 401 - token expired
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ── AUTH ──────────────────────────────────────────
export const authAPI = {
  register:       (data) => api.post('/auth/register', data),
  verifyOTP:      (data) => api.post('/auth/verify-otp', data),
  login:          (data) => api.post('/auth/login', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword:  (data) => api.post('/auth/reset-password', data),
  getMe:          ()     => api.get('/auth/me'),
}

// ── PIZZAS ────────────────────────────────────────
export const pizzaAPI = {
  getAll:     (params) => api.get('/pizzas', { params }),
  getFeatured:()       => api.get('/pizzas/featured'),
  getById:    (id)     => api.get(`/pizzas/${id}`),
  create:     (data)   => api.post('/pizzas', data),
  update:     (id, data) => api.put(`/pizzas/${id}`, data),
  delete:     (id)     => api.delete(`/pizzas/${id}`),
}

// ── CART ──────────────────────────────────────────
export const cartAPI = {
  getCart:    ()       => api.get('/cart'),
  addToCart:  (data)   => api.post('/cart/add', data),
  updateItem: (data)   => api.put('/cart/update', data),
  removeItem: (itemId) => api.delete(`/cart/remove/${itemId}`),
  clearCart:  ()       => api.delete('/cart/clear'),
}

// ── ORDERS ────────────────────────────────────────
export const orderAPI = {
  createOrder:      (data)         => api.post('/orders/create', data),
  getMyOrders:      ()             => api.get('/orders/my-orders'),
  getOrderById:     (id)           => api.get(`/orders/${id}`),
  getAllOrders:      (params)       => api.get('/orders/all/list', { params }),
  updateOrderStatus:(id, status)   => api.put(`/orders/${id}/status`, { status }),
  getAdminStats:    ()             => api.get('/orders/admin/stats'),
}

// ── PAYMENT ───────────────────────────────────────
export const paymentAPI = {
  createOrder: (amount) => api.post('/payment/create-order', { amount }),
  verify:      (data)   => api.post('/payment/verify', data),
}

// ── COUPON ────────────────────────────────────────
export const couponAPI = {
  validate: (code, totalAmount) => api.post('/coupon/validate', { code, totalAmount }),
}

export default api