import { useState, useEffect } from 'react'
import { useNavigate }         from 'react-router-dom'
import { useAuth }             from '../../context/AuthContext'
import { orderAPI, pizzaAPI }  from '../../services/api'

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

export default function UserDashboard() {
  const navigate        = useNavigate()
  const { user, logout } = useAuth()

  const [pizzas,       setPizzas]       = useState([])
  const [orders,       setOrders]       = useState([])
  const [loadingPizzas, setLoadingPizzas] = useState(true)
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [activeTab,    setActiveTab]    = useState('pizzas')

  useEffect(() => {
    fetchPizzas()
    fetchOrders()
  }, [])

  const fetchPizzas = async () => {
    try {
      const res = await pizzaAPI.getAll()
      setPizzas(res.data.data)
    } catch (err) {
      console.error('Failed to fetch pizzas')
    } finally {
      setLoadingPizzas(false)
    }
  }

  const fetchOrders = async () => {
    try {
      const res = await orderAPI.getMyOrders()
      setOrders(res.data.data)
    } catch (err) {
      console.error('Failed to fetch orders')
    } finally {
      setLoadingOrders(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f7f0e8', paddingTop: '5rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 2.5rem' }}>

        {/* ── Header ── */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem',
        }}>
          <div>
            <h1 style={{
              fontFamily: "'Playfair Display',serif",
              fontWeight: 900, fontSize: '2rem', color: '#2e1a0a',
            }}>
              Welcome back, {user?.name?.split(' ')[0]}! 🔥
            </h1>
            <p style={{ color: '#7a4820', fontSize: '0.9rem', marginTop: 4 }}>
              {user?.email}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
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
              Order Now 🔥
            </button>
            <button
              onClick={handleLogout}
              style={{
                padding: '0.65rem 1.25rem', borderRadius: 12,
                background: 'transparent',
                border: '1.5px solid rgba(196,168,130,0.4)',
                color: '#7a4820', cursor: 'pointer',
                fontWeight: 600, fontSize: '0.875rem',
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* ── Stats Cards ── */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
          gap: '1rem', marginBottom: '2rem',
        }}
          className="stat-grid"
        >
          {[
            { label: 'Total Orders',    value: orders.length,                                          icon: '📦', color: '#e06020' },
            { label: 'Delivered',       value: orders.filter(o => o.orderStatus === 'Delivered').length, icon: '✅', color: '#16a34a' },
            { label: 'Active Orders',   value: orders.filter(o => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled').length, icon: '🔥', color: '#f59e0b' },
          ].map(s => (
            <div key={s.label} style={{
              background: '#fdf8f2',
              border: '1px solid rgba(196,168,130,0.3)',
              borderRadius: 16, padding: '1.25rem',
              display: 'flex', alignItems: 'center', gap: '1rem',
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: `${s.color}15`,
                border: `1px solid ${s.color}30`,
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '1.5rem',
              }}>
                {s.icon}
              </div>
              <div>
                <div style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: '1.75rem', fontWeight: 900, color: s.color,
                }}>
                  {s.value}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#7a4820', fontWeight: 500 }}>
                  {s.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div style={{
          display: 'flex', gap: 4, marginBottom: '1.5rem',
          background: 'rgba(196,168,130,0.15)',
          borderRadius: 12, padding: 4,
          width: 'fit-content',
        }}>
          {[
            { id: 'pizzas', label: '🍕 Available Pizzas' },
            { id: 'orders', label: '📦 My Orders' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.6rem 1.25rem', borderRadius: 10,
                border: 'none', cursor: 'pointer',
                fontWeight: 600, fontSize: '0.875rem',
                fontFamily: "'DM Sans',sans-serif",
                transition: 'all 0.25s',
                background: activeTab === tab.id
                  ? 'linear-gradient(135deg,#b84a14,#e06020)'
                  : 'transparent',
                color: activeTab === tab.id ? '#fff' : '#7a4820',
                boxShadow: activeTab === tab.id
                  ? '0 4px 12px rgba(224,96,32,0.3)'
                  : 'none',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── PIZZAS TAB ── */}
        {activeTab === 'pizzas' && (
          <div>
            <p style={{ color: '#7a4820', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Click any pizza to customize and order 🔥
            </p>

            {loadingPizzas ? (
              <div style={{ textAlign: 'center', padding: '3rem', fontSize: '2rem' }}>🔥</div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4,1fr)',
                gap: '1rem',
              }}
                className="pizza-dash-grid"
              >
                {pizzas.map(pizza => (
                  <div
                    key={pizza._id}
                    onClick={() => navigate(`/pizza/${pizza._id}`)}
                    style={{
                      background: '#fdf8f2',
                      border: '1px solid rgba(196,168,130,0.28)',
                      borderRadius: 16, overflow: 'hidden',
                      cursor: 'pointer', transition: 'all 0.3s',
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.transform = 'translateY(-5px)'
                      e.currentTarget.style.boxShadow = '0 16px 40px rgba(46,26,10,0.12)'
                      e.currentTarget.style.borderColor = 'rgba(224,96,32,0.28)'
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.transform = 'none'
                      e.currentTarget.style.boxShadow = 'none'
                      e.currentTarget.style.borderColor = 'rgba(196,168,130,0.28)'
                    }}
                  >
                    {/* Image */}
                    <div style={{ position: 'relative', height: 140, overflow: 'hidden' }}>
                      <img
                        src={pizza.image}
                        alt={pizza.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={e => e.target.src = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80'}
                      />
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(to top,rgba(46,26,10,0.4) 0%,transparent 50%)',
                      }} />
                      {/* Veg indicator */}
                      <div style={{
                        position: 'absolute', top: 8, left: 8,
                        width: 18, height: 18, borderRadius: 3,
                        border: `2px solid ${pizza.isVeg ? '#16a34a' : '#dc2626'}`,
                        background: 'rgba(253,248,242,0.95)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <div style={{
                          width: 8, height: 8, borderRadius: '50%',
                          background: pizza.isVeg ? '#16a34a' : '#dc2626',
                        }} />
                      </div>
                      {/* Price */}
                      <span style={{
                        position: 'absolute', bottom: 8, right: 8,
                        fontFamily: "'Playfair Display',serif",
                        fontSize: '1.1rem', fontWeight: 900,
                        color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                      }}>
                        ${pizza.price}
                      </span>
                    </div>

                    {/* Info */}
                    <div style={{ padding: '0.85rem' }}>
                      <h3 style={{
                        fontFamily: "'Playfair Display',serif",
                        fontWeight: 700, fontSize: '0.9rem',
                        color: '#2e1a0a', marginBottom: 4,
                      }}>
                        {pizza.name}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.75rem', color: '#e06020', fontWeight: 600 }}>
                          ★ {pizza.rating}
                        </span>
                        <span style={{
                          fontSize: '0.68rem', color: '#b84a14',
                          background: 'rgba(224,96,32,0.08)',
                          border: '1px solid rgba(224,96,32,0.2)',
                          borderRadius: 9999, padding: '0.15rem 0.5rem',
                          fontWeight: 600,
                        }}>
                          {pizza.category}
                        </span>
                      </div>
                      {/* Availability */}
                      <div style={{
                        marginTop: 8, fontSize: '0.72rem',
                        color: pizza.isAvailable ? '#16a34a' : '#dc2626',
                        fontWeight: 600,
                      }}>
                        {pizza.isAvailable ? '● Available' : '● Unavailable'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── ORDERS TAB ── */}
        {activeTab === 'orders' && (
          <div>
            {loadingOrders ? (
              <div style={{ textAlign: 'center', padding: '3rem', fontSize: '2rem' }}>🔥</div>
            ) : orders.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '4rem',
                background: '#fdf8f2',
                border: '1px solid rgba(196,168,130,0.3)',
                borderRadius: 20,
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
                <h3 style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: '1.25rem', color: '#2e1a0a', marginBottom: '0.5rem',
                }}>
                  No orders yet
                </h3>
                <p style={{ color: '#7a4820', marginBottom: '1.5rem' }}>
                  Order your first pizza now!
                </p>
                <button
                  onClick={() => navigate('/menu')}
                  style={{
                    background: 'linear-gradient(135deg,#b84a14,#e06020)',
                    color: '#fff', border: 'none', borderRadius: 12,
                    padding: '0.8rem 2rem', fontWeight: 700,
                    cursor: 'pointer', fontFamily: "'DM Sans',sans-serif",
                  }}
                >
                  Browse Menu →
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {orders.map(order => {
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
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
                      }}
                      onMouseOver={e => {
                        e.currentTarget.style.borderColor = 'rgba(224,96,32,0.28)'
                        e.currentTarget.style.boxShadow = '0 8px 30px rgba(46,26,10,0.1)'
                      }}
                      onMouseOut={e => {
                        e.currentTarget.style.borderColor = 'rgba(196,168,130,0.3)'
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                    >
                      {/* Left */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                          width: 48, height: 48, borderRadius: 12,
                          background: statusStyle.bg,
                          border: `1px solid ${statusStyle.border}`,
                          display: 'flex', alignItems: 'center',
                          justifyContent: 'center', fontSize: '1.5rem',
                        }}>
                          {STATUS_ICONS[order.orderStatus]}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: '#2e1a0a', fontSize: '0.9rem' }}>
                            Order #{order._id.slice(-8).toUpperCase()}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#c4a882', marginTop: 2 }}>
                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric', month: 'short', year: 'numeric',
                            })}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#7a4820', marginTop: 2 }}>
                            {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>

                      {/* Right */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{
                            fontFamily: "'Playfair Display',serif",
                            fontWeight: 900, fontSize: '1.1rem', color: '#e06020',
                          }}>
                            ₹{order.finalAmount}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#c4a882' }}>
                            {order.paymentStatus}
                          </div>
                        </div>

                        {/* Status badge */}
                        <div style={{
                          background: statusStyle.bg,
                          border: `1px solid ${statusStyle.border}`,
                          color: statusStyle.color,
                          borderRadius: 9999, padding: '0.35rem 0.85rem',
                          fontSize: '0.78rem', fontWeight: 700,
                          whiteSpace: 'nowrap',
                        }}>
                          {order.orderStatus}
                        </div>

                        <span style={{ color: '#c4a882', fontSize: '1rem' }}>→</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .stat-grid { grid-template-columns: 1fr !important; }
          .pizza-dash-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 500px) {
          .pizza-dash-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}