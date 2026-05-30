import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useCartContext } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'

const NAV_LINKS = [
  { label: 'Home',    type: 'scroll', id: 'home',    path: '/' },
  { label: 'Menu',    type: 'route',  id: 'menu',    path: '/menu' },
  { label: 'About',   type: 'scroll', id: 'about',   path: '/' },
  { label: 'Deals',   type: 'scroll', id: 'deals',   path: '/' },
  { label: 'Contact', type: 'scroll', id: 'contact', path: '/' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { cartCount }           = useCartContext()
  const { isLoggedIn, isAdmin } = useAuth()
  const navigate                = useNavigate()
  const location                = useLocation()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const handleNav = (link) => {
    setMenuOpen(false)
    if (link.type === 'route') {
      navigate(link.path)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      if (location.pathname !== '/') {
        navigate('/')
        setTimeout(() => {
          document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth' })
        }, 300)
      } else {
        document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const isActive = (link) =>
    link.type === 'route' && location.pathname === link.path

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      background: scrolled ? 'rgba(247,240,232,0.95)' : 'rgba(247,240,232,0.7)',
      borderBottom: scrolled ? '1px solid rgba(196,168,130,0.35)' : '1px solid transparent',
      transition: 'all 0.4s',
    }}>

      {/* ── Main Nav Bar ── */}
      <nav style={{
        maxWidth: 1340, margin: '0 auto',
        padding: '0 2rem', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>

        {/* Logo */}
        <button
          onClick={() => handleNav({ type: 'route', path: '/' })}
          style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <div style={{
            width: 38, height: 38, borderRadius: 12,
            background: 'linear-gradient(135deg,#b84a14,#e06020)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, boxShadow: '0 4px 16px rgba(224,96,32,0.35)',
          }}>🔥</div>
          <span style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 700, fontSize: '1.2rem', color: '#2e1a0a',
          }}>
            Ember<span style={{ color: '#e06020' }}>Crust</span>
          </span>
        </button>

        {/* Desktop Links */}
        <div className="ec-nav-links" style={{ display: 'flex', gap: '2.25rem', alignItems: 'center' }}>
          {NAV_LINKS.map(link => (
            <button
              key={link.label}
              onClick={() => handleNav(link)}
              style={{
                position: 'relative', background: 'none', border: 'none',
                cursor: 'pointer', fontSize: '0.88rem',
                fontWeight: isActive(link) ? 700 : 500,
                color: isActive(link) ? '#e06020' : '#7a4820',
                fontFamily: "'DM Sans', sans-serif",
                padding: '4px 0', transition: 'color 0.2s',
              }}
              onMouseOver={e => { if (!isActive(link)) e.currentTarget.style.color = '#2e1a0a' }}
              onMouseOut={e => { if (!isActive(link)) e.currentTarget.style.color = '#7a4820' }}
            >
              {link.label}
              {isActive(link) && (
                <span style={{
                  position: 'absolute', left: 0, bottom: -2,
                  width: '100%', height: 1.5,
                  background: '#e06020', borderRadius: 2,
                }} />
              )}
            </button>
          ))}
        </div>

        {/* Right Side */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>

          {/* Cart */}
          <button
            onClick={() => handleNav({ type: 'route', path: '/cart' })}
            style={{
              position: 'relative', width: 42, height: 42,
              borderRadius: 12, border: '1px solid rgba(196,168,130,0.4)',
              background: 'transparent', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 19, transition: 'all 0.28s',
            }}
            onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(224,96,32,0.5)'; e.currentTarget.style.background = 'rgba(224,96,32,0.07)' }}
            onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(196,168,130,0.4)'; e.currentTarget.style.background = 'transparent' }}
          >
            🛒
            {cartCount > 0 && (
              <span style={{
                position: 'absolute', top: -6, right: -6,
                background: 'linear-gradient(135deg,#b84a14,#e06020)',
                color: '#fff', fontSize: 11, fontWeight: 700,
                width: 19, height: 19, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {cartCount}
              </span>
            )}
          </button>

          {/* Auth Buttons */}
          {isLoggedIn ? (
            <>
              <button
                onClick={() => navigate(isAdmin ? '/admin/dashboard' : '/dashboard')}
                style={{
                  padding: '0.65rem 1.1rem', borderRadius: 12,
                  border: '1px solid rgba(196,168,130,0.4)',
                  background: 'transparent', cursor: 'pointer',
                  fontWeight: 600, fontSize: '0.82rem',
                  color: '#7a4820', fontFamily: "'DM Sans',sans-serif",
                  transition: 'all 0.25s',
                }}
                onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(224,96,32,0.4)'; e.currentTarget.style.color = '#e06020' }}
                onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(196,168,130,0.4)'; e.currentTarget.style.color = '#7a4820' }}
              >
                {isAdmin ? '⚙️ Admin' : '👤 Dashboard'}
              </button>

              <button
                onClick={() => handleNav({ type: 'route', path: '/menu' })}
                style={{
                  padding: '0.65rem 1.35rem', borderRadius: 12,
                  background: 'linear-gradient(135deg,#b84a14,#e06020)',
                  color: '#fff', border: 'none', cursor: 'pointer',
                  fontWeight: 700, fontSize: '0.875rem',
                  fontFamily: "'DM Sans',sans-serif",
                  boxShadow: '0 4px 16px rgba(224,96,32,0.3)',
                  transition: 'all 0.28s',
                }}
                onMouseOver={e => { e.currentTarget.style.boxShadow = '0 8px 28px rgba(224,96,32,0.5)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                onMouseOut={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(224,96,32,0.3)'; e.currentTarget.style.transform = 'none' }}
              >
                Order Now 🔥
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                style={{
                  padding: '0.65rem 1.1rem', borderRadius: 12,
                  border: '1.5px solid rgba(196,168,130,0.4)',
                  background: 'transparent', cursor: 'pointer',
                  fontWeight: 600, fontSize: '0.875rem',
                  color: '#7a4820', fontFamily: "'DM Sans',sans-serif",
                  transition: 'all 0.25s',
                }}
                onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(224,96,32,0.4)'; e.currentTarget.style.color = '#e06020' }}
                onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(196,168,130,0.4)'; e.currentTarget.style.color = '#7a4820' }}
              >
                Login
              </button>

              <button
                onClick={() => navigate('/register')}
                style={{
                  padding: '0.65rem 1.35rem', borderRadius: 12,
                  background: 'linear-gradient(135deg,#b84a14,#e06020)',
                  color: '#fff', border: 'none', cursor: 'pointer',
                  fontWeight: 700, fontSize: '0.875rem',
                  fontFamily: "'DM Sans',sans-serif",
                  boxShadow: '0 4px 16px rgba(224,96,32,0.3)',
                  transition: 'all 0.28s',
                }}
                onMouseOver={e => { e.currentTarget.style.boxShadow = '0 8px 28px rgba(224,96,32,0.5)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                onMouseOut={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(224,96,32,0.3)'; e.currentTarget.style.transform = 'none' }}
              >
                Register 🔥
              </button>
            </>
          )}

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="ec-hamburger"
            style={{ display: 'none', flexDirection: 'column', gap: 5, background: 'none', border: 'none', cursor: 'pointer', padding: 6 }}
          >
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                display: 'block', width: 22, height: 2,
                background: '#2e1a0a', borderRadius: 2, transition: 'all 0.3s',
                ...(menuOpen && i === 0 ? { transform: 'rotate(45deg) translate(5px,5px)' } : {}),
                ...(menuOpen && i === 1 ? { opacity: 0 } : {}),
                ...(menuOpen && i === 2 ? { transform: 'rotate(-45deg) translate(5px,-5px)' } : {}),
              }} />
            ))}
          </button>
        </div>
      </nav>

      {/* ── Mobile Menu — OUTSIDE nav, INSIDE header ── */}
      {menuOpen && (
        <div style={{
          borderTop: '1px solid rgba(196,168,130,0.3)',
          background: 'rgba(247,240,232,0.98)',
          padding: '1rem 2rem',
        }}>
          {NAV_LINKS.map(link => (
            <button
              key={link.label}
              onClick={() => handleNav(link)}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '0.85rem 0',
                borderBottom: '1px solid rgba(196,168,130,0.18)',
                background: 'none', border: 'none',
                cursor: 'pointer', fontSize: '0.95rem',
                color: isActive(link) ? '#e06020' : '#5a3418',
                fontFamily: "'DM Sans',sans-serif", fontWeight: 500,
              }}
            >
              {link.label}
            </button>
          ))}

          {isLoggedIn ? (
            <>
              <button
                onClick={() => { navigate(isAdmin ? '/admin/dashboard' : '/dashboard'); setMenuOpen(false) }}
                style={{ width: '100%', padding: '0.85rem 0', background: 'none', border: 'none', borderBottom: '1px solid rgba(196,168,130,0.18)', cursor: 'pointer', fontSize: '0.95rem', color: '#5a3418', fontFamily: "'DM Sans',sans-serif", fontWeight: 500, textAlign: 'left' }}
              >
                {isAdmin ? '⚙️ Admin Dashboard' : '👤 My Dashboard'}
              </button>
              <button
                onClick={() => { navigate('/menu'); setMenuOpen(false) }}
                style={{ width: '100%', padding: '0.9rem', borderRadius: 12, marginTop: '1rem', background: 'linear-gradient(135deg,#b84a14,#e06020)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.95rem', fontFamily: "'DM Sans',sans-serif" }}
              >
                Order Now 🔥
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: '1rem' }}>
              <button
                onClick={() => { navigate('/login'); setMenuOpen(false) }}
                style={{ width: '100%', padding: '0.85rem', borderRadius: 12, border: '1.5px solid rgba(196,168,130,0.4)', background: 'transparent', color: '#7a4820', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: '0.95rem' }}
              >
                Login
              </button>
              <button
                onClick={() => { navigate('/register'); setMenuOpen(false) }}
                style={{ width: '100%', padding: '0.85rem', borderRadius: 12, background: 'linear-gradient(135deg,#b84a14,#e06020)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.95rem', fontFamily: "'DM Sans',sans-serif" }}
              >
                Register 🔥
              </button>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .ec-nav-links  { display: none !important; }
          .ec-hamburger  { display: flex !important; }
        }
      `}</style>
    </header>
  )
}