import { useState, useEffect } from 'react'
import { useNavigate }         from 'react-router-dom'
import { orderAPI }            from '../../services/api'

const STATUS_OPTIONS = [
  'Order Received',
  'In Kitchen',
  'Sent to Delivery',
  'Delivered',
  'Cancelled',
]

const STATUS_COLORS = {
  'Order Received':   { bg:'rgba(59,130,246,0.1)',  color:'#3b82f6', border:'rgba(59,130,246,0.3)'  },
  'In Kitchen':       { bg:'rgba(245,158,11,0.1)',  color:'#f59e0b', border:'rgba(245,158,11,0.3)'  },
  'Sent to Delivery': { bg:'rgba(139,92,246,0.1)',  color:'#8b5cf6', border:'rgba(139,92,246,0.3)'  },
  'Delivered':        { bg:'rgba(22,163,74,0.1)',   color:'#16a34a', border:'rgba(22,163,74,0.3)'   },
  'Cancelled':        { bg:'rgba(220,38,38,0.1)',   color:'#dc2626', border:'rgba(220,38,38,0.3)'   },
}

export default function ManageOrdersPage() {
  const navigate = useNavigate()

  const [orders,    setOrders]    = useState([])
  const [loading,   setLoading]   = useState(true)
  const [filter,    setFilter]    = useState('all')
  const [updating,  setUpdating]  = useState(null)
  const [success,   setSuccess]   = useState('')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const res = await orderAPI.getAllOrders({ limit: 100 })
      setOrders(res.data.data)
    } catch {
      console.error('Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdating(orderId)
      await orderAPI.updateOrderStatus(orderId, newStatus)
      setOrders(prev => prev.map(o =>
        o._id === orderId ? { ...o, orderStatus: newStatus } : o
      ))
      setSuccess(`Order status updated to "${newStatus}"`)
      setTimeout(() => setSuccess(''), 3000)
    } catch {
      alert('Failed to update status')
    } finally {
      setUpdating(null)
    }
  }

  const filtered = filter === 'all'
    ? orders
    : orders.filter(o => o.orderStatus === filter)

  return (
    <div style={{ minHeight: '100vh', background: '#f7f0e8', paddingTop: '5rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 2.5rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <button onClick={() => navigate('/admin/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7a4820', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', display: 'block', fontFamily: "'DM Sans',sans-serif" }}>
              ← Back to Dashboard
            </button>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: '2rem', color: '#2e1a0a' }}>
              Manage Orders 📦
            </h1>
          </div>
          <button onClick={fetchOrders} style={{ padding: '0.65rem 1.25rem', borderRadius: 12, background: 'linear-gradient(135deg,#b84a14,#e06020)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>
            🔄 Refresh
          </button>
        </div>

        {/* Success message */}
        {success && (
          <div style={{ background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.3)', borderRadius: 12, padding: '0.85rem 1rem', color: '#16a34a', fontWeight: 600, marginBottom: '1rem', fontSize: '0.875rem' }}>
            ✅ {success}
          </div>
        )}

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {[
            { id: 'all',              label: `All (${orders.length})` },
            { id: 'Order Received',   label: '📋 Received' },
            { id: 'In Kitchen',       label: '👨‍🍳 In Kitchen' },
            { id: 'Sent to Delivery', label: '🚴 Out for Delivery' },
            { id: 'Delivered',        label: '✅ Delivered' },
            { id: 'Cancelled',        label: '❌ Cancelled' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              style={{
                padding: '0.45rem 1rem', borderRadius: 9999, cursor: 'pointer',
                border: filter === f.id ? 'none' : '1px solid rgba(196,168,130,0.4)',
                background: filter === f.id ? 'linear-gradient(135deg,#b84a14,#e06020)' : 'rgba(255,255,255,0.6)',
                color: filter === f.id ? '#fff' : '#7a4820',
                fontWeight: filter === f.id ? 700 : 500,
                fontSize: '0.8rem', fontFamily: "'DM Sans',sans-serif",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Orders table */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', fontSize: '2.5rem' }}>🔥</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', background: '#fdf8f2', border: '1px solid rgba(196,168,130,0.3)', borderRadius: 20 }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📭</div>
            <p style={{ color: '#7a4820' }}>No orders found</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filtered.map(order => {
              const statusStyle = STATUS_COLORS[order.orderStatus] || STATUS_COLORS['Order Received']
              return (
                <div
                  key={order._id}
                  style={{
                    background: '#fdf8f2',
                    border: '1px solid rgba(196,168,130,0.3)',
                    borderRadius: 16, padding: '1.25rem',
                    opacity: updating === order._id ? 0.6 : 1,
                    transition: 'opacity 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>

                    {/* Order info */}
                    <div>
                      <div style={{ fontWeight: 700, color: '#2e1a0a', fontSize: '0.95rem', marginBottom: 4 }}>
                        #{order._id?.slice(-10).toUpperCase()}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#7a4820', marginBottom: 2 }}>
                        👤 {order.user?.name} · {order.user?.email}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#7a4820', marginBottom: 2 }}>
                        📍 {order.address?.city}, {order.address?.state}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#c4a882' }}>
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        {' · '}
                        {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                      </div>
                    </div>

                    {/* Amount + status */}
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: '1.2rem', color: '#e06020', marginBottom: 6 }}>
                        ₹{order.finalAmount}
                      </div>
                      <div style={{ background: statusStyle.bg, border: `1px solid ${statusStyle.border}`, color: statusStyle.color, borderRadius: 9999, padding: '0.3rem 0.85rem', fontSize: '0.75rem', fontWeight: 700, display: 'inline-block' }}>
                        {order.orderStatus}
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div style={{ display: 'flex', gap: 6, margin: '0.85rem 0', padding: '0.75rem 0', borderTop: '1px solid rgba(196,168,130,0.2)', borderBottom: '1px solid rgba(196,168,130,0.2)' }}>
                    {order.items?.slice(0, 4).map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <img src={item.image} alt={item.name} style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 6 }} onError={e => e.target.src = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100&q=80'} />
                        <span style={{ fontSize: '0.75rem', color: '#5a3418', fontWeight: 500 }}>{item.name} x{item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Update status */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#5a3418' }}>Update Status:</span>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {STATUS_OPTIONS.filter(s => s !== order.orderStatus).map(status => {
                        const sc = STATUS_COLORS[status]
                        return (
                          <button
                            key={status}
                            onClick={() => handleStatusUpdate(order._id, status)}
                            disabled={updating === order._id}
                            style={{
                              padding: '0.35rem 0.85rem', borderRadius: 9999,
                              background: sc.bg, border: `1px solid ${sc.border}`,
                              color: sc.color, fontSize: '0.72rem', fontWeight: 700,
                              cursor: updating === order._id ? 'not-allowed' : 'pointer',
                              fontFamily: "'DM Sans',sans-serif", transition: 'all 0.2s',
                            }}
                            onMouseOver={e => e.currentTarget.style.opacity = '0.75'}
                            onMouseOut={e => e.currentTarget.style.opacity = '1'}
                          >
                            → {status}
                          </button>
                        )
                      })}
                    </div>
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