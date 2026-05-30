import { useEffect }           from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function OrderSuccessPage() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const order     = location.state?.order

  // Redirect if no order data
  useEffect(() => {
    if (!order) navigate('/')
  }, [order])

  if (!order) return null

  return (
    <div style={{
      minHeight: '100vh', background: '#f7f0e8',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center',
      paddingTop: '5rem', paddingBottom: '4rem',
      padding: '6rem 2rem',
    }}>
      <div style={{ maxWidth: 600, width: '100%' }}>

        {/* Success Card */}
        <div style={{
          background: '#fdf8f2',
          border: '1px solid rgba(196,168,130,0.3)',
          borderRadius: 24, padding: '3rem 2.5rem',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(46,26,10,0.1)',
        }}>

          {/* Success icon */}
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'rgba(22,163,74,0.1)',
            border: '2px solid rgba(22,163,74,0.3)',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '2.5rem',
            margin: '0 auto 1.5rem',
          }}>
            ✅
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display',serif",
            fontWeight: 900, fontSize: '2rem',
            color: '#2e1a0a', marginBottom: '0.5rem',
          }}>
            Order Placed! 🔥
          </h1>

          <p style={{
            color: '#7a4820', fontSize: '1rem',
            lineHeight: 1.7, marginBottom: '2rem',
          }}>
            Your order has been confirmed and our kitchen is already fired up!
            You'll receive a confirmation email shortly.
          </p>

          {/* Order details */}
          <div style={{
            background: 'rgba(196,168,130,0.1)',
            border: '1px solid rgba(196,168,130,0.3)',
            borderRadius: 16, padding: '1.25rem',
            marginBottom: '2rem', textAlign: 'left',
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginBottom: '1rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid rgba(196,168,130,0.25)',
            }}>
              <span style={{ fontSize: '0.82rem', color: '#7a4820', fontWeight: 600 }}>
                ORDER ID
              </span>
              <span style={{
                fontFamily: "'DM Mono',monospace",
                fontSize: '0.82rem', color: '#2e1a0a', fontWeight: 700,
                background: 'rgba(224,96,32,0.08)',
                padding: '0.2rem 0.65rem', borderRadius: 6,
              }}>
                #{order._id?.slice(-10).toUpperCase()}
              </span>
            </div>

            {/* Items */}
            <div style={{ marginBottom: '1rem' }}>
              {order.items?.map((item, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', marginBottom: '0.5rem',
                  fontSize: '0.875rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: '#e06020' }}>🍕</span>
                    <span style={{ color: '#2e1a0a', fontWeight: 500 }}>
                      {item.name}
                    </span>
                    <span style={{ color: '#c4a882' }}>
                      x{item.quantity}
                    </span>
                  </div>
                  <span style={{ color: '#7a4820', fontWeight: 600 }}>
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Price breakdown */}
            <div style={{
              borderTop: '1px solid rgba(196,168,130,0.25)',
              paddingTop: '1rem',
              display: 'flex', flexDirection: 'column', gap: 8,
            }}>
              {order.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                  <span style={{ color: '#7a4820' }}>Discount</span>
                  <span style={{ color: '#16a34a', fontWeight: 600 }}>
                    -₹{order.discount}
                  </span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700, color: '#2e1a0a' }}>Total Paid</span>
                <span style={{
                  fontFamily: "'Playfair Display',serif",
                  fontWeight: 900, fontSize: '1.2rem', color: '#e06020',
                }}>
                  ₹{order.finalAmount}
                </span>
              </div>
            </div>
          </div>

          {/* Delivery address */}
          <div style={{
            background: 'rgba(224,96,32,0.05)',
            border: '1px solid rgba(224,96,32,0.15)',
            borderRadius: 14, padding: '1rem',
            marginBottom: '2rem', textAlign: 'left',
          }}>
            <div style={{
              fontSize: '0.78rem', fontWeight: 700,
              color: '#b84a14', marginBottom: '0.5rem',
              textTransform: 'uppercase', letterSpacing: '0.06em',
            }}>
              📍 Delivering To
            </div>
            <div style={{ fontSize: '0.875rem', color: '#2e1a0a', fontWeight: 600 }}>
              {order.address?.fullName}
            </div>
            <div style={{ fontSize: '0.82rem', color: '#7a4820', marginTop: 2 }}>
              {order.address?.street}, {order.address?.city},
              {order.address?.state} - {order.address?.pincode}
            </div>
            <div style={{ fontSize: '0.82rem', color: '#7a4820', marginTop: 2 }}>
              📞 {order.address?.phone}
            </div>
          </div>

          {/* Status tracker */}
          <div style={{
            background: '#fdf8f2',
            border: '1px solid rgba(196,168,130,0.3)',
            borderRadius: 14, padding: '1.25rem',
            marginBottom: '2rem',
          }}>
            <div style={{
              fontSize: '0.78rem', fontWeight: 700,
              color: '#b84a14', marginBottom: '1rem',
              textTransform: 'uppercase', letterSpacing: '0.06em',
              textAlign: 'left',
            }}>
              Order Status
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {[
                { label: 'Received',  icon: '📋' },
                { label: 'Kitchen',   icon: '👨‍🍳' },
                { label: 'Delivery',  icon: '🚴' },
                { label: 'Delivered', icon: '✅' },
              ].map((step, i) => (
                <div key={step.label} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: i === 0
                        ? 'linear-gradient(135deg,#b84a14,#e06020)'
                        : 'rgba(196,168,130,0.2)',
                      border: i === 0
                        ? 'none'
                        : '1px solid rgba(196,168,130,0.3)',
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: '1rem',
                      margin: '0 auto 4px',
                    }}>
                      {step.icon}
                    </div>
                    <div style={{
                      fontSize: '0.65rem',
                      color: i === 0 ? '#e06020' : '#c4a882',
                      fontWeight: i === 0 ? 700 : 400,
                    }}>
                      {step.label}
                    </div>
                  </div>
                  {i < 3 && (
                    <div style={{
                      height: 2, flex: 1,
                      background: 'rgba(196,168,130,0.25)',
                      margin: '0 4px', marginBottom: '1rem',
                    }} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Estimated time */}
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 8,
            background: 'rgba(22,163,74,0.08)',
            border: '1px solid rgba(22,163,74,0.2)',
            borderRadius: 12, padding: '0.85rem',
            marginBottom: '2rem',
          }}>
            <span style={{ fontSize: '1.25rem' }}>⏱️</span>
            <div>
              <div style={{ fontWeight: 700, color: '#16a34a', fontSize: '0.9rem' }}>
                Estimated Delivery: 28-35 minutes
              </div>
              <div style={{ fontSize: '0.75rem', color: '#7a4820' }}>
                Our team is preparing your order right now!
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate(`/order/${order._id}`)}
              style={{
                flex: 1, padding: '0.9rem',
                borderRadius: 12, border: 'none',
                background: 'linear-gradient(135deg,#b84a14,#e06020)',
                color: '#fff', fontWeight: 700,
                fontSize: '0.9rem',
                fontFamily: "'DM Sans',sans-serif",
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(224,96,32,0.3)',
              }}
            >
              Track Order 🚴
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                flex: 1, padding: '0.9rem',
                borderRadius: 12,
                border: '1.5px solid rgba(196,168,130,0.4)',
                background: 'transparent',
                color: '#7a4820', fontWeight: 600,
                fontSize: '0.9rem',
                fontFamily: "'DM Sans',sans-serif",
                cursor: 'pointer',
              }}
            >
              My Dashboard
            </button>
          </div>
        </div>

        {/* Continue shopping */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <button
            onClick={() => navigate('/menu')}
            style={{
              background: 'none', border: 'none',
              color: '#e06020', fontWeight: 600,
              cursor: 'pointer', fontSize: '0.875rem',
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            ← Continue Shopping
          </button>
        </div>
      </div>
    </div>
  )
}