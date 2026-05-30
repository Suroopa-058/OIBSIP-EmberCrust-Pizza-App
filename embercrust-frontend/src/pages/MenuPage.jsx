import { useState, useEffect, useMemo } from 'react'
import { useNavigate }                   from 'react-router-dom'
import { pizzaAPI }                      from '../services/api'
import { CATEGORIES }                    from '../data/menuData'
import CategoryFilter                    from '../components/menu/CategoryFilter'
import SearchBar                         from '../components/menu/SearchBar'
import SortDropdown                      from '../components/menu/SortDropdown'
import PizzaMenuCard                     from '../components/menu/PizzaMenuCard'

function sortPizzas(list, sortId) {
  const arr = [...list]
  switch (sortId) {
    case 'price_asc':  return arr.sort((a, b) => a.price - b.price)
    case 'price_desc': return arr.sort((a, b) => b.price - a.price)
    case 'rating':     return arr.sort((a, b) => b.rating - a.rating)
    case 'popular':
    default:           return arr.sort((a, b) => b.ratingCount - a.ratingCount)
  }
}

export default function MenuPage() {
  const navigate = useNavigate()

  const [allPizzas,       setAllPizzas]       = useState([])
  const [loading,         setLoading]         = useState(true)
  const [activeCategory,  setActiveCategory]  = useState('all')
  const [search,          setSearch]          = useState('')
  const [sort,            setSort]            = useState('popular')

  // Fetch all pizzas from API
  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        setLoading(true)
        const res = await pizzaAPI.getAll()
        setAllPizzas(res.data.data)
      } catch (err) {
        console.error('Failed to fetch pizzas:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchPizzas()
  }, [])

  // Category counts
  const counts = useMemo(() => {
    const c = {}
    CATEGORIES.forEach(cat => {
      if (cat.id === 'all') return
      c[cat.id] = allPizzas.filter(p => p.category === cat.id).length
    })
    return c
  }, [allPizzas])

  // Filter + sort
  const displayed = useMemo(() => {
    let list = allPizzas

    if (activeCategory !== 'all')
      list = list.filter(p => p.category === activeCategory)

    const q = search.trim().toLowerCase()
    if (q)
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      )

    return sortPizzas(list, sort)
  }, [allPizzas, activeCategory, search, sort])

  const isEmpty = !loading && displayed.length === 0

  return (
    <div style={{ background: '#f7f0e8', minHeight: '100vh' }}>

      {/* ── HERO ── */}
      <section style={{
        position: 'relative', overflow: 'hidden',
        padding: '7rem 2.5rem 4.5rem',
        background: 'linear-gradient(160deg,#f7f0e8 0%,#efe6d8 60%,#e8ddd0 100%)',
        borderBottom: '1px solid rgba(196,168,130,0.3)',
        textAlign: 'center',
      }}>
        {/* Glows */}
        <div style={{
          position: 'absolute', top: '-20%', right: '-5%',
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(224,96,32,0.1) 0%,transparent 65%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.025,
          backgroundImage: 'radial-gradient(circle,#2e1a0a 1px,transparent 1px)',
          backgroundSize: '36px 36px', pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 700, margin: '0 auto' }}>

          {/* Live pill */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            marginBottom: '1.5rem',
            background: 'rgba(224,96,32,0.09)',
            border: '1px solid rgba(224,96,32,0.22)',
            borderRadius: 9999, padding: '0.4rem 1.1rem',
          }}>
            <span className="pulse-dot" style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#e06020', display: 'inline-block',
            }} />
            <span style={{
              fontSize: '0.7rem', fontWeight: 700,
              letterSpacing: '0.13em',
              textTransform: 'uppercase', color: '#b84a14',
            }}>
              Fresh Baked · Wood Fired · Delivered Hot
            </span>
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 900,
            fontSize: 'clamp(2.4rem,5vw,3.8rem)',
            lineHeight: 1.08, color: '#2e1a0a', marginBottom: '1.1rem',
          }}>
            Our <span className="shimmer-text">Crafted</span> Menu
          </h1>

          <p style={{
            color: '#7a4820', fontSize: '1.05rem',
            lineHeight: 1.8, maxWidth: 550,
            margin: '0 auto 2.75rem',
          }}>
            Every pizza is hand-stretched to order, kissed by our 900°F
            wood-fired oven, and built from DOP-certified Italian ingredients.
            Browse, choose, and we'll do the rest.
          </p>

          {/* Category chips */}
          <CategoryFilter
            active={activeCategory}
            onChange={setActiveCategory}
            counts={counts}
          />
        </div>
      </section>

      {/* ── FILTER BAR ── */}
      <div style={{
        position: 'sticky', top: 64, zIndex: 40,
        background: 'rgba(247,240,232,0.93)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(196,168,130,0.22)',
        padding: '0.9rem 2.5rem',
      }}>
        <div style={{
          maxWidth: 1340, margin: '0 auto',
          display: 'flex', gap: 12,
          alignItems: 'center', flexWrap: 'wrap',
        }}>
          <SearchBar value={search} onChange={setSearch} />
          <SortDropdown value={sort} onChange={setSort} />

          {/* Result count */}
          <div style={{
            marginLeft: 'auto', fontSize: '0.82rem',
            color: '#c4a882', whiteSpace: 'nowrap', fontWeight: 500,
          }}>
            {loading
              ? 'Loading...'
              : isEmpty
                ? 'No results'
                : `${displayed.length} pizza${displayed.length !== 1 ? 's' : ''}`
            }
            {!loading && activeCategory !== 'all' && !isEmpty && (
              <span style={{ marginLeft: 4, color: '#e06020' }}>
                · {CATEGORIES.find(c => c.id === activeCategory)?.label}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── GRID ── */}
      <main style={{ maxWidth: 1340, margin: '0 auto', padding: '3rem 2.5rem 6rem' }}>

        {/* Loading state */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🔥</div>
            <p style={{ color: '#c4a882', fontFamily: "'DM Sans',sans-serif" }}>
              Loading our menu...
            </p>
          </div>
        ) : isEmpty ? (
          /* Empty state */
          <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1.25rem' }}>🍕</div>
            <h3 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.5rem', color: '#2e1a0a', marginBottom: '0.6rem',
            }}>
              No pizzas found
            </h3>
            <p style={{ color: '#7a4820', marginBottom: '1.75rem' }}>
              Try adjusting your search or clearing the filters.
            </p>
            <button
              onClick={() => { setSearch(''); setActiveCategory('all') }}
              style={{
                background: 'linear-gradient(135deg,#b84a14,#e06020)',
                color: '#fff', border: 'none', cursor: 'pointer',
                padding: '0.8rem 2rem', borderRadius: 12,
                fontWeight: 700, fontSize: '0.9rem',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          /* Pizza Grid */
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3,1fr)',
              gap: '1.75rem',
            }}
            className="menu-grid"
          >
            {displayed.map((pizza, i) => (
              <PizzaMenuCard
                key={pizza._id}
                pizza={pizza}
                animDelay={Math.min(i * 60, 400)}
              />
            ))}
          </div>
        )}
      </main>

      <style>{`
        @media (max-width: 1024px) {
          .menu-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 600px) {
          .menu-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}