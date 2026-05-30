import { useState } from 'react'
import { useNavigate } from 'react-router-dom' 
import { useCartContext } from '../../context/CartContext'

export default function PizzaMenuCard({ pizza, animDelay = 0 }) {
  const { addToCart } = useCartContext()
   const navigate = useNavigate()
  const [added, setAdded]     = useState(false)
  const [hovered, setHovered] = useState(false)
  const [imgError, setImgError] = useState(false)

  const handleAdd = () => {
    if (added) return
    setAdded(true)
    addToCart(pizza)
    setTimeout(() => setAdded(false), 2400)
  }

  const fallback = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80&auto=format'

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
       onClick={() => navigate(`/pizza/${pizza._id}`)} 
      style={{
        background: '#fdf8f2',
        border: `1px solid ${hovered ? 'rgba(224,96,32,0.28)' : 'rgba(196,168,130,0.28)'}`,
        borderRadius: 20, overflow: 'hidden',
        transition: 'all 0.42s cubic-bezier(0.4,0,0.2,1)',
        transform: hovered ? 'translateY(-8px)' : 'translateY(0)',
        boxShadow: hovered
          ? '0 24px 60px rgba(46,26,10,0.14)'
          : '0 4px 20px rgba(46,26,10,0.07)',
        display: 'flex', flexDirection: 'column',
        opacity: 0,
        animation: `cardFadeUp 0.55s ease forwards`,
        animationDelay: `${animDelay}ms`,
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', overflow: 'hidden', height: 210, flexShrink: 0 }}>
        <img
          src={imgError ? fallback : pizza.image}
          alt={pizza.name}
          loading="lazy"
          onError={() => setImgError(true)}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            transition: 'transform 0.55s cubic-bezier(0.4,0,0.2,1)',
            transform: hovered ? 'scale(1.07)' : 'scale(1)',
          }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(46,26,10,0.42) 0%, transparent 55%)',
        }} />

        {/* Veg / Non-veg */}
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
          fontFamily: "'DM Sans', sans-serif",
        }}>
          {pizza.tag}
        </span>

        {/* Price */}
        <span style={{
          position: 'absolute', bottom: 12, right: 12,
          fontFamily: "'Playfair Display', serif",
          fontSize: '1.45rem', fontWeight: 900,
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
          color: '#2e1a0a', lineHeight: 1.25, margin: 0,
        }}>
          {pizza.name}
        </h3>

        <p style={{
          fontSize: '0.78rem', color: '#7a4820',
          lineHeight: 1.65, margin: 0,
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {pizza.description}
        </p>

        {/* Rating + time */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ color: '#e06020', fontSize: '0.85rem' }}>★</span>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#2e1a0a' }}>
              {pizza.rating}
            </span>
            <span style={{ fontSize: '0.72rem', color: '#c4a882' }}>
              ({pizza.ratingCount.toLocaleString()})
            </span>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5,
            fontSize: '0.78rem', color: '#7a4820',
            background: 'rgba(196,168,130,0.15)',
            border: '1px solid rgba(196,168,130,0.3)',
            borderRadius: 8, padding: '0.22rem 0.65rem',
          }}>
            🕐 {pizza.deliveryTime} min
          </div>
        </div>

        <div style={{ height: 1, background: 'rgba(196,168,130,0.22)', margin: '2px 0' }} />

        {/* Add button */}
        <button
          onClick={(e) => {
          e.stopPropagation()  
          handleAdd()
               }}
          
          style={{
            width: '100%', padding: '0.78rem', borderRadius: 12,
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
            boxShadow: added ? 'none' : hovered
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