import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authAPI } from '../../services/api'

export default function RegisterPage() {
  const navigate = useNavigate()

  const [form, setForm]       = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      return setError('All fields are required')
    }
    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match')
    }
    if (form.password.length < 6) {
      return setError('Password must be at least 6 characters')
    }

    try {
      setLoading(true)
      const res = await authAPI.register({
        name:     form.name,
        email:    form.email,
        password: form.password,
      })

      if (res.data.success) {
        // Go to OTP page with email
        navigate('/verify-otp', { state: { email: form.email } })
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
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
        width: '100%', maxWidth: 480,
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
            Create Account
          </h1>
          <p style={{ color: '#7a4820', fontSize: '0.875rem' }}>
            Join EmberCrust and start ordering 🍕
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

          {/* Name */}
          <div style={{ marginBottom: '1.1rem' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#5a3418', marginBottom: 6 }}>
              Full Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#e06020'}
              onBlur={e => e.target.style.borderColor = 'rgba(196,168,130,0.4)'}
            />
          </div>

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
          <div style={{ marginBottom: '1.1rem' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#5a3418', marginBottom: 6 }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Min 6 characters"
              value={form.password}
              onChange={handleChange}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#e06020'}
              onBlur={e => e.target.style.borderColor = 'rgba(196,168,130,0.4)'}
            />
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#5a3418', marginBottom: 6 }}>
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Re-enter password"
              value={form.confirmPassword}
              onChange={handleChange}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#e06020'}
              onBlur={e => e.target.style.borderColor = 'rgba(196,168,130,0.4)'}
            />
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
            {loading ? 'Creating Account...' : 'Create Account →'}
          </button>
        </form>

        {/* Login link */}
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#7a4820' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#e06020', fontWeight: 700, textDecoration: 'none' }}>
            Login
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