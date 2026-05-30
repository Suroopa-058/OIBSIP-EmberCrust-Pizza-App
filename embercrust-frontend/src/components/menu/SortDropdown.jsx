import { SORT_OPTIONS } from '../../data/menuData'

export default function SortDropdown({ value, onChange }) {
  return (
    <div style={{ position: 'relative' }}>
      <span style={{
        position: 'absolute', left: 12, top: '50%',
        transform: 'translateY(-50%)',
        color: '#c4a882', pointerEvents: 'none', fontSize: '0.9rem',
      }}>
        ↕
      </span>

      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          appearance: 'none',
          padding: '0.72rem 2.4rem 0.72rem 2rem',
          borderRadius: 12,
          border: '1.5px solid rgba(196,168,130,0.4)',
          background: 'rgba(255,255,255,0.75)',
          backdropFilter: 'blur(10px)',
          fontSize: '0.88rem', color: '#2e1a0a',
          fontFamily: "'DM Sans', sans-serif",
          cursor: 'pointer', outline: 'none',
          boxShadow: '0 2px 10px rgba(46,26,10,0.05)',
          minWidth: 180, transition: 'border-color 0.25s',
        }}
        onFocus={e => e.target.style.borderColor = '#e06020'}
        onBlur={e => e.target.style.borderColor = 'rgba(196,168,130,0.4)'}
      >
        {SORT_OPTIONS.map(opt => (
          <option key={opt.id} value={opt.id}>{opt.label}</option>
        ))}
      </select>

      <span style={{
        position: 'absolute', right: 10, top: '50%',
        transform: 'translateY(-50%)',
        color: '#c4a882', pointerEvents: 'none', fontSize: '0.7rem',
      }}>
        ▼
      </span>
    </div>
  )
}