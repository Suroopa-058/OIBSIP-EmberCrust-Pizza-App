import { useState }      from 'react'
import { useNavigate }   from 'react-router-dom'
import { useAuth }       from '../../context/AuthContext'
import { authAPI }       from '../../services/api'

export default function ProfilePage() {
  const navigate        = useNavigate()
  const { user, logout, updateUser } = useAuth()

  const [form, setForm] = useState({
    name:            user?.name || '',
    currentPassword: '',
    newPassword:     '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error,   setError]   = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
    setSuccess('')
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f7f0e8', paddingTop: '5rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '2rem 2.5rem' }}>

        <button
          onClick={() => navigate('/dashboard')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7a4820', fontSize: '0.875rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 6, fontFamily: "'DM Sans',sans-serif" }}
        >
          ← Back to Dashboard
        </button>

        <h1 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: '2rem', color: '#2e1a0a', marginBottom: '2rem' }}>
          My Profile 👤
        </h1>

        {/* Profile card */}
        <div style={{ background: '#fdf8f2', border: '1px solid rgba(196,168,130,0.3)', borderRadius: 20, padding: '2rem', marginBottom: '1.5rem' }}>

          {/* Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.75rem', paddingBottom: '1.75rem', borderBottom: '1px solid rgba(196,168,130,0.25)' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg,#b84a14,#e06020)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 800, fontSize: '1.25rem', color: '#2e1a0a', marginBottom: 4 }}>
                {user?.name}
              </h2>
              <p style={{ color: '#7a4820', fontSize: '0.875rem' }}>{user?.email}</p>
              <span style={{ display: 'inline-block', marginTop: 6, fontSize: '0.72rem', fontWeight: 700, color: '#b84a14', background: 'rgba(224,96,32,0.1)', border: '1px solid rgba(224,96,32,0.2)', borderRadius: 9999, padding: '0.15rem 0.65rem' }}>
                {user?.role?.toUpperCase()}
              </span>
            </div>
          </div>

          {success && <div style={{ background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.25)', borderRadius: 10, padding: '0.75rem', color: '#16a34a', fontSize: '0.85rem', marginBottom: '1rem', fontWeight: 600 }}>✅ {success}</div>}
          {error   && <div style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.25)', borderRadius: 10, padding: '0.75rem', color: '#dc2626', fontSize: '0.85rem', marginBottom: '1rem' }}>❌ {error}</div>}

          {/* Info fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#5a3418', marginBottom: 5 }}>Full Name</label>
              <input
                name="name" value={form.name}
                onChange={handleChange}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor='#e06020'}
                onBlur={e => e.target.style.borderColor='rgba(196,168,130,0.4)'}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#5a3418', marginBottom: 5 }}>Email Address</label>
              <input
                value={user?.email} disabled
                style={{ ...inputStyle, background: 'rgba(196,168,130,0.1)', color: '#c4a882', cursor: 'not-allowed' }}
              />
              <p style={{ fontSize: '0.72rem', color: '#c4a882', marginTop: 4 }}>Email cannot be changed</p>
            </div>
          </div>
        </div>

        {/* Danger zone */}
        <div style={{ background: '#fdf8f2', border: '1px solid rgba(220,38,38,0.2)', borderRadius: 20, padding: '1.5rem' }}>
          <h3 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: '1rem', color: '#dc2626', marginBottom: '1rem' }}>
            ⚠️ Account Actions
          </h3>
          <button
            onClick={handleLogout}
            style={{ width: '100%', padding: '0.85rem', borderRadius: 12, background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.25)', color: '#dc2626', fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: '0.9rem' }}
          >
            Logout from all devices
          </button>
        </div>
      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%', padding: '0.75rem 1rem',
  borderRadius: 10, border: '1.5px solid rgba(196,168,130,0.4)',
  background: 'rgba(255,255,255,0.8)', fontSize: '0.9rem',
  color: '#2e1a0a', fontFamily: "'DM Sans',sans-serif",
  outline: 'none', transition: 'border-color 0.25s',
}