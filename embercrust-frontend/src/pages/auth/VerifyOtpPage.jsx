import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation }    from 'react-router-dom'
import { authAPI }                     from '../../services/api'
import { useAuth }                     from '../../context/AuthContext'

export default function VerifyOtpPage() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { login } = useAuth()

  const email     = location.state?.email || ''
  const [otp, setOtp]         = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState('')
  const [timer, setTimer]     = useState(60)
  const inputRefs             = useRef([])

  // Countdown timer
  useEffect(() => {
    if (timer <= 0) return
    const t = setTimeout(() => setTimer(timer - 1), 1000)
    return () => clearTimeout(t)
  }, [timer])

  // Redirect if no email
  useEffect(() => {
    if (!email) navigate('/register')
  }, [email])

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    setError('')
    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const otpString = otp.join('')
    if (otpString.length !== 6) {
      return setError('Please enter the complete 6-digit OTP')
    }

    try {
      setLoading(true)
      const res = await authAPI.verifyOTP({ email, otp: otpString })
      if (res.data.success) {
        login(res.data.user, res.data.token)
        setSuccess('Email verified! Redirecting...')
        setTimeout(() => navigate('/'), 1500)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    try {
      await authAPI.forgotPassword({ email })
      setTimer(60)
      setError('')
      setSuccess('New OTP sent to your email!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Failed to resend OTP')
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

        {/* Icon */}
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📧</div>

        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 900, fontSize: '1.75rem',
          color: '#2e1a0a', marginBottom: '0.5rem',
        }}>
          Verify Email
        </h1>
        <p style={{ color: '#7a4820', fontSize: '0.875rem', marginBottom: '2rem' }}>
          We sent a 6-digit OTP to<br />
          <strong style={{ color: '#e06020' }}>{email}</strong>
        </p>

        {/* Error / Success */}
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

        {/* OTP inputs */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: '2rem' }}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(index, e.target.value)}
                onKeyDown={e => handleKeyDown(index, e)}
                style={{
                  width: 48, height: 56,
                  textAlign: 'center',
                  fontSize: '1.5rem', fontWeight: 700,
                  borderRadius: 12,
                  border: `2px solid ${digit ? '#e06020' : 'rgba(196,168,130,0.4)'}`,
                  background: digit ? 'rgba(224,96,32,0.06)' : 'rgba(255,255,255,0.8)',
                  color: '#2e1a0a', outline: 'none',
                  transition: 'all 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = '#e06020'}
                onBlur={e => e.target.style.borderColor = digit ? '#e06020' : 'rgba(196,168,130,0.4)'}
              />
            ))}
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
            {loading ? 'Verifying...' : 'Verify OTP →'}
          </button>
        </form>

        {/* Resend */}
        <p style={{ fontSize: '0.875rem', color: '#7a4820' }}>
          Didn't receive OTP?{' '}
          {timer > 0 ? (
            <span style={{ color: '#c4a882' }}>Resend in {timer}s</span>
          ) : (
            <button
              onClick={handleResend}
              style={{ color: '#e06020', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem' }}
            >
              Resend OTP
            </button>
          )}
        </p>
      </div>
    </div>
  )
}