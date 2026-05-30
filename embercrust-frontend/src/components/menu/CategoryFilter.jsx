import { CATEGORIES } from '../../data/menuData'

export default function CategoryFilter({ active, onChange, counts }) {
  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
      {CATEGORIES.map(cat => {
        const isActive = active === cat.id
        const count = cat.id !== 'all' ? (counts?.[cat.id] ?? 0) : null

        return (
          <button
            key={cat.id}
            onClick={() => onChange(cat.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '0.55rem 1.15rem', borderRadius: 9999,
              border: isActive
                ? '1.5px solid #e06020'
                : '1.5px solid rgba(196,168,130,0.45)',
              background: isActive
                ? 'linear-gradient(135deg,#b84a14,#e06020)'
                : 'rgba(255,255,255,0.65)',
              color: isActive ? '#fff' : '#7a4820',
              fontSize: '0.82rem', fontWeight: 600,
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.25s',
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: isActive
                ? '0 4px 16px rgba(224,96,32,0.32)'
                : '0 2px 8px rgba(46,26,10,0.06)',
            }}
            onMouseOver={e => {
              if (!isActive) {
                e.currentTarget.style.borderColor = 'rgba(224,96,32,0.5)'
                e.currentTarget.style.color = '#b84a14'
              }
            }}
            onMouseOut={e => {
              if (!isActive) {
                e.currentTarget.style.borderColor = 'rgba(196,168,130,0.45)'
                e.currentTarget.style.color = '#7a4820'
              }
            }}
          >
            <span style={{ fontSize: '0.9rem' }}>{cat.icon}</span>
            {cat.label}
            {count !== null && count > 0 && (
              <span style={{
                fontSize: '0.68rem', fontWeight: 700,
                padding: '1px 6px', borderRadius: 9999,
                background: isActive ? 'rgba(255,255,255,0.25)' : 'rgba(224,96,32,0.12)',
                color: isActive ? '#fff' : '#b84a14',
              }}>
                {count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}