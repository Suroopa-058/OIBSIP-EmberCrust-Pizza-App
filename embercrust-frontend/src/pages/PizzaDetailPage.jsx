import { useState, useEffect }     from 'react'
import { useParams, useNavigate }  from 'react-router-dom'
import { pizzaAPI }                from '../services/api'
import { useCartContext }           from '../context/CartContext'

const CUSTOMIZATION_OPTIONS = {
  bases: [
    { id: 'thin',       label: 'Thin Crust',       price: 0  },
    { id: 'thick',      label: 'Thick Crust',       price: 0  },
    { id: 'cheese',     label: 'Cheese Burst',      price: 2  },
    { id: 'wholegrain', label: 'Whole Grain',        price: 1  },
    { id: 'glutenfree', label: 'Gluten Free',        price: 3  },
  ],
  sauces: [
    { id: 'tomato',     label: 'Classic Tomato',    price: 0  },
    { id: 'pesto',      label: 'Basil Pesto',        price: 1  },
    { id: 'bbq',        label: 'BBQ Sauce',          price: 1  },
    { id: 'white',      label: 'White Garlic',       price: 1  },
    { id: 'spicy',      label: 'Spicy Arrabbiata',  price: 0  },
  ],
  cheeses: [
    { id: 'mozzarella', label: 'Mozzarella',         price: 0  },
    { id: 'cheddar',    label: 'Cheddar',             price: 1  },
    { id: 'parmesan',   label: 'Parmesan',            price: 1  },
    { id: 'vegan',      label: 'Vegan Cheese',        price: 2  },
    { id: 'burrata',    label: 'Burrata',             price: 3  },
  ],
  veggies: [
    { id: 'mushroom',   label: '🍄 Mushrooms',       price: 0.5 },
    { id: 'olive',      label: '🫒 Black Olives',    price: 0.5 },
    { id: 'capsicum',   label: '🫑 Capsicum',        price: 0.5 },
    { id: 'onion',      label: '🧅 Red Onion',       price: 0   },
    { id: 'tomato',     label: '🍅 Cherry Tomato',   price: 0.5 },
    { id: 'spinach',    label: '🥬 Spinach',         price: 0.5 },
    { id: 'jalapeno',   label: '🌶️ Jalapeños',       price: 0.5 },
    { id: 'sweetcorn',  label: '🌽 Sweet Corn',      price: 0.5 },
  ],
}

