import { useState, useRef }        from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { authAPI }                  from '../../services/api'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const email    = location.state?.email || ''

  const [otp,         setOtp]         = useState(['', '', '', '', '', ''])
  const [newPassword, setNewPassword] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState('')
  const [success,     setSuccess]     = useState('')
  const inputRefs = useRef([])

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    setError('')
    if (value && index < 5) inputRefs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const otpString = otp.join('')

    if (otpString.length !== 6)  return setError('Enter complete 6-digit OTP')
    if (!newPassword)             return setError('New password is required')
    if (newPassword.length < 6)  return setError('Password must be at least 6 characters')
    if (newPassword !== confirmPass) return setError('Passwords do not match')

    try {
      setLoading(true)
      const res = await authAPI.resetPassword({ email, otp: otpString, newPassword })
      if (res.data.success) {
        setSuccess('Password reset successful!')
        setTimeout(() => navigate('/login'), 1800)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed')
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
        width: '100%', maxWidth: 460,
        background: '#fdf8f2',
        border: '1px solid rgba(196,168,130,0.3)',
        borderRadius: 24, padding: '2.5rem',
        boxShadow: '0 8px 40px rgba(46,26,10,0.1)',
      }}>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔑</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: '1.75rem', color: '#2e1a0a', marginBottom: '0.5rem' }}>
            Reset Password
          </h1>
          <p style={{ color: '#7a4820', fontSize: '0.875rem' }}>
            Enter the OTP sent to <strong style={{ color: '#e06020' }}>{email}</strong>
          </p>
        </div>

        {error && (
          <div style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.25)', borderRadius: 10, padding: '0.75rem', color: '#dc2626', fontSize: '0.85rem', marginBottom: '1.25rem', textAlign: 'center' }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.25)', borderRadius: 10, padding: '0.75rem', color: '#16a34a', fontSize: '0.85rem', marginBottom: '1.25rem', textAlign: 'center' }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* OTP */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#5a3418', marginBottom: 8, textAlign: 'center' }}>
              Enter OTP
            </label>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={el => inputRefs.current[index] = el}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(index, e.target.value)}
                  onKeyDown={e => handleKeyDown(index, e)}
                  style={{
                    width: 46, height: 52, textAlign: 'center',
                    fontSize: '1.4rem', fontWeight: 700, borderRadius: 10,
                    border: `2px solid ${digit ? '#e06020' : 'rgba(196,168,130,0.4)'}`,
                    background: digit ? 'rgba(224,96,32,0.06)' : 'rgba(255,255,255,0.8)',
                    color: '#2e1a0a', outline: 'none', transition: 'all 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = '#e06020'}
                  onBlur={e => e.target.style.borderColor = digit ? '#e06020' : 'rgba(196,168,130,0.4)'}
                />
              ))}
            </div>
          </div>

          {/* New Password */}
          <div style={{ marginBottom: '1.1rem' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#5a3418', marginBottom: 6 }}>
              New Password
            </label>
            <input
              type="password"
              placeholder="Min 6 characters"
              value={newPassword}
              onChange={e => { setNewPassword(e.target.value); setError('') }}
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
              placeholder="Re-enter new password"
              value={confirmPass}
              onChange={e => { setConfirmPass(e.target.value); setError('') }}
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
            {loading ? 'Resetting...' : 'Reset Password →'}
          </button>
        </form>

        <div style={{ textAlign: 'center' }}>
          <Link to="/login" style={{ fontSize: '0.875rem', color: '#e06020', fontWeight: 600, textDecoration: 'none' }}>
            ← Back to Login
          </Link>
        </div>
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