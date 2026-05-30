import { FEATURES } from '../../data/menuData'

export default function WhyChooseUs() {
  return (
    <section id="about" style={{
      padding: '7rem 2.5rem',
      background: '#efe6d8',
      borderTop: '1px solid rgba(196,168,130,0.3)',
      borderBottom: '1px solid rgba(196,168,130,0.3)',
    }}>
      <div style={{ maxWidth: 1340, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span style={{
            display: 'block', fontSize: '0.7rem', fontWeight: 700,
            letterSpacing: '0.15em', textTransform: 'uppercase',
            color: '#e06020', marginBottom: '1rem',
          }}>
            — Why EmberCrust —
          </span>
          <h2 style={{
            fontFamily: "'Playfair Display', serif", fontWeight: 900,
            fontSize: 'clamp(2rem,4vw,3.25rem)', color: '#2e1a0a',
          }}>
            The <span className="shimmer-text">Difference</span> You Taste
          </h2>
        </div>

        {/* Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1.5rem',
        }}
          className="feat-grid"
        >
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              style={{
                background: 'rgba(255,255,255,0.6)',
                border: '1px solid rgba(196,168,130,0.3)',
                borderRadius: 20, padding: '2rem',
                textAlign: 'center', transition: 'all 0.38s',
                animationDelay: `${i * 100}ms`,
              }}
              onMouseOver={e => {
                e.currentTarget.style.borderColor = 'rgba(224,96,32,0.3)'
                e.currentTarget.style.background = 'rgba(224,96,32,0.05)'
                e.currentTarget.style.transform = 'translateY(-5px)'
                e.currentTarget.style.boxShadow = '0 20px 50px rgba(46,26,10,0.1)'
              }}
              onMouseOut={e => {
                e.currentTarget.style.borderColor = 'rgba(196,168,130,0.3)'
                e.currentTarget.style.background = 'rgba(255,255,255,0.6)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{
                width: 64, height: 64, borderRadius: 16,
                background: 'rgba(224,96,32,0.1)',
                border: '1px solid rgba(224,96,32,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.75rem', margin: '0 auto 1.5rem',
              }}>
                {f.icon}
              </div>
              <h3 style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700, fontSize: '1.05rem',
                marginBottom: '0.75rem', color: '#2e1a0a',
              }}>
                {f.title}
              </h3>
              <p style={{ color: '#7a4820', fontSize: '0.85rem', lineHeight: 1.7 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px)  { .feat-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 500px)  { .feat-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}