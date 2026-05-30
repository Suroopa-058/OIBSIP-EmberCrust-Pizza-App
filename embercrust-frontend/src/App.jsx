import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth }   from './context/AuthContext'
import { CartProvider }            from './context/CartContext'
import ToastContainer              from './components/ui/ToastContainer'
import { useCartContext }          from './context/CartContext'
import Navbar                      from './components/layout/Navbar'
import Footer                      from './components/layout/Footer'

// Pages
import LandingPage        from './pages/LandingPage'
import MenuPage           from './pages/MenuPage'
import PizzaDetailPage    from './pages/PizzaDetailPage'
import CartPage           from './pages/CartPage'
import CheckoutPage       from './pages/CheckoutPage'
import OrderSuccessPage   from './pages/OrderSuccessPage'
import MyOrdersPage       from './pages/MyOrdersPage'
import OrderTrackPage     from './pages/OrderTrackPage'

// Auth pages
import LoginPage          from './pages/auth/LoginPage'
import RegisterPage       from './pages/auth/RegisterPage'
import VerifyOtpPage      from './pages/auth/VerifyOtpPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import ResetPasswordPage  from './pages/auth/ResetPasswordPage'

// User pages
import UserDashboard      from './pages/user/UserDashboard'

// Admin pages
import AdminDashboard     from './pages/admin/AdminDashboard'
import ManagePizzasPage   from './pages/admin/ManagePizzasPage'
import ManageOrdersPage   from './pages/admin/ManageOrdersPage'

import ProfilePage from './pages/user/ProfilePage'

// ── Protected Route ───────────────────────────────
function ProtectedRoute({ children }) {
  const { isLoggedIn, loading } = useAuth()
  if (loading) return <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', background:'#f7f0e8', fontSize:'2rem' }}>🔥</div>
  return isLoggedIn ? children : <Navigate to="/login" replace />
}

// ── Admin Route ───────────────────────────────────
function AdminRoute({ children }) {
  const { isLoggedIn, isAdmin, loading } = useAuth()
  if (loading) return <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', background:'#f7f0e8', fontSize:'2rem' }}>🔥</div>
  if (!isLoggedIn) return <Navigate to="/login" replace />
  if (!isAdmin)    return <Navigate to="/"      replace />
  return children
}

// ── Public Route (redirect if logged in) ─────────
function PublicRoute({ children }) {
  const { isLoggedIn, isAdmin, loading } = useAuth()
  if (loading) return <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', background:'#f7f0e8', fontSize:'2rem' }}>🔥</div>
  if (isLoggedIn) return <Navigate to={isAdmin ? '/admin/dashboard' : '/'} replace />
  return children
}

// ── App Content ───────────────────────────────────
function AppContent() {
  const { toasts, removeToast } = useCartContext()

  return (
    <>
      <Navbar />
      <main>
        <Routes>
          {/* Public */}
          <Route path="/"     element={<LandingPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/pizza/:id" element={<PizzaDetailPage />} />

          {/* Auth — only when not logged in */}
          <Route path="/login"           element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register"        element={<PublicRoute><RegisterPage /></PublicRoute>} />
          <Route path="/verify-otp"      element={<VerifyOtpPage />} />
          <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
          <Route path="/reset-password"  element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />

          {/* User — must be logged in */}
          <Route path="/cart"          element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
          <Route path="/checkout"      element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          <Route path="/order-success" element={<ProtectedRoute><OrderSuccessPage /></ProtectedRoute>} />
          <Route path="/my-orders"     element={<ProtectedRoute><MyOrdersPage /></ProtectedRoute>} />
          <Route path="/order/:id"     element={<ProtectedRoute><OrderTrackPage /></ProtectedRoute>} />
          <Route path="/dashboard"     element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          {/* Admin — must be admin */}
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/pizzas"    element={<AdminRoute><ManagePizzasPage /></AdminRoute>} />
          <Route path="/admin/orders"    element={<AdminRoute><ManageOrdersPage /></AdminRoute>} />
          
          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  )
}

// ── Root ──────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}