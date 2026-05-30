import { TESTIMONIALS } from '../../data/menuData'

export default function Testimonials() {
  return (
    <section style={{
      padding: '7rem 2.5rem',
      background: '#efe6d8',
      borderTop: '1px solid rgba(196,168,130,0.3)',
    }}>
      <div style={{ maxWidth: 1340, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span style={{
            display: 'block', fontSize: '0.7rem', fontWeight: 700,
            letterSpacing: '0.15em', textTransform: 'uppercase',
            color: '#e06020', marginBottom: '1rem',
          }}>
            — What They Say —
          </span>
          <h2 style={{
            fontFamily: "'Playfair Display', serif", fontWeight: 900,
            fontSize: 'clamp(2rem,4vw,3.25rem)', color: '#2e1a0a',
          }}>
            Critics &amp; <span className="shimmer-text">Customers</span> Agree
          </h2>
        </div>

        {/* Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.75rem',
        }}
          className="testi-grid"
        >
          {TESTIMONIALS.map(t => (
            <div
              key={t.name}
              style={{
                background: '#fdf8f2',
                border: '1px solid rgba(196,168,130,0.3)',
                borderRadius: 20, padding: '2rem',
                transition: 'all 0.3s',
              }}
              onMouseOver={e => {
                e.currentTarget.style.borderColor = 'rgba(224,96,32,0.25)'
                e.currentTarget.style.transform = 'translateY(-5px)'
                e.currentTarget.style.boxShadow = '0 20px 50px rgba(46,26,10,0.1)'
              }}
              onMouseOut={e => {
                e.currentTarget.style.borderColor = 'rgba(196,168,130,0.3)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {/* Stars */}
              <div style={{ color: '#e06020', fontSize: '1.05rem', marginBottom: '1.5rem', letterSpacing: '0.06em' }}>
                ★★★★★
              </div>

              {/* Review */}
              <p style={{ color: '#5a3418', fontSize: '0.875rem', lineHeight: 1.8, marginBottom: '2rem' }}>
                "{t.text}"
              </p>

              {/* Author */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12,
                paddingTop: '1.25rem',
                borderTop: '1px solid rgba(196,168,130,0.25)',
              }}>
                <div style={{
                  width: 42, height: 42, borderRadius: '50%',
                  background: t.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.8rem', fontWeight: 700, color: '#fff',
                  flexShrink: 0, border: '2px solid rgba(255,255,255,0.4)',
                }}>
                  {t.initials}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#2e1a0a' }}>
                    {t.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#7a4820' }}>
                    {t.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .testi-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 600px) { .testi-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}