import { useState, useEffect }   from 'react'
import { useNavigate }           from 'react-router-dom'
import { cartAPI }               from '../services/api'
import { useAuth }               from '../context/AuthContext'
import { useCartContext }         from '../context/CartContext'

export default function CartPage() {
  const navigate          = useNavigate()
  const { isLoggedIn }    = useAuth()
  const { addToast }      = useCartContext()

  const [cart,    setCart]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      setLoading(true)
      const res = await cartAPI.getCart()
      setCart(res.data.data)
    } catch {
      addToast('Failed to load cart', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateQty = async (itemId, qty) => {
    try {
      setUpdating(itemId)
      const res = await cartAPI.updateItem({ itemId, quantity: qty })
      setCart(res.data.data)
    } catch {
      addToast('Failed to update', 'error')
    } finally {
      setUpdating(null)
    }
  }

  const handleRemove = async (itemId) => {
    try {
      setUpdating(itemId)
      const res = await cartAPI.removeItem(itemId)
      setCart(res.data.data)
      addToast('Item removed', 'success')
    } catch {
      addToast('Failed to remove', 'error')
    } finally {
      setUpdating(null)
    }
  }

  const handleClear = async () => {
    try {
      await cartAPI.clearCart()
      setCart({ items: [], totalAmount: 0 })
      addToast('Cart cleared', 'success')
    } catch {
      addToast('Failed to clear cart', 'error')
    }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#f7f0e8', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '4rem' }}>
      <div style={{ fontSize: '3rem' }}>🔥</div>
    </div>
  )

  const isEmpty = !cart?.items?.length

  return (
    <div style={{ minHeight: '100vh', background: '#f7f0e8', paddingTop: '5rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '2rem 2.5rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: '2rem', color: '#2e1a0a' }}>
            Your Cart 🛒
          </h1>
          {!isEmpty && (
            <button
              onClick={handleClear}
              style={{ background: 'none', border: '1px solid rgba(220,38,38,0.3)', color: '#dc2626', borderRadius: 10, padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, fontFamily: "'DM Sans',sans-serif" }}
            >
              Clear Cart
            </button>
          )}
        </div>

        {isEmpty ? (
          /* Empty state */
          <div style={{ textAlign: 'center', padding: '5rem 2rem', background: '#fdf8f2', borderRadius: 20, border: '1px solid rgba(196,168,130,0.3)' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.5rem', color: '#2e1a0a', marginBottom: '0.75rem' }}>
              Your cart is empty
            </h2>
            <p style={{ color: '#7a4820', marginBottom: '1.75rem' }}>
              Add some delicious pizzas to get started!
            </p>
            <button
              onClick={() => navigate('/menu')}
              style={{ background: 'linear-gradient(135deg,#b84a14,#e06020)', color: '#fff', border: 'none', borderRadius: 12, padding: '0.85rem 2rem', fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: '0.95rem' }}
            >
              Browse Menu →
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }} className="cart-grid">

            {/* Cart Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {cart.items.map(item => (
                <div
                  key={item._id}
                  style={{ background: '#fdf8f2', border: '1px solid rgba(196,168,130,0.3)', borderRadius: 16, padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start', opacity: updating === item._id ? 0.6 : 1, transition: 'opacity 0.2s' }}
                >
                  {/* Image */}
                  <img
                    src={item.pizza?.image}
                    alt={item.pizza?.name}
                    style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 12, flexShrink: 0 }}
                    onError={e => e.target.src = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&q=80'}
                  />

                  {/* Details */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h3 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: '1rem', color: '#2e1a0a', marginBottom: 4 }}>
                          {item.pizza?.name}
                        </h3>
                        {/* Customization details */}
                        {item.customization && (
                          <div style={{ fontSize: '0.72rem', color: '#c4a882', marginBottom: 6 }}>
                            {item.customization.base && <span>Base: {item.customization.base} · </span>}
                            {item.customization.sauce && <span>Sauce: {item.customization.sauce} · </span>}
                            {item.customization.cheese && <span>Cheese: {item.customization.cheese}</span>}
                            {item.customization.veggies?.length > 0 && (
                              <div>Veggies: {item.customization.veggies.join(', ')}</div>
                            )}
                          </div>
                        )}
                        <div style={{ fontWeight: 700, color: '#e06020', fontSize: '1rem' }}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => handleRemove(item._id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: '1.1rem', padding: 4 }}
                      >
                        🗑️
                      </button>
                    </div>

                    {/* Qty controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10 }}>
                      <button onClick={() => handleUpdateQty(item._id, item.quantity - 1)} style={qtyBtnStyle}>−</button>
                      <span style={{ fontWeight: 700, color: '#2e1a0a', minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>
                      <button onClick={() => handleUpdateQty(item._id, item.quantity + 1)} style={qtyBtnStyle}>+</button>
                      <span style={{ fontSize: '0.75rem', color: '#c4a882', marginLeft: 4 }}>
                        ${item.price}/each
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div style={{ background: '#fdf8f2', border: '1px solid rgba(196,168,130,0.3)', borderRadius: 20, padding: '1.5rem', position: 'sticky', top: 80 }}>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 800, fontSize: '1.2rem', color: '#2e1a0a', marginBottom: '1.25rem' }}>
                Order Summary
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#7a4820' }}>
                  <span>Subtotal ({cart.items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span>${cart.totalAmount?.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#7a4820' }}>
                  <span>Delivery Fee</span>
                  <span style={{ color: '#16a34a' }}>FREE</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#7a4820' }}>
                  <span>Taxes</span>
                  <span>${(cart.totalAmount * 0.05).toFixed(2)}</span>
                </div>
                <div style={{ height: 1, background: 'rgba(196,168,130,0.3)', margin: '4px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#2e1a0a' }}>
                  <span>Total</span>
                  <span style={{ color: '#e06020', fontSize: '1.15rem' }}>
                    ${(cart.totalAmount * 1.05).toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                style={{ width: '100%', padding: '0.9rem', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#b84a14,#e06020)', color: '#fff', fontWeight: 700, fontSize: '1rem', fontFamily: "'DM Sans',sans-serif", cursor: 'pointer', boxShadow: '0 4px 16px rgba(224,96,32,0.3)', marginBottom: '0.75rem' }}
              >
                Proceed to Checkout →
              </button>

              <button
                onClick={() => navigate('/menu')}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 12, border: '1.5px solid rgba(196,168,130,0.4)', background: 'transparent', color: '#7a4820', fontWeight: 600, fontSize: '0.9rem', fontFamily: "'DM Sans',sans-serif", cursor: 'pointer' }}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .cart-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

const qtyBtnStyle = {
  width: 30, height: 30, borderRadius: 8,
  border: '1.5px solid rgba(196,168,130,0.4)',
  background: 'rgba(255,255,255,0.8)',
  cursor: 'pointer', fontSize: '1rem',
  color: '#2e1a0a', fontWeight: 700,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
}