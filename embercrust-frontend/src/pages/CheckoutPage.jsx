import { useState, useEffect } from 'react'
import { useNavigate }         from 'react-router-dom'
import { useAuth }             from '../context/AuthContext'
import { cartAPI, paymentAPI, orderAPI, couponAPI } from '../services/api'

export default function CheckoutPage() {
  const navigate       = useNavigate()
  const { user }       = useAuth()

  const [cart,         setCart]         = useState(null)
  const [loading,      setLoading]      = useState(true)
  const [placing,      setPlacing]      = useState(false)
  const [couponCode,   setCouponCode]   = useState('')
  const [couponData,   setCouponData]   = useState(null)
  const [couponError,  setCouponError]  = useState('')
  const [couponLoading,setCouponLoading]= useState(false)

  const [address, setAddress] = useState({
    fullName: user?.name || '',
    phone:    '',
    street:   '',
    city:     '',
    state:    '',
    pincode:  '',
  })
  const [addressError, setAddressError] = useState('')

  useEffect(() => {
    fetchCart()
    // Load Razorpay script
    const script = document.createElement('script')
    script.src   = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)
    return () => document.body.removeChild(script)
  }, [])

  const fetchCart = async () => {
    try {
      const res = await cartAPI.getCart()
      setCart(res.data.data)
      if (!res.data.data?.items?.length) {
        navigate('/cart')
      }
    } catch {
      navigate('/cart')
    } finally {
      setLoading(false)
    }
  }

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value })
    setAddressError('')
  }

  const validateAddress = () => {
    const { fullName, phone, street, city, state, pincode } = address
    if (!fullName || !phone || !street || !city || !state || !pincode) {
      setAddressError('All address fields are required')
      return false
    }
    if (phone.length < 10) {
      setAddressError('Enter a valid phone number')
      return false
    }
    if (pincode.length < 6) {
      setAddressError('Enter a valid pincode')
      return false
    }
    return true
  }

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return
    try {
      setCouponLoading(true)
      setCouponError('')
      const res = await couponAPI.validate(couponCode, subtotal)
      setCouponData(res.data.data)
    } catch (err) {
      setCouponError(err.response?.data?.message || 'Invalid coupon')
      setCouponData(null)
    } finally {
      setCouponLoading(false)
    }
  }

  const handleRemoveCoupon = () => {
    setCouponData(null)
    setCouponCode('')
    setCouponError('')
  }

  // Price calculations
  const subtotal    = cart?.totalAmount || 0
  const tax         = +(subtotal * 0.05).toFixed(2)
  const discount    = couponData?.discountAmount || 0
  const finalAmount = +(subtotal + tax - discount).toFixed(2)

  const handlePayment = async () => {
    if (!validateAddress()) return

    try {
      setPlacing(true)

      // Step 1 — Create Razorpay order
      const orderRes = await paymentAPI.createOrder(finalAmount)
      const { orderId, amount, currency } = orderRes.data.data

      // Step 2 — Open Razorpay checkout
      const options = {
        key:         import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount,
        currency,
        name:        'EmberCrust 🔥',
        description: 'Wood-fired pizza delivery',
        order_id:    orderId,
        prefill: {
          name:  user?.name,
          email: user?.email,
          contact: address.phone,
        },
        theme: { color: '#e06020' },

        handler: async (response) => {
          try {
            // Step 3 — Verify payment
            const verifyRes = await paymentAPI.verify({
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
            })

            if (verifyRes.data.success) {
              // Step 4 — Create order in DB
              const orderItems = cart.items.map(item => ({
                pizza:         item.pizza._id,
                name:          item.pizza.name,
                image:         item.pizza.image,
                price:         item.price,
                quantity:      item.quantity,
                customization: item.customization,
              }))

              const createRes = await orderAPI.createOrder({
                items:             orderItems,
                address,
                totalAmount:       subtotal,
                discount,
                finalAmount,
                couponCode:        couponData?.code || null,
                razorpayOrderId:   response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              })

              if (createRes.data.success) {
                navigate('/order-success', {
                  state: { order: createRes.data.data }
                })
              }
            }
          } catch (err) {
            console.error('Order creation failed:', err)
            alert('Payment successful but order creation failed. Contact support.')
          }
        },

        modal: {
          ondismiss: () => {
            setPlacing(false)
          }
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()

    } catch (err) {
      console.error('Payment error:', err)
      setPlacing(false)
      alert(err.response?.data?.message || 'Payment failed. Try again.')
    }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#f7f0e8', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '4rem' }}>
      <div style={{ fontSize: '3rem' }}>🔥</div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#f7f0e8', paddingTop: '5rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 2.5rem' }}>

        {/* Header */}
        <h1 style={{
          fontFamily: "'Playfair Display',serif",
          fontWeight: 900, fontSize: '2rem',
          color: '#2e1a0a', marginBottom: '2rem',
        }}>
          Checkout 🧾
        </h1>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 380px',
          gap: '2rem', alignItems: 'start',
        }}
          className="checkout-grid"
        >
          {/* ── LEFT ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Delivery Address */}
            <div style={{
              background: '#fdf8f2',
              border: '1px solid rgba(196,168,130,0.3)',
              borderRadius: 20, padding: '1.75rem',
            }}>
              <h2 style={{
                fontFamily: "'Playfair Display',serif",
                fontWeight: 800, fontSize: '1.2rem',
                color: '#2e1a0a', marginBottom: '1.25rem',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                📍 Delivery Address
              </h2>

              {addressError && (
                <div style={{
                  background: 'rgba(220,38,38,0.08)',
                  border: '1px solid rgba(220,38,38,0.25)',
                  borderRadius: 10, padding: '0.75rem',
                  color: '#dc2626', fontSize: '0.85rem',
                  marginBottom: '1rem',
                }}>
                  {addressError}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {[
                  { name: 'fullName', label: 'Full Name',    placeholder: 'John Doe',        col: 1 },
                  { name: 'phone',    label: 'Phone Number', placeholder: '10-digit number', col: 1 },
                  { name: 'street',   label: 'Street Address',placeholder: 'House no, Street, Area', col: 2 },
                  { name: 'city',     label: 'City',         placeholder: 'Mumbai',          col: 1 },
                  { name: 'state',    label: 'State',        placeholder: 'Maharashtra',     col: 1 },
                  { name: 'pincode',  label: 'Pincode',      placeholder: '400001',          col: 1 },
                ].map(field => (
                  <div
                    key={field.name}
                    style={{ gridColumn: field.col === 2 ? '1 / -1' : 'auto' }}
                  >
                    <label style={{
                      display: 'block', fontSize: '0.78rem',
                      fontWeight: 600, color: '#5a3418', marginBottom: 5,
                    }}>
                      {field.label}
                    </label>
                    <input
                      type="text"
                      name={field.name}
                      placeholder={field.placeholder}
                      value={address[field.name]}
                      onChange={handleAddressChange}
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = '#e06020'}
                      onBlur={e => e.target.style.borderColor = 'rgba(196,168,130,0.4)'}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Coupon */}
            <div style={{
              background: '#fdf8f2',
              border: '1px solid rgba(196,168,130,0.3)',
              borderRadius: 20, padding: '1.75rem',
            }}>
              <h2 style={{
                fontFamily: "'Playfair Display',serif",
                fontWeight: 800, fontSize: '1.2rem',
                color: '#2e1a0a', marginBottom: '1.25rem',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                🎟️ Apply Coupon
              </h2>

              {couponData ? (
                /* Applied coupon */
                <div style={{
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'rgba(22,163,74,0.08)',
                  border: '1px solid rgba(22,163,74,0.25)',
                  borderRadius: 12, padding: '0.85rem 1rem',
                }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#16a34a', fontSize: '0.9rem' }}>
                      ✅ {couponData.code} Applied!
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#16a34a', marginTop: 2 }}>
                      {couponData.description} — You save ₹{couponData.discountAmount}
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    style={{
                      background: 'none', border: 'none',
                      color: '#dc2626', cursor: 'pointer',
                      fontSize: '0.82rem', fontWeight: 600,
                    }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                /* Coupon input */
                <div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <input
                      type="text"
                      placeholder="Enter coupon code (e.g. EMBER30)"
                      value={couponCode}
                      onChange={e => { setCouponCode(e.target.value.toUpperCase()); setCouponError('') }}
                      style={{ ...inputStyle, flex: 1 }}
                      onFocus={e => e.target.style.borderColor = '#e06020'}
                      onBlur={e => e.target.style.borderColor = 'rgba(196,168,130,0.4)'}
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={couponLoading || !couponCode.trim()}
                      style={{
                        padding: '0 1.25rem', borderRadius: 10,
                        background: couponLoading || !couponCode.trim()
                          ? '#c4a882'
                          : 'linear-gradient(135deg,#b84a14,#e06020)',
                        color: '#fff', border: 'none',
                        cursor: couponLoading || !couponCode.trim() ? 'not-allowed' : 'pointer',
                        fontWeight: 700, fontSize: '0.875rem',
                        fontFamily: "'DM Sans',sans-serif",
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {couponLoading ? '...' : 'Apply'}
                    </button>
                  </div>
                  {couponError && (
                    <p style={{ color: '#dc2626', fontSize: '0.78rem', marginTop: 6 }}>
                      {couponError}
                    </p>
                  )}
                  <p style={{ color: '#c4a882', fontSize: '0.75rem', marginTop: 8 }}>
                    Try: EMBER30 · EMBER10 · WELCOME50
                  </p>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div style={{
              background: '#fdf8f2',
              border: '1px solid rgba(196,168,130,0.3)',
              borderRadius: 20, padding: '1.75rem',
            }}>
              <h2 style={{
                fontFamily: "'Playfair Display',serif",
                fontWeight: 800, fontSize: '1.2rem',
                color: '#2e1a0a', marginBottom: '1.25rem',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                🍕 Order Items
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {cart?.items?.map(item => (
                  <div key={item._id} style={{
                    display: 'flex', alignItems: 'center',
                    gap: '0.75rem', padding: '0.75rem',
                    background: 'rgba(196,168,130,0.08)',
                    borderRadius: 10,
                  }}>
                    <img
                      src={item.pizza?.image}
                      alt={item.pizza?.name}
                      style={{ width: 52, height: 52, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }}
                      onError={e => e.target.src = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&q=80'}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: '#2e1a0a', fontSize: '0.875rem' }}>
                        {item.pizza?.name}
                      </div>
                      {item.customization?.base && (
                        <div style={{ fontSize: '0.7rem', color: '#c4a882' }}>
                          {item.customization.base} · {item.customization.sauce} · {item.customization.cheese}
                        </div>
                      )}
                      <div style={{ fontSize: '0.75rem', color: '#7a4820' }}>
                        Qty: {item.quantity}
                      </div>
                    </div>
                    <div style={{ fontWeight: 700, color: '#e06020', fontSize: '0.95rem' }}>
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT — Summary ── */}
          <div style={{
            background: '#fdf8f2',
            border: '1px solid rgba(196,168,130,0.3)',
            borderRadius: 20, padding: '1.75rem',
            position: 'sticky', top: 80,
          }}>
            <h2 style={{
              fontFamily: "'Playfair Display',serif",
              fontWeight: 800, fontSize: '1.2rem',
              color: '#2e1a0a', marginBottom: '1.25rem',
            }}>
              Price Summary
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <SummaryRow label="Subtotal" value={`₹${subtotal.toFixed(2)}`} />
              <SummaryRow label="Tax (5%)" value={`₹${tax.toFixed(2)}`} />
              <SummaryRow label="Delivery" value="FREE 🎉" valueColor="#16a34a" />
              {discount > 0 && (
                <SummaryRow label={`Coupon (${couponData?.code})`} value={`-₹${discount}`} valueColor="#16a34a" />
              )}
              <div style={{ height: 1, background: 'rgba(196,168,130,0.3)', margin: '4px 0' }} />
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                fontWeight: 700,
              }}>
                <span style={{ color: '#2e1a0a', fontSize: '1rem' }}>Total</span>
                <span style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: '1.3rem', fontWeight: 900, color: '#e06020',
                }}>
                  ₹{finalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Delivery info */}
            <div style={{
              marginTop: '1.25rem',
              background: 'rgba(224,96,32,0.06)',
              border: '1px solid rgba(224,96,32,0.15)',
              borderRadius: 12, padding: '0.85rem',
              fontSize: '0.8rem', color: '#7a4820',
            }}>
              🚴 Estimated delivery: <strong>28-35 minutes</strong><br />
              📍 Delivering to: <strong>{address.city || 'your address'}</strong>
            </div>

            {/* Pay button */}
            <button
              onClick={handlePayment}
              disabled={placing}
              style={{
                width: '100%', padding: '1rem',
                borderRadius: 14, border: 'none',
                background: placing
                  ? '#c4a882'
                  : 'linear-gradient(135deg,#b84a14,#e06020)',
                color: '#fff', fontWeight: 700,
                fontSize: '1rem',
                fontFamily: "'DM Sans',sans-serif",
                cursor: placing ? 'not-allowed' : 'pointer',
                boxShadow: placing ? 'none' : '0 6px 24px rgba(224,96,32,0.35)',
                marginTop: '1.25rem',
                transition: 'all 0.3s',
              }}
            >
              {placing ? 'Processing...' : `Pay ₹${finalAmount.toFixed(2)} →`}
            </button>

            {/* Secure badge */}
            <p style={{
              textAlign: 'center', fontSize: '0.75rem',
              color: '#c4a882', marginTop: '0.85rem',
            }}>
              🔒 Secured by Razorpay · SSL Encrypted
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .checkout-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

function SummaryRow({ label, value, valueColor }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
      <span style={{ color: '#7a4820' }}>{label}</span>
      <span style={{ fontWeight: 600, color: valueColor || '#2e1a0a' }}>{value}</span>
    </div>
  )
}

const inputStyle = {
  width: '100%', padding: '0.72rem 1rem',
  borderRadius: 10,
  border: '1.5px solid rgba(196,168,130,0.4)',
  background: 'rgba(255,255,255,0.8)',
  fontSize: '0.875rem', color: '#2e1a0a',
  fontFamily: "'DM Sans',sans-serif",
  outline: 'none', transition: 'border-color 0.25s',
  boxShadow: '0 2px 8px rgba(46,26,10,0.05)',
}