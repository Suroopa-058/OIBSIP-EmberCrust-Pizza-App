export default function SearchBar({ value, onChange }) {
  return (
    <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
      <span style={{
        position: 'absolute', left: 13, top: '50%',
        transform: 'translateY(-50%)',
        fontSize: '0.95rem', color: '#c4a882', pointerEvents: 'none',
      }}>
        🔍
      </span>

      <input
        type="text"
        placeholder="Search pizzas…"
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '0.72rem 2.5rem 0.72rem 2.4rem',
          borderRadius: 12,
          border: '1.5px solid rgba(196,168,130,0.4)',
          background: 'rgba(255,255,255,0.75)',
          backdropFilter: 'blur(10px)',
          fontSize: '0.88rem', color: '#2e1a0a',
          fontFamily: "'DM Sans', sans-serif",
          outline: 'none', transition: 'border-color 0.25s, box-shadow 0.25s',
          boxShadow: '0 2px 10px rgba(46,26,10,0.05)',
        }}
        onFocus={e => {
          e.target.style.borderColor = '#e06020'
          e.target.style.boxShadow = '0 0 0 3px rgba(224,96,32,0.1)'
        }}
        onBlur={e => {
          e.target.style.borderColor = 'rgba(196,168,130,0.4)'
          e.target.style.boxShadow = '0 2px 10px rgba(46,26,10,0.05)'
        }}
      />

      {value && (
        <button
          onClick={() => onChange('')}
          style={{
            position: 'absolute', right: 12, top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(196,168,130,0.3)',
            border: 'none', cursor: 'pointer',
            width: 20, height: 20, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.65rem', color: '#7a4820', transition: 'background 0.2s',
          }}
          onMouseOver={e => e.currentTarget.style.background = 'rgba(224,96,32,0.2)'}
          onMouseOut={e => e.currentTarget.style.background = 'rgba(196,168,130,0.3)'}
        >
          ✕
        </button>
      )}
    </div>
  )
}