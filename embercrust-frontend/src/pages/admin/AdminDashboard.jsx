import { useState, useEffect } from 'react'
import { useNavigate }         from 'react-router-dom'
import { useAuth }             from '../../context/AuthContext'
import { orderAPI, pizzaAPI }  from '../../services/api'

export default function AdminDashboard() {
  const navigate       = useNavigate()
  const { user, logout } = useAuth()

  const [stats,   setStats]   = useState(null)
  const [orders,  setOrders]  = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [statsRes, ordersRes] = await Promise.all([
        orderAPI.getAdminStats(),
        orderAPI.getAllOrders({ limit: 5 }),
      ])
      setStats(statsRes.data.data)
      setOrders(ordersRes.data.data)
    } catch (err) {
      console.error('Failed to fetch admin data')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const STATUS_COLORS = {
    'Order Received':   '#3b82f6',
    'In Kitchen':       '#f59e0b',
    'Sent to Delivery': '#8b5cf6',
    'Delivered':        '#16a34a',
    'Cancelled':        '#dc2626',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f7f0e8', paddingTop: '5rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 2.5rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: '2rem', color: '#2e1a0a' }}>
              Admin Dashboard ⚙️
            </h1>
            <p style={{ color: '#7a4820', fontSize: '0.875rem', marginTop: 4 }}>
              Welcome, {user?.name} · {user?.email}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => navigate('/admin/pizzas')} style={{ ...adminBtnStyle, background: 'linear-gradient(135deg,#b84a14,#e06020)' }}>
              🍕 Manage Pizzas
            </button>
            <button onClick={() => navigate('/admin/orders')} style={{ ...adminBtnStyle, background: 'linear-gradient(135deg,#5a3418,#7a4820)' }}>
              📦 Manage Orders
            </button>
            <button onClick={handleLogout} style={{ ...adminBtnStyle, background: 'transparent', border: '1.5px solid rgba(196,168,130,0.4)', color: '#7a4820' }}>
              Logout
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', fontSize: '2.5rem' }}>🔥</div>
        ) : (
          <>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '2rem' }} className="admin-stat-grid">
              {[
                { label: 'Total Orders',   value: stats?.totalOrders || 0,   icon: '📦', color: '#e06020' },
                { label: 'Today\'s Orders',value: stats?.todayOrders || 0,   icon: '🔥', color: '#f59e0b' },
                { label: 'Pending Orders', value: stats?.pendingOrders || 0, icon: '⏳', color: '#8b5cf6' },
                { label: 'Total Revenue',  value: `₹${stats?.totalRevenue?.toFixed(0) || 0}`, icon: '💰', color: '#16a34a' },
              ].map(s => (
                <div key={s.label} style={{ background: '#fdf8f2', border: '1px solid rgba(196,168,130,0.3)', borderRadius: 16, padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: `${s.color}15`, border: `1px solid ${s.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.35rem' }}>
                      {s.icon}
                    </div>
                    <div>
                      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.5rem', fontWeight: 900, color: s.color }}>{s.value}</div>
                      <div style={{ fontSize: '0.75rem', color: '#7a4820', fontWeight: 500 }}>{s.label}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Orders by status */}
            {stats?.ordersByStatus?.length > 0 && (
              <div style={{ background: '#fdf8f2', border: '1px solid rgba(196,168,130,0.3)', borderRadius: 20, padding: '1.75rem', marginBottom: '2rem' }}>
                <h2 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 800, fontSize: '1.1rem', color: '#2e1a0a', marginBottom: '1.25rem' }}>
                  Orders by Status
                </h2>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {stats.ordersByStatus.map(s => (
                    <div key={s._id} style={{
                      background: `${STATUS_COLORS[s._id] || '#e06020'}15`,
                      border: `1px solid ${STATUS_COLORS[s._id] || '#e06020'}30`,
                      borderRadius: 12, padding: '0.85rem 1.25rem',
                      textAlign: 'center',
                    }}>
                      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.5rem', fontWeight: 900, color: STATUS_COLORS[s._id] || '#e06020' }}>{s.count}</div>
                      <div style={{ fontSize: '0.75rem', color: '#7a4820', fontWeight: 500 }}>{s._id}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent orders */}
            <div style={{ background: '#fdf8f2', border: '1px solid rgba(196,168,130,0.3)', borderRadius: 20, padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <h2 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 800, fontSize: '1.1rem', color: '#2e1a0a' }}>
                  Recent Orders
                </h2>
                <button
                  onClick={() => navigate('/admin/orders')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e06020', fontWeight: 600, fontSize: '0.82rem', fontFamily: "'DM Sans',sans-serif" }}
                >
                  View All →
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {orders.map(order => {
                  const color = STATUS_COLORS[order.orderStatus] || '#e06020'
                  return (
                    <div
                      key={order._id}
                      onClick={() => navigate('/admin/orders')}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem', background: 'rgba(196,168,130,0.08)', borderRadius: 12, cursor: 'pointer', transition: 'background 0.2s', flexWrap: 'wrap', gap: '0.5rem' }}
                      onMouseOver={e => e.currentTarget.style.background = 'rgba(224,96,32,0.06)'}
                      onMouseOut={e => e.currentTarget.style.background = 'rgba(196,168,130,0.08)'}
                    >
                      <div>
                        <div style={{ fontWeight: 600, color: '#2e1a0a', fontSize: '0.875rem' }}>
                          #{order._id?.slice(-8).toUpperCase()}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#7a4820' }}>
                          {order.user?.name} · {order.items?.length} items
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontWeight: 700, color: '#e06020' }}>₹{order.finalAmount}</span>
                        <span style={{ background: `${color}15`, border: `1px solid ${color}30`, color, borderRadius: 9999, padding: '0.2rem 0.65rem', fontSize: '0.72rem', fontWeight: 700 }}>
                          {order.orderStatus}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) { .admin-stat-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 500px) { .admin-stat-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  )
}

const adminBtnStyle = {
  padding: '0.65rem 1.1rem', borderRadius: 12,
  border: 'none', cursor: 'pointer',
  fontWeight: 700, fontSize: '0.82rem',
  color: '#fff', fontFamily: "'DM Sans',sans-serif",
}