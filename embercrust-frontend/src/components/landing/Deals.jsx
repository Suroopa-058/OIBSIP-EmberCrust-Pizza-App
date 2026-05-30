import { useNavigate } from 'react-router-dom'

export default function Deals() {
  const navigate = useNavigate()

  return (
    <section id="deals" style={{ padding: '6rem 2.5rem', background: '#f7f0e8' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{
          position: 'relative', borderRadius: 28, overflow: 'hidden',
          border: '1px solid rgba(196,168,130,0.35)',
        }}>
          {/* BG image */}
          <img
            src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&q=75&auto=format"
            alt=""
            style={{
              position: 'absolute', inset: 0, width: '100%',
              height: '100%', objectFit: 'cover', opacity: 0.12,
            }}
            onError={e => e.target.style.display = 'none'}
          />
          {/* Overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, rgba(247,240,232,0.97), rgba(239,230,216,0.96))',
          }} />
          {/* Glow */}
          <div className="glow-pulse" style={{
            position: 'absolute', top: 0, left: '25%',
            width: 260, height: 260, borderRadius: '50%',
            background: 'radial-gradient(circle,rgba(224,96,32,0.15) 0%,transparent 70%)',
          }} />

          <div style={{ position: 'relative', padding: '5rem 3rem', textAlign: 'center' }}>
            <span style={{
              display: 'block', fontSize: '0.7rem', fontWeight: 700,
              letterSpacing: '0.15em', textTransform: 'uppercase',
              color: '#e06020', marginBottom: '1rem',
            }}>
              🔥 Limited Time Offer
            </span>

            <h2 style={{
              fontFamily: "'Playfair Display', serif", fontWeight: 900,
              fontSize: 'clamp(2.5rem,5vw,4.25rem)',
              lineHeight: 1.08, marginBottom: '1.25rem', color: '#2e1a0a',
            }}>
              30% Off <span className="shimmer-text">Your First</span><br />Order
            </h2>

            <p style={{ color: '#7a4820', fontSize: '1rem', marginBottom: '0.85rem', lineHeight: 1.7 }}>
              Use code{' '}
              <code style={{
                background: 'rgba(224,96,32,0.12)', color: '#b84a14',
                padding: '0.25rem 0.7rem', borderRadius: '0.45rem',
                fontFamily: 'monospace', fontSize: '0.95em',
                border: '1px solid rgba(224,96,32,0.25)',
              }}>
                EMBER30
              </code>
              {' '}at checkout.
            </p>

            <p style={{ color: '#c4a882', fontSize: '0.78rem', marginBottom: '3rem' }}>
              Valid on orders over $25 · Single use · Ends Sunday midnight
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate('/menu')}
                style={{
                  padding: '1rem 2.75rem', borderRadius: 14,
                  background: 'linear-gradient(135deg,#b84a14,#e06020)',
                  color: '#fff', border: 'none', cursor: 'pointer',
                  fontWeight: 700, fontSize: '0.98rem',
                  fontFamily: "'DM Sans', sans-serif",
                  boxShadow: '0 6px 28px rgba(224,96,32,0.38)',
                  transition: 'all 0.3s',
                }}
                onMouseOver={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 10px 40px rgba(224,96,32,0.52)'
                }}
                onMouseOut={e => {
                  e.currentTarget.style.transform = 'none'
                  e.currentTarget.style.boxShadow = '0 6px 28px rgba(224,96,32,0.38)'
                }}
              >
                Claim Offer →
              </button>

              <button style={{
                padding: '1rem 2.75rem', borderRadius: 14,
                background: 'transparent',
                border: '1.5px solid rgba(224,96,32,0.35)',
                color: '#5a3418', cursor: 'pointer',
                fontWeight: 700, fontSize: '0.98rem',
                fontFamily: "'DM Sans', sans-serif",
                transition: 'all 0.28s',
              }}
                onMouseOver={e => {
                  e.currentTarget.style.borderColor = '#e06020'
                  e.currentTarget.style.background = 'rgba(224,96,32,0.06)'
                }}
                onMouseOut={e => {
                  e.currentTarget.style.borderColor = 'rgba(224,96,32,0.35)'
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                See All Deals
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}