import { useState }            from 'react'
import { useNavigate, Link }   from 'react-router-dom'
import { authAPI }             from '../../services/api'
import { useAuth }             from '../../context/AuthContext'

export default function LoginPage() {
  const navigate    = useNavigate()
  const { login }   = useAuth()

  const [form, setForm]       = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      return setError('Email and password are required')
    }

    try {
      setLoading(true)
      const res = await authAPI.login(form)
      if (res.data.success) {
        login(res.data.user, res.data.token)
        // Redirect based on role
        if (res.data.user.role === 'admin') {
          navigate('/admin/dashboard')
        } else {
          navigate('/dashboard') 
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#f7f0e8',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem', paddingTop: '5rem',
    }}>
      <div style={{
        width: '100%', maxWidth: 440,
        background: '#fdf8f2',
        border: '1px solid rgba(196,168,130,0.3)',
        borderRadius: 24, padding: '2.5rem',
        boxShadow: '0 8px 40px rgba(46,26,10,0.1)',
      }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 52, height: 52, borderRadius: 16,
            background: 'linear-gradient(135deg,#b84a14,#e06020)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26, margin: '0 auto 1rem',
            boxShadow: '0 4px 16px rgba(224,96,32,0.35)',
          }}>🔥</div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 900, fontSize: '1.75rem',
            color: '#2e1a0a', marginBottom: '0.35rem',
          }}>
            Welcome Back
          </h1>
          <p style={{ color: '#7a4820', fontSize: '0.875rem' }}>
            Login to your EmberCrust account
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: 'rgba(220,38,38,0.08)',
            border: '1px solid rgba(220,38,38,0.25)',
            borderRadius: 10, padding: '0.75rem 1rem',
            color: '#dc2626', fontSize: '0.85rem',
            marginBottom: '1.25rem', textAlign: 'center',
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>

          {/* Email */}
          <div style={{ marginBottom: '1.1rem' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#5a3418', marginBottom: 6 }}>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={handleChange}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#e06020'}
              onBlur={e => e.target.style.borderColor = 'rgba(196,168,130,0.4)'}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#5a3418', marginBottom: 6 }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#e06020'}
              onBlur={e => e.target.style.borderColor = 'rgba(196,168,130,0.4)'}
            />
          </div>

          {/* Forgot password */}
          <div style={{ textAlign: 'right', marginBottom: '1.5rem' }}>
            <Link to="/forgot-password" style={{ fontSize: '0.82rem', color: '#e06020', fontWeight: 600, textDecoration: 'none' }}>
              Forgot Password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '0.9rem',
              borderRadius: 12, border: 'none',
              background: loading ? '#c4a882' : 'linear-gradient(135deg,#b84a14,#e06020)',
              color: '#fff', fontWeight: 700, fontSize: '1rem',
              fontFamily: "'DM Sans', sans-serif",
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 16px rgba(224,96,32,0.3)',
              transition: 'all 0.3s',
            }}
          >
            {loading ? 'Logging in...' : 'Login →'}
          </button>
        </form>

        {/* Register link */}
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#7a4820' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#e06020', fontWeight: 700, textDecoration: 'none' }}>
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '0.75rem 1rem',
  borderRadius: 10,
  border: '1.5px solid rgba(196,168,130,0.4)',
  background: 'rgba(255,255,255,0.8)',
  fontSize: '0.9rem',
  color: '#2e1a0a',
  fontFamily: "'DM Sans', sans-serif",
  outline: 'none',
  transition: 'border-color 0.25s',
  boxShadow: '0 2px 8px rgba(46,26,10,0.05)',
}