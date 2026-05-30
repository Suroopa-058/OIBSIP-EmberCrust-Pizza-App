import { useNavigate } from 'react-router-dom'

export default function Footer() {
  const navigate = useNavigate()

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer id="contact" style={{
      padding: '5.5rem 2.5rem 2.5rem',
      background: '#efe6d8',
      borderTop: '1px solid rgba(196,168,130,0.3)',
    }}>
      <div style={{ maxWidth: 1340, margin: '0 auto' }}>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr',
          gap: '3.5rem',
          marginBottom: '4rem',
        }}
          className="footer-grid"
        >
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.25rem' }}>
              <div style={{
                width: 38, height: 38, borderRadius: 12,
                background: 'linear-gradient(135deg,#b84a14,#e06020)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, boxShadow: '0 4px 16px rgba(224,96,32,0.3)',
              }}>🔥</div>
              <span style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700, fontSize: '1.2rem', color: '#2e1a0a',
              }}>
                Ember<span style={{ color: '#e06020' }}>Crust</span>
              </span>
            </div>
            <p style={{
              color: '#7a4820', fontSize: '0.875rem',
              lineHeight: 1.75, maxWidth: 290, marginBottom: '1.75rem',
            }}>
              Wood-fired pizza crafted with passion, delivered with precision. Born in fire. Built for you.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              {['𝕏', 'f', 'in', '📸'].map(s => (
                <button key={s} style={{
                  width: 38, height: 38, borderRadius: 10,
                  border: '1.5px solid rgba(196,168,130,0.4)',
                  background: 'transparent', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.85rem', color: '#7a4820', transition: 'all 0.25s',
                }}
                  onMouseOver={e => {
                    e.currentTarget.style.borderColor = 'rgba(224,96,32,0.45)'
                    e.currentTarget.style.color = '#e06020'
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.borderColor = 'rgba(196,168,130,0.4)'
                    e.currentTarget.style.color = '#7a4820'
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{
              fontSize: '0.75rem', fontWeight: 700,
              letterSpacing: '0.1em', color: '#2e1a0a',
              marginBottom: '1.4rem', textTransform: 'uppercase',
            }}>
              Quick Links
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Home',       action: () => scrollTo('home') },
                { label: 'Menu',       action: () => navigate('/menu') },
                { label: 'About Us',   action: () => scrollTo('about') },
                { label: 'Deals',      action: () => scrollTo('deals') },
                { label: 'Track Order',action: () => navigate('/order') },
                { label: 'Careers',    action: () => {} },
              ].map(l => (
                <button
                  key={l.label}
                  onClick={l.action}
                  style={{
                    textAlign: 'left', fontSize: '0.875rem',
                    color: '#7a4820', background: 'none',
                    border: 'none', cursor: 'pointer',
                    fontFamily: "'DM Sans', sans-serif",
                    transition: 'color 0.2s', padding: 0,
                  }}
                  onMouseOver={e => e.currentTarget.style.color = '#e06020'}
                  onMouseOut={e => e.currentTarget.style.color = '#7a4820'}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{
              fontSize: '0.75rem', fontWeight: 700,
              letterSpacing: '0.1em', color: '#2e1a0a',
              marginBottom: '1.4rem', textTransform: 'uppercase',
            }}>
              Contact
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: '0.875rem', color: '#7a4820' }}>
              {[
                { icon: '📍', text: '12 Ember Lane, Fire District, NY 10001' },
                { icon: '📞', text: '+1 (800) EMBER-CRUST' },
                { icon: '✉️', text: 'hello@embercrust.com' },
                { icon: '🕐', text: 'Daily 11am – 2am' },
              ].map(c => (
                <div key={c.text} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <span style={{ color: '#e06020', marginTop: 1, flexShrink: 0 }}>{c.icon}</span>
                  {c.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(196,168,130,0.4)',
          paddingTop: '2rem',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
        }}>
          <p style={{ fontSize: '0.78rem', color: '#c4a882' }}>
            © 2025 EmberCrust Co. All rights reserved. Made with 🔥 and ❤️.
          </p>
          <div style={{ display: 'flex', gap: '1.75rem' }}>
            {['Privacy Policy', 'Terms of Service', 'Cookie Settings'].map(l => (
              <button key={l} style={{
                fontSize: '0.78rem', color: '#c4a882',
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif", transition: 'color 0.2s',
              }}
                onMouseOver={e => e.currentTarget.style.color = '#7a4820'}
                onMouseOut={e => e.currentTarget.style.color = '#c4a882'}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  )
}