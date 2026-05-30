import { useState, useEffect } from 'react'
import { useNavigate }         from 'react-router-dom'
import { useCartContext }      from '../../context/CartContext'
import { pizzaAPI }            from '../../services/api'

// ── Single Pizza Card ─────────────────────────────
function PizzaCard({ pizza }) {
  const navigate          = useNavigate()
  const { addToCart }     = useCartContext()
  const [added, setAdded]     = useState(false)
  const [hovered, setHovered] = useState(false)

  const handleAdd = (e) => {
    e.stopPropagation()
    if (added) return
    setAdded(true)
    addToCart(pizza)
    setTimeout(() => setAdded(false), 2400)
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/pizza/${pizza._id}`)}
      style={{
        background: '#fdf8f2',
        border: `1px solid ${hovered ? 'rgba(224,96,32,0.28)' : 'rgba(196,168,130,0.28)'}`,
        borderRadius: 20,
        overflow: 'hidden',
        transition: 'all 0.42s cubic-bezier(0.4,0,0.2,1)',
        transform: hovered ? 'translateY(-8px)' : 'translateY(0)',
        boxShadow: hovered
          ? '0 24px 60px rgba(46,26,10,0.14)'
          : '0 4px 20px rgba(46,26,10,0.07)',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', overflow: 'hidden', height: 210, flexShrink: 0 }}>
        <img
          src={pizza.image}
          alt={pizza.name}
          loading="lazy"
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            transition: 'transform 0.55s cubic-bezier(0.4,0,0.2,1)',
            transform: hovered ? 'scale(1.07)' : 'scale(1)',
          }}
          onError={e => {
            e.target.src = 'https://www.yumcurry.com/wp-content/uploads/2020/06/pizza-margherita-recipe.jpg'
          }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(46,26,10,0.42) 0%, transparent 55%)',
        }} />

        {/* Veg dot */}
        <div style={{
          position: 'absolute', top: 12, left: 12,
          width: 22, height: 22, borderRadius: 4,
          border: `2px solid ${pizza.isVeg ? '#16a34a' : '#dc2626'}`,
          background: 'rgba(253,248,242,0.95)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }}>
          <div style={{
            width: 10, height: 10, borderRadius: '50%',
            background: pizza.isVeg ? '#16a34a' : '#dc2626',
          }} />
        </div>

        {/* Tag */}
        <span style={{
          position: 'absolute', top: 12, right: 12,
          fontSize: '0.68rem', fontWeight: 700, color: '#b84a14',
          background: 'rgba(253,248,242,0.92)',
          border: '1px solid rgba(224,96,32,0.22)',
          borderRadius: 9999, padding: '0.25rem 0.7rem',
          backdropFilter: 'blur(8px)',
        }}>
          {pizza.tag}
        </span>

        {/* Price */}
        <span style={{
          position: 'absolute', bottom: 12, right: 12,
          fontFamily: "'Playfair Display', serif",
          fontSize: '1.4rem', fontWeight: 900,
          color: '#fff', textShadow: '0 2px 12px rgba(46,26,10,0.6)',
        }}>
          ${pizza.price}
        </span>
      </div>

      {/* Body */}
      <div style={{
        padding: '1.25rem 1.35rem',
        display: 'flex', flexDirection: 'column',
        gap: 10, flex: 1,
      }}>
        <h3 style={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 800, fontSize: '1.1rem',
          color: '#2e1a0a', lineHeight: 1.25,
        }}>
          {pizza.name}
        </h3>

        <p style={{
          fontSize: '0.78rem', color: '#7a4820',
          lineHeight: 1.65,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {pizza.description}
        </p>

        {/* Rating + time */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ color: '#e06020', fontSize: '0.85rem' }}>★</span>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#2e1a0a' }}>
              {pizza.rating}
            </span>
            <span style={{ fontSize: '0.72rem', color: '#c4a882' }}>
              ({pizza.ratingCount?.toLocaleString()})
            </span>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            fontSize: '0.78rem', color: '#7a4820',
            background: 'rgba(196,168,130,0.15)',
            border: '1px solid rgba(196,168,130,0.3)',
            borderRadius: 8, padding: '0.22rem 0.65rem',
          }}>
            🕐 {pizza.deliveryTime} min
          </div>
        </div>

        <div style={{ height: 1, background: 'rgba(196,168,130,0.22)' }} />

        {/* Add to Cart */}
        <button
          onClick={handleAdd}
          style={{
            width: '100%', padding: '0.78rem',
            borderRadius: 12,
            border: added ? '1px solid rgba(22,163,74,0.3)' : 'none',
            fontWeight: 700, fontSize: '0.875rem',
            fontFamily: "'DM Sans', sans-serif",
            cursor: added ? 'default' : 'pointer',
            transition: 'all 0.3s',
            background: added
              ? 'rgba(22,163,74,0.1)'
              : hovered
                ? 'linear-gradient(135deg,#b84a14,#e06020,#f0844a)'
                : 'linear-gradient(135deg,#c8520e,#e06020)',
            color: added ? '#16a34a' : '#fff',
            boxShadow: added
              ? 'none'
              : hovered
                ? '0 8px 28px rgba(224,96,32,0.45)'
                : '0 4px 16px rgba(224,96,32,0.25)',
          }}
        >
          {added ? '✓ Added to Cart' : '+ Add to Cart'}
        </button>
      </div>
    </div>
  )
}

// ── Featured Pizzas Section ───────────────────────
export default function FeaturedPizzas() {
  const navigate              = useNavigate()
  const [pizzas, setPizzas]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        const res = await pizzaAPI.getFeatured()
        setPizzas(res.data.data)
      } catch (err) {
        console.error('Failed to fetch featured pizzas:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchPizzas()
  }, [])

  return (
    <section id="menu" style={{ padding: '7rem 2.5rem', background: '#f7f0e8' }}>
      <div style={{ maxWidth: 1340, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span style={{
            display: 'block', fontSize: '0.7rem', fontWeight: 700,
            letterSpacing: '0.15em', textTransform: 'uppercase',
            color: '#e06020', marginBottom: '1rem',
          }}>
            — Our Creations —
          </span>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 900,
            fontSize: 'clamp(2rem,4vw,3.25rem)',
            marginBottom: '1rem', color: '#2e1a0a',
          }}>
            Featured <span className="shimmer-text">Pizzas</span>
          </h2>
          <p style={{
            color: '#7a4820', maxWidth: 500,
            margin: '0 auto', lineHeight: 1.75, fontSize: '0.95rem',
          }}>
            Hand-stretched, wood-fired at 900°F, built from recipes developed
            with Michelin-starred chefs. No shortcuts, ever.
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', fontSize: '2.5rem' }}>
            🔥
          </div>
        ) : (
          <>
            {/* Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1.75rem',
              }}
              className="pizza-grid"
            >
              {pizzas.map(p => (
                <PizzaCard key={p._id} pizza={p} />
              ))}
            </div>

            {/* View all button */}
            <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
              <button
                onClick={() => navigate('/menu')}
                style={{
                  padding: '1rem 2.75rem', borderRadius: 14,
                  background: 'linear-gradient(135deg,#b84a14,#e06020)',
                  color: '#fff', border: 'none', cursor: 'pointer',
                  fontWeight: 700, fontSize: '0.95rem',
                  fontFamily: "'DM Sans', sans-serif",
                  boxShadow: '0 6px 28px rgba(224,96,32,0.35)',
                  transition: 'all 0.3s',
                }}
                onMouseOver={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 10px 40px rgba(224,96,32,0.5)'
                }}
                onMouseOut={e => {
                  e.currentTarget.style.transform = 'none'
                  e.currentTarget.style.boxShadow = '0 6px 28px rgba(224,96,32,0.35)'
                }}
              >
                View Full Menu →
              </button>
            </div>
          </>
        )}
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .pizza-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 600px) {
          .pizza-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}