export default function PizzaDetailPage() {
  const { id }         = useParams()
  const navigate       = useNavigate()
  const { addToCart }  = useCartContext()

  const [pizza,   setPizza]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')
  const [added,   setAdded]   = useState(false)
  const [qty,     setQty]     = useState(1)

  const [customization, setCustomization] = useState({
    base:    'thin',
    sauce:   'tomato',
    cheese:  'mozzarella',
    veggies: [],
  })

  useEffect(() => {
    const fetchPizza = async () => {
      try {
        setLoading(true)
        const res = await pizzaAPI.getById(id)
        setPizza(res.data.data)
      } catch {
        setError('Pizza not found')
      } finally {
        setLoading(false)
      }
    }
    fetchPizza()
  }, [id])

  // Calculate extra price from customization
  const extraPrice = () => {
    let extra = 0
    const base   = CUSTOMIZATION_OPTIONS.bases.find(b => b.id === customization.base)
    const sauce  = CUSTOMIZATION_OPTIONS.sauces.find(s => s.id === customization.sauce)
    const cheese = CUSTOMIZATION_OPTIONS.cheeses.find(c => c.id === customization.cheese)
    if (base)   extra += base.price
    if (sauce)  extra += sauce.price
    if (cheese) extra += cheese.price
    customization.veggies.forEach(v => {
      const veg = CUSTOMIZATION_OPTIONS.veggies.find(vg => vg.id === v)
      if (veg) extra += veg.price
    })
    return extra
  }

  const totalPrice = pizza ? (pizza.price + extraPrice()) * qty : 0

  const toggleVeggie = (vegId) => {
    setCustomization(prev => ({
      ...prev,
      veggies: prev.veggies.includes(vegId)
        ? prev.veggies.filter(v => v !== vegId)
        : [...prev.veggies, vegId],
    }))
  }

  const handleAddToCart = () => {
    addToCart({
      ...pizza,
      price:         pizza.price + extraPrice(),
      customization,
      qty,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2400)
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#f7f0e8', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '4rem' }}>
      <div style={{ fontSize: '3rem', animation: 'spin 1s linear infinite' }}>🔥</div>
    </div>
  )

  if (error || !pizza) return (
    <div style={{ minHeight: '100vh', background: '#f7f0e8', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '4rem', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ fontSize: '3rem' }}>😕</div>
      <h2 style={{ fontFamily: "'Playfair Display',serif", color: '#2e1a0a' }}>Pizza not found</h2>
      <button onClick={() => navigate('/menu')} style={{ ...btnStyle }}>← Back to Menu</button>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#f7f0e8', paddingTop: '5rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 2.5rem' }}>

        {/* Back */}
        <button
          onClick={() => navigate('/menu')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7a4820', fontSize: '0.875rem', fontWeight: 600, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: 6, fontFamily: "'DM Sans',sans-serif" }}
        >
          ← Back to Menu
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }} className="detail-grid">

          {/* LEFT — Image */}
          <div>
            <div style={{ borderRadius: 24, overflow: 'hidden', boxShadow: '0 20px 60px rgba(46,26,10,0.15)' }}>
              <img
                src={pizza.image}
                alt={pizza.name}
                style={{ width: '100%', height: 380, objectFit: 'cover', display: 'block' }}
                onError={e => e.target.src = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80&auto=format'}
              />
            </div>

            {/* Pizza info */}
            <div style={{ marginTop: '1.5rem', background: '#fdf8f2', border: '1px solid rgba(196,168,130,0.3)', borderRadius: 16, padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {/* Veg dot */}
                  <div style={{ width: 22, height: 22, borderRadius: 4, border: `2px solid ${pizza.isVeg ? '#16a34a' : '#dc2626'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: pizza.isVeg ? '#16a34a' : '#dc2626' }} />
                  </div>
                  <span style={{ fontSize: '0.82rem', color: pizza.isVeg ? '#16a34a' : '#dc2626', fontWeight: 600 }}>
                    {pizza.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
                  </span>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#b84a14', background: 'rgba(224,96,32,0.1)', border: '1px solid rgba(224,96,32,0.2)', borderRadius: 9999, padding: '0.2rem 0.65rem', fontWeight: 700 }}>
                  {pizza.tag}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.65rem', color: '#c4a882', marginBottom: 2 }}>RATING</div>
                  <div style={{ fontWeight: 700, color: '#e06020' }}>★ {pizza.rating}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.65rem', color: '#c4a882', marginBottom: 2 }}>REVIEWS</div>
                  <div style={{ fontWeight: 700, color: '#2e1a0a' }}>{pizza.ratingCount?.toLocaleString()}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.65rem', color: '#c4a882', marginBottom: 2 }}>DELIVERY</div>
                  <div style={{ fontWeight: 700, color: '#2e1a0a' }}>{pizza.deliveryTime} min</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — Customization */}
          <div>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: '2.25rem', color: '#2e1a0a', marginBottom: '0.5rem' }}>
              {pizza.name}
            </h1>
            <p style={{ color: '#7a4820', lineHeight: 1.75, marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              {pizza.description}
            </p>

            {/* ── BASE ── */}
            <CustomSection title="Choose Base">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {CUSTOMIZATION_OPTIONS.bases.map(b => (
                  <OptionBtn
                    key={b.id}
                    label={b.label}
                    price={b.price}
                    selected={customization.base === b.id}
                    onClick={() => setCustomization(p => ({ ...p, base: b.id }))}
                  />
                ))}
              </div>
            </CustomSection>

            {/* ── SAUCE ── */}
            <CustomSection title="Choose Sauce">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {CUSTOMIZATION_OPTIONS.sauces.map(s => (
                  <OptionBtn
                    key={s.id}
                    label={s.label}
                    price={s.price}
                    selected={customization.sauce === s.id}
                    onClick={() => setCustomization(p => ({ ...p, sauce: s.id }))}
                  />
                ))}
              </div>
            </CustomSection>

            {/* ── CHEESE ── */}
            <CustomSection title="Choose Cheese">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {CUSTOMIZATION_OPTIONS.cheeses.map(c => (
                  <OptionBtn
                    key={c.id}
                    label={c.label}
                    price={c.price}
                    selected={customization.cheese === c.id}
                    onClick={() => setCustomization(p => ({ ...p, cheese: c.id }))}
                  />
                ))}
              </div>
            </CustomSection>

            {/* ── VEGGIES ── */}
            <CustomSection title="Add Veggies (Multiple)">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {CUSTOMIZATION_OPTIONS.veggies.map(v => (
                  <OptionBtn
                    key={v.id}
                    label={v.label}
                    price={v.price}
                    selected={customization.veggies.includes(v.id)}
                    onClick={() => toggleVeggie(v.id)}
                    multi
                  />
                ))}
              </div>
            </CustomSection>

            {/* ── QTY + PRICE ── */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', background: '#fdf8f2', border: '1px solid rgba(196,168,130,0.3)', borderRadius: 14, padding: '1rem 1.25rem' }}>
              {/* Qty */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={qtyBtnStyle}>−</button>
                <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#2e1a0a', minWidth: 24, textAlign: 'center' }}>{qty}</span>
                <button onClick={() => setQty(q => q + 1)} style={qtyBtnStyle}>+</button>
              </div>

              {/* Total */}
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.7rem', color: '#c4a882', marginBottom: 2 }}>TOTAL PRICE</div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.75rem', fontWeight: 900, color: '#e06020' }}>
                  ${totalPrice.toFixed(2)}
                </div>
              </div>
            </div>

            {/* ── ADD TO CART ── */}
            <button
              onClick={handleAddToCart}
              style={{
                width: '100%', padding: '1rem',
                borderRadius: 14, border: added ? '1px solid rgba(22,163,74,0.3)' : 'none',
                fontWeight: 700, fontSize: '1rem',
                fontFamily: "'DM Sans',sans-serif",
                cursor: 'pointer', transition: 'all 0.3s',
                background: added ? 'rgba(22,163,74,0.1)' : 'linear-gradient(135deg,#b84a14,#e06020)',
                color: added ? '#16a34a' : '#fff',
                boxShadow: added ? 'none' : '0 6px 24px rgba(224,96,32,0.35)',
              }}
            >
              {added ? '✓ Added to Cart!' : `Add to Cart — $${totalPrice.toFixed(2)}`}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .detail-grid { grid-template-columns: 1fr !important; }
        }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

// ── Sub components ────────────────────────────────
function CustomSection({ title, children }) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <h3 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: '1rem', color: '#2e1a0a', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: 8 }}>
        {title}
      </h3>
      {children}
    </div>
  )
}

function OptionBtn({ label, price, selected, onClick, multi = false }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '0.6rem 0.75rem',
        borderRadius: 10,
        border: `1.5px solid ${selected ? '#e06020' : 'rgba(196,168,130,0.35)'}`,
        background: selected ? 'rgba(224,96,32,0.08)' : 'rgba(255,255,255,0.7)',
        color: selected ? '#b84a14' : '#5a3418',
        fontSize: '0.8rem', fontWeight: selected ? 700 : 500,
        fontFamily: "'DM Sans',sans-serif",
        cursor: 'pointer', transition: 'all 0.2s',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        textAlign: 'left',
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {multi && (
          <span style={{ width: 14, height: 14, borderRadius: 3, border: `2px solid ${selected ? '#e06020' : '#c4a882'}`, background: selected ? '#e06020' : 'transparent', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', color: '#fff', flexShrink: 0 }}>
            {selected ? '✓' : ''}
          </span>
        )}
        {!multi && (
          <span style={{ width: 12, height: 12, borderRadius: '50%', border: `2px solid ${selected ? '#e06020' : '#c4a882'}`, background: selected ? '#e06020' : 'transparent', display: 'inline-block', flexShrink: 0 }} />
        )}
        {label}
      </span>
      {price > 0 && <span style={{ fontSize: '0.72rem', color: '#e06020', fontWeight: 700 }}>+${price}</span>}
    </button>
  )
}

const btnStyle = {
  background: 'linear-gradient(135deg,#b84a14,#e06020)',
  color: '#fff', border: 'none', cursor: 'pointer',
  padding: '0.8rem 2rem', borderRadius: 12,
  fontWeight: 700, fontFamily: "'DM Sans',sans-serif",
}

const qtyBtnStyle = {
  width: 34, height: 34, borderRadius: 8,
  border: '1.5px solid rgba(196,168,130,0.4)',
  background: 'rgba(255,255,255,0.8)',
  cursor: 'pointer', fontSize: '1.1rem',
  color: '#2e1a0a', display: 'flex',
  alignItems: 'center', justifyContent: 'center',
  fontWeight: 700, transition: 'all 0.2s',
}