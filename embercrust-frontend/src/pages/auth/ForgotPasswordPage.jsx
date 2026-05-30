import { useState }          from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authAPI }           from '../../services/api'

export default function ForgotPasswordPage() {
  const navigate = useNavigate()

  const [email,   setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return setError('Email is required')

    try {
      setLoading(true)
      const res = await authAPI.forgotPassword({ email })
      if (res.data.success) {
        setSuccess('OTP sent to your email!')
        setTimeout(() => {
          navigate('/reset-password', { state: { email } })
        }, 1500)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP')
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
        textAlign: 'center',
      }}>

        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</div>

        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 900, fontSize: '1.75rem',
          color: '#2e1a0a', marginBottom: '0.5rem',
        }}>
          Forgot Password
        </h1>
        <p style={{ color: '#7a4820', fontSize: '0.875rem', marginBottom: '2rem' }}>
          Enter your email and we'll send you a reset OTP
        </p>

        {error && (
          <div style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.25)', borderRadius: 10, padding: '0.75rem', color: '#dc2626', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.25)', borderRadius: 10, padding: '0.75rem', color: '#16a34a', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#5a3418', marginBottom: 6 }}>
              Email Address
            </label>
            <input
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={e => { setEmail(e.target.value); setError('') }}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#e06020'}
              onBlur={e => e.target.style.borderColor = 'rgba(196,168,130,0.4)'}
            />
          </div>

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
              marginBottom: '1.25rem',
            }}
          >
            {loading ? 'Sending OTP...' : 'Send Reset OTP →'}
          </button>
        </form>

        <Link to="/login" style={{ fontSize: '0.875rem', color: '#e06020', fontWeight: 600, textDecoration: 'none' }}>
          ← Back to Login
        </Link>
      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%', padding: '0.75rem 1rem',
  borderRadius: 10, border: '1.5px solid rgba(196,168,130,0.4)',
  background: 'rgba(255,255,255,0.8)', fontSize: '0.9rem',
  color: '#2e1a0a', fontFamily: "'DM Sans', sans-serif",
  outline: 'none', transition: 'border-color 0.25s',
  boxShadow: '0 2px 8px rgba(46,26,10,0.05)',
}