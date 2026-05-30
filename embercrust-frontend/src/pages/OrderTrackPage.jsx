import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { orderAPI } from '../services/api'

const STATUS_STEPS = [
  { key: 'Order Received',   icon: '📋', label: 'Order Received',   desc: 'We have received your order'        },
  { key: 'In Kitchen',       icon: '👨‍🍳', label: 'In Kitchen',       desc: 'Our chefs are preparing your pizza' },
  { key: 'Sent to Delivery', icon: '🚴', label: 'Out for Delivery',  desc: 'Your order is on the way'           },
  { key: 'Delivered',        icon: '✅', label: 'Delivered',          desc: 'Enjoy your EmberCrust pizza!'      },
]

const STATUS_COLORS = {
  'Order Received':   '#3b82f6',
  'In Kitchen':       '#f59e0b',
  'Sent to Delivery': '#8b5cf6',
  'Delivered':        '#16a34a',
  'Cancelled':        '#dc2626',
}

export default function OrderTrackPage() {
  const { id }      = useParams()
  const navigate    = useNavigate()

  const [order,   setOrder]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  useEffect(() => {
    fetchOrder()
    // Poll every 30 seconds for status updates
    const interval = setInterval(fetchOrder, 30000)
    return () => clearInterval(interval)
  }, [id])

  const fetchOrder = async () => {
    try {
      const res = await orderAPI.getOrderById(id)
      setOrder(res.data.data)
    } catch {
      setError('Order not found')
    } finally {
      setLoading(false)
    }
  }

  const getCurrentStep = () => {
    if (!order) return 0
    const index = STATUS_STEPS.findIndex(s => s.key === order.orderStatus)
    return index === -1 ? 0 : index
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#f7f0e8', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '4rem' }}>
      <div style={{ fontSize: '3rem' }}>🔥</div>
    </div>
  )

  if (error || !order) return (
    <div style={{ minHeight: '100vh', background: '#f7f0e8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', paddingTop: '4rem' }}>
      <div style={{ fontSize: '3rem' }}>😕</div>
      <h2 style={{ fontFamily: "'Playfair Display',serif", color: '#2e1a0a' }}>Order not found</h2>
      <button onClick={() => navigate('/dashboard')} style={btnStyle}>← Back to Dashboard</button>
    </div>
  )

  const currentStep = getCurrentStep()
  const statusColor = STATUS_COLORS[order.orderStatus] || '#e06020'

  return (
    <div style={{ minHeight: '100vh', background: '#f7f0e8', paddingTop: '5rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: 750, margin: '0 auto', padding: '2rem 2.5rem' }}>

        {/* Back */}
        <button
          onClick={() => navigate('/dashboard')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7a4820', fontSize: '0.875rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 6, fontFamily: "'DM Sans',sans-serif" }}
        >
          ← Back to Dashboard
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: '1.85rem', color: '#2e1a0a' }}>
              Track Order
            </h1>
            <p style={{ color: '#7a4820', fontSize: '0.82rem', marginTop: 4 }}>
              Order ID: <strong>#{order._id?.slice(-10).toUpperCase()}</strong>
            </p>
          </div>

          {/* Status badge */}
          <div style={{
            background: `${statusColor}15`,
            border: `1px solid ${statusColor}40`,
            color: statusColor,
            borderRadius: 9999, padding: '0.5rem 1.25rem',
            fontWeight: 700, fontSize: '0.9rem',
          }}>
            {order.orderStatus === 'Sent to Delivery' ? '🚴 Out for Delivery' : `${STATUS_STEPS.find(s => s.key === order.orderStatus)?.icon} ${order.orderStatus}`}
          </div>
        </div>

        {/* ── Status Tracker ── */}
        <div style={{ background: '#fdf8f2', border: '1px solid rgba(196,168,130,0.3)', borderRadius: 20, padding: '2rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 800, fontSize: '1.1rem', color: '#2e1a0a', marginBottom: '1.75rem' }}>
            Order Status
          </h2>

          {order.orderStatus === 'Cancelled' ? (
            <div style={{ textAlign: 'center', padding: '1.5rem', background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: 14 }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>❌</div>
              <h3 style={{ fontFamily: "'Playfair Display',serif", color: '#dc2626', marginBottom: '0.5rem' }}>Order Cancelled</h3>
              <p style={{ color: '#7a4820', fontSize: '0.875rem' }}>This order has been cancelled.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {STATUS_STEPS.map((step, index) => {
                const isCompleted = index <= currentStep
                const isCurrent   = index === currentStep
                const isLast      = index === STATUS_STEPS.length - 1

                return (
                  <div key={step.key} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    {/* Icon + line */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                        background: isCompleted
                          ? `linear-gradient(135deg, ${statusColor}, ${statusColor}cc)`
                          : 'rgba(196,168,130,0.2)',
                        border: isCurrent
                          ? `2px solid ${statusColor}`
                          : isCompleted
                            ? 'none'
                            : '1px solid rgba(196,168,130,0.3)',
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: '1.2rem',
                        boxShadow: isCurrent ? `0 0 0 4px ${statusColor}20` : 'none',
                        transition: 'all 0.3s',
                      }}>
                        {step.icon}
                      </div>
                      {!isLast && (
                        <div style={{
                          width: 2, height: 40,
                          background: index < currentStep
                            ? `linear-gradient(to bottom, ${statusColor}, ${statusColor}80)`
                            : 'rgba(196,168,130,0.25)',
                          margin: '4px 0',
                          transition: 'background 0.3s',
                        }} />
                      )}
                    </div>

                    {/* Content */}
                    <div style={{ paddingBottom: isLast ? 0 : '1rem', paddingTop: '0.5rem' }}>
                      <div style={{ fontWeight: isCompleted ? 700 : 500, fontSize: '0.95rem', color: isCompleted ? '#2e1a0a' : '#c4a882' }}>
                        {step.label}
                        {isCurrent && (
                          <span style={{ marginLeft: 8, fontSize: '0.72rem', background: `${statusColor}15`, color: statusColor, border: `1px solid ${statusColor}30`, borderRadius: 9999, padding: '0.15rem 0.5rem', fontWeight: 700 }}>
                            Current
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: isCompleted ? '#7a4820' : '#c4a882', marginTop: 2 }}>
                        {step.desc}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* ── Order Items ── */}
        <div style={{ background: '#fdf8f2', border: '1px solid rgba(196,168,130,0.3)', borderRadius: 20, padding: '1.75rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 800, fontSize: '1.1rem', color: '#2e1a0a', marginBottom: '1.25rem' }}>
            🍕 Order Items
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {order.items?.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'rgba(196,168,130,0.08)', borderRadius: 10 }}>
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: 52, height: 52, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }}
                  onError={e => e.target.src = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&q=80'}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: '#2e1a0a', fontSize: '0.875rem' }}>{item.name}</div>
                  {item.customization?.base && (
                    <div style={{ fontSize: '0.7rem', color: '#c4a882' }}>
                      {item.customization.base} · {item.customization.sauce} · {item.customization.cheese}
                    </div>
                  )}
                  <div style={{ fontSize: '0.75rem', color: '#7a4820' }}>Qty: {item.quantity}</div>
                </div>
                <div style={{ fontWeight: 700, color: '#e06020' }}>₹{(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Delivery Address + Payment ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }} className="track-bottom-grid">

          <div style={{ background: '#fdf8f2', border: '1px solid rgba(196,168,130,0.3)', borderRadius: 16, padding: '1.25rem' }}>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: '0.95rem', color: '#2e1a0a', marginBottom: '0.75rem' }}>
              📍 Delivery Address
            </h3>
            <div style={{ fontSize: '0.85rem', color: '#2e1a0a', fontWeight: 600 }}>{order.address?.fullName}</div>
            <div style={{ fontSize: '0.8rem', color: '#7a4820', marginTop: 4, lineHeight: 1.6 }}>
              {order.address?.street}<br />
              {order.address?.city}, {order.address?.state} - {order.address?.pincode}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#7a4820', marginTop: 4 }}>📞 {order.address?.phone}</div>
          </div>

          <div style={{ background: '#fdf8f2', border: '1px solid rgba(196,168,130,0.3)', borderRadius: 16, padding: '1.25rem' }}>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: '0.95rem', color: '#2e1a0a', marginBottom: '0.75rem' }}>
              💳 Payment Info
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#7a4820' }}>Status</span>
                <span style={{ fontWeight: 700, color: '#16a34a' }}>✅ {order.paymentStatus}</span>
              </div>
              {order.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#7a4820' }}>Discount</span>
                  <span style={{ fontWeight: 600, color: '#16a34a' }}>-₹{order.discount}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(196,168,130,0.2)', paddingTop: 8 }}>
                <span style={{ fontWeight: 700, color: '#2e1a0a' }}>Total Paid</span>
                <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, color: '#e06020', fontSize: '1.05rem' }}>₹{order.finalAmount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Refresh note */}
        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#c4a882' }}>
          🔄 Status auto-refreshes every 30 seconds
        </p>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .track-bottom-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

const btnStyle = {
  background: 'linear-gradient(135deg,#b84a14,#e06020)',
  color: '#fff', border: 'none', cursor: 'pointer',
  padding: '0.8rem 2rem', borderRadius: 12,
  fontWeight: 700, fontFamily: "'DM Sans',sans-serif",
}