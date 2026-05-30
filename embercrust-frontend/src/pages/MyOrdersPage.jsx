import { useState, useEffect } from 'react'
import { useNavigate }         from 'react-router-dom'
import { orderAPI }            from '../services/api'

const STATUS_COLORS = {
  'Order Received':   { bg: 'rgba(59,130,246,0.1)',  color: '#3b82f6', border: 'rgba(59,130,246,0.3)'  },
  'In Kitchen':       { bg: 'rgba(245,158,11,0.1)',  color: '#f59e0b', border: 'rgba(245,158,11,0.3)'  },
  'Sent to Delivery': { bg: 'rgba(139,92,246,0.1)',  color: '#8b5cf6', border: 'rgba(139,92,246,0.3)'  },
  'Delivered':        { bg: 'rgba(22,163,74,0.1)',   color: '#16a34a', border: 'rgba(22,163,74,0.3)'   },
  'Cancelled':        { bg: 'rgba(220,38,38,0.1)',   color: '#dc2626', border: 'rgba(220,38,38,0.3)'   },
}

const STATUS_ICONS = {
  'Order Received':   '📋',
  'In Kitchen':       '👨‍🍳',
  'Sent to Delivery': '🚴',
  'Delivered':        '✅',
  'Cancelled':        '❌',
}

export default function MyOrdersPage() {
  const navigate            = useNavigate()
  const [orders,   setOrders]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [filter,  setFilter]    = useState('all')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await orderAPI.getMyOrders()
      setOrders(res.data.data)
    } catch {
      console.error('Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  const filtered = filter === 'all'
    ? orders
    : orders.filter(o => o.orderStatus === filter)

  return (
    <div style={{ minHeight: '100vh', background: '#f7f0e8', paddingTop: '5rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 2.5rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: '2rem', color: '#2e1a0a' }}>
            My Orders 📦
          </h1>
          <button
            onClick={() => navigate('/menu')}
            style={{
              padding: '0.65rem 1.25rem', borderRadius: 12,
              background: 'linear-gradient(135deg,#b84a14,#e06020)',
              color: '#fff', border: 'none', cursor: 'pointer',
              fontWeight: 700, fontSize: '0.875rem',
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            Order Again 🔥
          </button>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {[
            { id: 'all',              label: `All (${orders.length})` },
            { id: 'Order Received',   label: '📋 Received' },
            { id: 'In Kitchen',       label: '👨‍🍳 In Kitchen' },
            { id: 'Sent to Delivery', label: '🚴 On the Way' },
            { id: 'Delivered',        label: '✅ Delivered' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              style={{
                padding: '0.45rem 1rem', borderRadius: 9999,
                border: filter === f.id
                  ? 'none'
                  : '1px solid rgba(196,168,130,0.4)',
                background: filter === f.id
                  ? 'linear-gradient(135deg,#b84a14,#e06020)'
                  : 'rgba(255,255,255,0.6)',
                color: filter === f.id ? '#fff' : '#7a4820',
                fontWeight: filter === f.id ? 700 : 500,
                fontSize: '0.8rem', cursor: 'pointer',
                fontFamily: "'DM Sans',sans-serif",
                transition: 'all 0.2s',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Orders */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', fontSize: '2.5rem' }}>🔥</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', background: '#fdf8f2', border: '1px solid rgba(196,168,130,0.3)', borderRadius: 20 }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.25rem', color: '#2e1a0a', marginBottom: '0.5rem' }}>
              No orders found
            </h3>
            <p style={{ color: '#7a4820', marginBottom: '1.5rem' }}>
              {filter === 'all' ? "You haven't placed any orders yet!" : `No orders with status "${filter}"`}
            </p>
            <button
              onClick={() => navigate('/menu')}
              style={{ background: 'linear-gradient(135deg,#b84a14,#e06020)', color: '#fff', border: 'none', borderRadius: 12, padding: '0.8rem 2rem', fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}
            >
              Browse Menu →
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filtered.map(order => {
              const statusStyle = STATUS_COLORS[order.orderStatus] || STATUS_COLORS['Order Received']
              return (
                <div
                  key={order._id}
                  onClick={() => navigate(`/order/${order._id}`)}
                  style={{
                    background: '#fdf8f2',
                    border: '1px solid rgba(196,168,130,0.3)',
                    borderRadius: 16, padding: '1.25rem',
                    cursor: 'pointer', transition: 'all 0.3s',
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.borderColor = 'rgba(224,96,32,0.28)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(46,26,10,0.1)'
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.borderColor = 'rgba(196,168,130,0.3)'
                    e.currentTarget.style.transform = 'none'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>

                    {/* Left */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{
                        width: 48, height: 48, borderRadius: 12,
                        background: statusStyle.bg,
                        border: `1px solid ${statusStyle.border}`,
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0,
                      }}>
                        {STATUS_ICONS[order.orderStatus]}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: '#2e1a0a', fontSize: '0.95rem' }}>
                          Order #{order._id?.slice(-8).toUpperCase()}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#c4a882', marginTop: 2 }}>
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                          {' · '}
                          {new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#7a4820', marginTop: 2 }}>
                          {order.items?.length} item{order.items?.length !== 1 ? 's' : ''} · {order.address?.city}
                        </div>
                      </div>
                    </div>

                    {/* Right */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: '1.15rem', color: '#e06020' }}>
                          ₹{order.finalAmount}
                        </div>
                        {order.discount > 0 && (
                          <div style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 600 }}>
                            Saved ₹{order.discount}
                          </div>
                        )}
                      </div>

                      <div style={{
                        background: statusStyle.bg,
                        border: `1px solid ${statusStyle.border}`,
                        color: statusStyle.color,
                        borderRadius: 9999, padding: '0.35rem 0.85rem',
                        fontSize: '0.75rem', fontWeight: 700, whiteSpace: 'nowrap',
                      }}>
                        {order.orderStatus}
                      </div>

                      <span style={{ color: '#c4a882' }}>→</span>
                    </div>
                  </div>

                  {/* Pizza thumbnails */}
                  <div style={{ display: 'flex', gap: 6, marginTop: '0.85rem', paddingTop: '0.85rem', borderTop: '1px solid rgba(196,168,130,0.2)' }}>
                    {order.items?.slice(0, 4).map((item, i) => (
                      <img
                        key={i}
                        src={item.image}
                        alt={item.name}
                        style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover', border: '1px solid rgba(196,168,130,0.3)' }}
                        onError={e => e.target.src = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100&q=80'}
                      />
                    ))}
                    {order.items?.length > 4 && (
                      <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(196,168,130,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', color: '#7a4820', fontWeight: 700 }}>
                        +{order.items.length - 4}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}