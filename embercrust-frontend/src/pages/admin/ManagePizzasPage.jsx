import { useState, useEffect } from 'react'
import { useNavigate }         from 'react-router-dom'
import { pizzaAPI }            from '../../services/api'

const EMPTY_FORM = {
  name: '', description: '', image: '',
  category: 'classic', price: '', stock: '',
  deliveryTime: 28, isVeg: false, isPopular: false,
  tag: '', isAvailable: true,
}

const CATEGORIES = ['classic', 'spicy', 'veg', 'premium', 'seafood']

export default function ManagePizzasPage() {
  const navigate = useNavigate()

  const [pizzas,    setPizzas]    = useState([])
  const [loading,   setLoading]   = useState(true)
  const [showForm,  setShowForm]  = useState(false)
  const [editId,    setEditId]    = useState(null)
  const [form,      setForm]      = useState(EMPTY_FORM)
  const [saving,    setSaving]    = useState(false)
  const [success,   setSuccess]   = useState('')
  const [error,     setError]     = useState('')

  useEffect(() => {
    fetchPizzas()
  }, [])

  const fetchPizzas = async () => {
    try {
      setLoading(true)
      const res = await pizzaAPI.getAll()
      setPizzas(res.data.data)
    } catch {
      console.error('Failed to fetch pizzas')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleEdit = (pizza) => {
    setEditId(pizza._id)
    setForm({
      name: pizza.name, description: pizza.description,
      image: pizza.image, category: pizza.category,
      price: pizza.price, stock: pizza.stock,
      deliveryTime: pizza.deliveryTime, isVeg: pizza.isVeg,
      isPopular: pizza.isPopular, tag: pizza.tag,
      isAvailable: pizza.isAvailable,
    })
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this pizza?')) return
    try {
      await pizzaAPI.delete(id)
      setPizzas(prev => prev.filter(p => p._id !== id))
      setSuccess('Pizza deleted successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch {
      setError('Failed to delete pizza')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.description || !form.image || !form.price) {
      return setError('Name, description, image and price are required')
    }

    try {
      setSaving(true)
      setError('')

      if (editId) {
        await pizzaAPI.update(editId, { ...form, price: +form.price, stock: +form.stock, deliveryTime: +form.deliveryTime })
        setSuccess('Pizza updated successfully!')
      } else {
        await pizzaAPI.create({ ...form, price: +form.price, stock: +form.stock, deliveryTime: +form.deliveryTime })
        setSuccess('Pizza added successfully!')
      }

      setForm(EMPTY_FORM)
      setEditId(null)
      setShowForm(false)
      fetchPizzas()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save pizza')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f7f0e8', paddingTop: '5rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 2.5rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <button onClick={() => navigate('/admin/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7a4820', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', display: 'block', fontFamily: "'DM Sans',sans-serif" }}>
              ← Back to Dashboard
            </button>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: '2rem', color: '#2e1a0a' }}>
              Manage Pizzas 🍕
            </h1>
          </div>
          <button
            onClick={() => { setShowForm(!showForm); setEditId(null); setForm(EMPTY_FORM) }}
            style={{ padding: '0.7rem 1.35rem', borderRadius: 12, background: 'linear-gradient(135deg,#b84a14,#e06020)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}
          >
            {showForm ? '✕ Cancel' : '+ Add New Pizza'}
          </button>
        </div>

        {/* Success/Error */}
        {success && <div style={{ background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.3)', borderRadius: 12, padding: '0.85rem', color: '#16a34a', fontWeight: 600, marginBottom: '1rem', fontSize: '0.875rem' }}>✅ {success}</div>}
        {error   && <div style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.25)', borderRadius: 12, padding: '0.85rem', color: '#dc2626', fontWeight: 600, marginBottom: '1rem', fontSize: '0.875rem' }}>❌ {error}</div>}

        {/* Add/Edit Form */}
        {showForm && (
          <div style={{ background: '#fdf8f2', border: '1px solid rgba(196,168,130,0.3)', borderRadius: 20, padding: '2rem', marginBottom: '2rem' }}>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 800, fontSize: '1.2rem', color: '#2e1a0a', marginBottom: '1.5rem' }}>
              {editId ? 'Edit Pizza' : 'Add New Pizza'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="form-grid">

                <div>
                  <label style={labelStyle}>Pizza Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Diavola Classico" style={inputStyle} onFocus={e => e.target.style.borderColor='#e06020'} onBlur={e => e.target.style.borderColor='rgba(196,168,130,0.4)'} />
                </div>

                <div>
                  <label style={labelStyle}>Category *</label>
                  <select name="category" value={form.category} onChange={handleChange} style={inputStyle}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                  </select>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Description *</label>
                  <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe the pizza ingredients..." style={{ ...inputStyle, height: 80, resize: 'vertical' }} onFocus={e => e.target.style.borderColor='#e06020'} onBlur={e => e.target.style.borderColor='rgba(196,168,130,0.4)'} />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Image URL *</label>
                  <input name="image" value={form.image} onChange={handleChange} placeholder="https://images.unsplash.com/..." style={inputStyle} onFocus={e => e.target.style.borderColor='#e06020'} onBlur={e => e.target.style.borderColor='rgba(196,168,130,0.4)'} />
                </div>

                <div>
                  <label style={labelStyle}>Price ($) *</label>
                  <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="22" style={inputStyle} onFocus={e => e.target.style.borderColor='#e06020'} onBlur={e => e.target.style.borderColor='rgba(196,168,130,0.4)'} />
                </div>

                <div>
                  <label style={labelStyle}>Stock</label>
                  <input name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="50" style={inputStyle} onFocus={e => e.target.style.borderColor='#e06020'} onBlur={e => e.target.style.borderColor='rgba(196,168,130,0.4)'} />
                </div>

                <div>
                  <label style={labelStyle}>Delivery Time (min)</label>
                  <input name="deliveryTime" type="number" value={form.deliveryTime} onChange={handleChange} placeholder="28" style={inputStyle} onFocus={e => e.target.style.borderColor='#e06020'} onBlur={e => e.target.style.borderColor='rgba(196,168,130,0.4)'} />
                </div>

                <div>
                  <label style={labelStyle}>Tag</label>
                  <input name="tag" value={form.tag} onChange={handleChange} placeholder="🔥 Best Seller" style={inputStyle} onFocus={e => e.target.style.borderColor='#e06020'} onBlur={e => e.target.style.borderColor='rgba(196,168,130,0.4)'} />
                </div>

                <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '2rem' }}>
                  {[
                    { name: 'isVeg',       label: '🌿 Vegetarian'  },
                    { name: 'isPopular',   label: '⭐ Popular'      },
                    { name: 'isAvailable', label: '✅ Available'    },
                  ].map(cb => (
                    <label key={cb.name} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.875rem', color: '#5a3418', fontWeight: 500 }}>
                      <input type="checkbox" name={cb.name} checked={form[cb.name]} onChange={handleChange} style={{ width: 16, height: 16, accentColor: '#e06020' }} />
                      {cb.label}
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="submit" disabled={saving} style={{ flex: 1, padding: '0.9rem', borderRadius: 12, border: 'none', background: saving ? '#c4a882' : 'linear-gradient(135deg,#b84a14,#e06020)', color: '#fff', fontWeight: 700, fontSize: '0.95rem', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans',sans-serif" }}>
                  {saving ? 'Saving...' : editId ? 'Update Pizza' : 'Add Pizza'}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditId(null); setForm(EMPTY_FORM) }} style={{ padding: '0.9rem 1.5rem', borderRadius: 12, border: '1.5px solid rgba(196,168,130,0.4)', background: 'transparent', color: '#7a4820', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Pizza List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', fontSize: '2.5rem' }}>🔥</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }} className="admin-pizza-grid">
            {pizzas.map(pizza => (
              <div key={pizza._id} style={{ background: '#fdf8f2', border: '1px solid rgba(196,168,130,0.3)', borderRadius: 16, overflow: 'hidden' }}>
                <div style={{ position: 'relative', height: 160 }}>
                  <img src={pizza.image} alt={pizza.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.src='https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80'} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(46,26,10,0.5) 0%, transparent 50%)' }} />
                  <div style={{ position: 'absolute', top: 10, left: 10, width: 18, height: 18, borderRadius: 3, border: `2px solid ${pizza.isVeg ? '#16a34a' : '#dc2626'}`, background: 'rgba(253,248,242,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: pizza.isVeg ? '#16a34a' : '#dc2626' }} />
                  </div>
                  <div style={{ position: 'absolute', bottom: 10, left: 10, right: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, color: '#fff', fontSize: '1.1rem' }}>${pizza.price}</span>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: pizza.isAvailable ? '#4ade80' : '#f87171', background: 'rgba(0,0,0,0.4)', borderRadius: 9999, padding: '0.15rem 0.5rem' }}>
                      {pizza.isAvailable ? '● Available' : '● Unavailable'}
                    </span>
                  </div>
                </div>
                <div style={{ padding: '1rem' }}>
                  <h3 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: '0.95rem', color: '#2e1a0a', marginBottom: 4 }}>{pizza.name}</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.85rem', fontSize: '0.78rem' }}>
                    <span style={{ color: '#7a4820' }}>📦 Stock: <strong style={{ color: pizza.stock <= 5 ? '#dc2626' : '#2e1a0a' }}>{pizza.stock}</strong></span>
                    <span style={{ color: '#7a4820' }}>⭐ {pizza.rating}</span>
                    <span style={{ background: 'rgba(224,96,32,0.08)', border: '1px solid rgba(224,96,32,0.2)', borderRadius: 9999, padding: '0.1rem 0.45rem', fontWeight: 600, color: '#b84a14' }}>{pizza.category}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => handleEdit(pizza)} style={{ flex: 1, padding: '0.55rem', borderRadius: 8, background: 'linear-gradient(135deg,#5a3418,#7a4820)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', fontFamily: "'DM Sans',sans-serif" }}>
                      ✏️ Edit
                    </button>
                    <button onClick={() => handleDelete(pizza._id)} style={{ flex: 1, padding: '0.55rem', borderRadius: 8, background: 'rgba(220,38,38,0.1)', color: '#dc2626', border: '1px solid rgba(220,38,38,0.25)', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', fontFamily: "'DM Sans',sans-serif" }}>
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) { .admin-pizza-grid { grid-template-columns: repeat(2,1fr) !important; } .form-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 500px) { .admin-pizza-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  )
}

const labelStyle = {
  display: 'block', fontSize: '0.78rem',
  fontWeight: 600, color: '#5a3418', marginBottom: 5,
}

const inputStyle = {
  width: '100%', padding: '0.72rem 1rem',
  borderRadius: 10, border: '1.5px solid rgba(196,168,130,0.4)',
  background: 'rgba(255,255,255,0.8)', fontSize: '0.875rem',
  color: '#2e1a0a', fontFamily: "'DM Sans',sans-serif",
  outline: 'none', transition: 'border-color 0.25s',
  boxShadow: '0 2px 8px rgba(46,26,10,0.05)',
}