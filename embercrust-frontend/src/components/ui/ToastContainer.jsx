export default function ToastContainer({ toasts, onRemove }) {
  if (!toasts.length) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: 28,
      right: 28,
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      pointerEvents: 'none',
    }}>
      {toasts.map(t => (
        <div
          key={t.id}
          onClick={() => onRemove(t.id)}
          className="slide-toast"
          style={{
            pointerEvents: 'all',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: '#fdf8f2',
            border: '1px solid rgba(224,96,32,0.3)',
            borderRadius: 14,
            padding: '12px 18px',
            boxShadow: '0 8px 40px rgba(46,26,10,0.14)',
            cursor: 'pointer',
            minWidth: 240,
            maxWidth: 320,
          }}
        >
          <span style={{ fontSize: 20 }}>
            {t.type === 'success' ? '🛒' : '❌'}
          </span>
          <div>
            <div style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#2e1a0a',
              fontFamily: "'DM Sans', sans-serif",
            }}>
              {t.message}
            </div>
            <div style={{
              fontSize: '0.72rem',
              color: '#7a4820',
              marginTop: 1,
            }}>
              {t.type === 'success' ? 'Added to your cart' : 'Something went wrong'}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}