import { useNavigate } from 'react-router-dom'

export default function Hero() {
  const navigate = useNavigate()

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section id="home" style={{
      position: 'relative', minHeight: '100vh',
      display: 'flex', alignItems: 'center',
      paddingTop: '4rem', overflow: 'hidden',
      background: 'linear-gradient(160deg, #f7f0e8 0%, #efe6d8 60%, #e8ddd0 100%)',
    }}>

      {/* Background glows */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div className="glow-pulse" style={{
          position: 'absolute', top: '15%', right: '20%',
          width: 480, height: 480, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(224,96,32,0.15) 0%, transparent 65%)',
        }} />
        <div className="glow-pulse2" style={{
          position: 'absolute', bottom: '20%', left: '10%',
          width: 320, height: 320, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(196,168,130,0.2) 0%, transparent 65%)',
        }} />
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.02,
          backgroundImage: 'radial-gradient(circle, #2e1a0a 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }} />
      </div>

      <div style={{
        maxWidth: 1340, margin: '0 auto',
        padding: '5rem 2.5rem',
        display: 'grid',
        gridTemplateColumns: '1.05fr 0.95fr',
        gap: '4rem', alignItems: 'center',
        width: '100%', position: 'relative', zIndex: 1,
      }}
        className="hero-grid"
      >

        {/* ── LEFT ── */}
        <div className="fade-up">

          {/* Live badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontSize: '0.7rem', fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: '#b84a14', background: 'rgba(224,96,32,0.1)',
            border: '1px solid rgba(224,96,32,0.25)',
            borderRadius: 9999, padding: '0.4rem 1.1rem', marginBottom: '1.75rem',
          }}>
            <span className="pulse-dot" style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#e06020', display: 'inline-block',
            }} />
            Live delivery · Est. 28 mins
          </div>

          {/* Heading */}
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 900,
            fontSize: 'clamp(2.8rem, 4.5vw, 5rem)',
            lineHeight: 1.04, letterSpacing: '-0.02em',
            marginBottom: '1.5rem', color: '#2e1a0a',
          }}>
            Craft Pizza<br />
            <span className="shimmer-text">Born in Fire.</span>
          </h1>

          {/* Subheading */}
          <p style={{
            color: '#7a4820', fontSize: '1.1rem',
            lineHeight: 1.8, maxWidth: 490, marginBottom: '2.5rem',
          }}>
            Wood-fired masterpieces hand-stretched daily, fired at 900°F,
            crafted from DOP-certified Italian ingredients. This is pizza
            elevated to an art form — delivered blazing hot to your door.
          </p>

          {/* CTA buttons */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
            <button
              onClick={() => navigate('/menu')}
              style={{
                padding: '1rem 2.25rem', borderRadius: 14,
                background: 'linear-gradient(135deg,#b84a14,#e06020,#f0844a)',
                color: '#fff', border: 'none', cursor: 'pointer',
                fontWeight: 700, fontSize: '1rem',
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
              Explore Menu →
            </button>

            <button
              onClick={() => scrollTo('about')}
              style={{
                padding: '1rem 2.25rem', borderRadius: 14,
                background: 'transparent',
                border: '1.5px solid rgba(224,96,32,0.35)',
                color: '#5a3418', cursor: 'pointer',
                fontWeight: 700, fontSize: '1rem',
                fontFamily: "'DM Sans', sans-serif",
                display: 'flex', alignItems: 'center', gap: 10,
                transition: 'all 0.28s',
              }}
              onMouseOver={e => {
                e.currentTarget.style.borderColor = '#e06020'
                e.currentTarget.style.background = 'rgba(224,96,32,0.06)'
                e.currentTarget.style.color = '#2e1a0a'
              }}
              onMouseOut={e => {
                e.currentTarget.style.borderColor = 'rgba(224,96,32,0.35)'
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = '#5a3418'
              }}
            >
              <span style={{
                width: 34, height: 34, borderRadius: '50%',
                background: 'rgba(224,96,32,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.8rem',
                border: '1px solid rgba(224,96,32,0.22)',
              }}>▶</span>
              Watch Story
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {[
              ['50K+',   'DELIVERIES'],
              ['4.9 ★',  'RATING'],
              ['28 Min', 'AVG DELIVERY'],
            ].map(([num, label]) => (
              <div key={label} style={{
                border: '1px solid rgba(196,168,130,0.4)',
                background: 'rgba(255,255,255,0.5)',
                backdropFilter: 'blur(8px)',
                borderRadius: 16, padding: '1rem 1.5rem', textAlign: 'center',
              }}>
                <div style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.85rem', fontWeight: 900, color: '#e06020',
                }}>
                  {num}
                </div>
                <div style={{
                  fontSize: '0.68rem', color: '#7a4820',
                  fontWeight: 600, letterSpacing: '0.08em', marginTop: 2,
                }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Pizza Image ── */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', position: 'relative',
        }}>
          <div style={{ position: 'relative', width: 460, height: 460 }}>

            {/* Glow */}
            <div className="glow-pulse" style={{
              position: 'absolute', inset: -20, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(224,96,32,0.2) 0%, transparent 65%)',
            }} />

            {/* Spinning ring */}
            <div className="spin-slow" style={{
              position: 'absolute', inset: 4, borderRadius: '50%',
              border: '1.5px dashed rgba(196,168,130,0.5)',
            }} />

            {/* Pizza photo */}
            <div className="float-anim" style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{
                width: '84%', height: '84%', borderRadius: '50%',
                overflow: 'hidden',
                boxShadow: '0 0 60px rgba(224,96,32,0.25), 0 40px 80px rgba(46,26,10,0.25)',
              }}>
                <img
                  src="https://i0.wp.com/olivesandlamb.com/wp-content/uploads/2024/05/Chicken-Parmesan-Pizza-10-4x5-1.jpg?resize=819%2C1024&ssl=1"
                  alt="Premium wood-fired pizza"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={e => {
                    e.target.src = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80&auto=format'
                  }}
                />
              </div>
            </div>

            {/* Badge 1 */}
            <div className="float-badge-1" style={{
              position: 'absolute', top: 30, left: -15,
              backdropFilter: 'blur(16px)',
              background: 'rgba(253,248,242,0.88)',
              border: '1px solid rgba(196,168,130,0.4)',
              borderRadius: 14, padding: '0.65rem 1rem',
              boxShadow: '0 8px 30px rgba(46,26,10,0.1)',
            }}>
              <div style={{ fontSize: '0.65rem', color: '#7a4820' }}>Wood-Fired</div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#16a34a', marginTop: 1 }}>
                900°F Oven ✓
              </div>
            </div>

            {/* Badge 2 */}
            <div className="float-badge-2" style={{
              position: 'absolute', bottom: 55, right: -15,
              backdropFilter: 'blur(16px)',
              background: 'rgba(253,248,242,0.88)',
              border: '1px solid rgba(196,168,130,0.4)',
              borderRadius: 14, padding: '0.65rem 1rem',
              boxShadow: '0 8px 30px rgba(46,26,10,0.1)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '1.25rem' }}>⭐</span>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#2e1a0a' }}>
                    4.9 Rating
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#7a4820' }}>50K+ reviews</div>
                </div>
              </div>
            </div>

            {/* Badge 3 */}
            <div className="float-badge-3" style={{
              position: 'absolute', top: '50%', right: -25,
              transform: 'translateY(-50%)',
              backdropFilter: 'blur(16px)',
              background: 'rgba(253,248,242,0.88)',
              border: '1px solid rgba(196,168,130,0.4)',
              borderRadius: 14, padding: '0.65rem 1rem',
              boxShadow: '0 8px 30px rgba(46,26,10,0.1)',
            }}>
              <div style={{ fontSize: '0.65rem', color: '#7a4820' }}>Delivery</div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#e06020' }}>
                ≤ 28 min 🚴
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute', bottom: '2rem', left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 6, color: '#c4a882',
      }}>
        <span style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Scroll
        </span>
        <div style={{
          width: 1, height: 36,
          background: 'linear-gradient(to bottom, #c4a882, transparent)',
        }} />
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}