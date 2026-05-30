import { createContext, useContext, useState, useEffect } from 'react'
import { useToast } from '../hooks/useToast'
import { useAuth }  from './AuthContext'
import { cartAPI }  from '../services/api'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { isLoggedIn }              = useAuth()
  const { toasts, addToast, removeToast } = useToast()
  const [cartCount, setCartCount]   = useState(0)
  const [cartItems, setCartItems]   = useState([])
  const [cartTotal, setCartTotal]   = useState(0)

  // Fetch cart count when user logs in
  useEffect(() => {
    if (isLoggedIn) {
      fetchCartCount()
    } else {
      setCartCount(0)
      setCartItems([])
    }
  }, [isLoggedIn])

  const fetchCartCount = async () => {
    try {
      const res = await cartAPI.getCart()
      const items = res.data.data?.items || []
      setCartItems(items)
      setCartCount(items.reduce((s, i) => s + i.quantity, 0))
      setCartTotal(res.data.data?.totalAmount || 0)
    } catch {
      // silently fail
    }
  }

  const addToCart = async (pizza) => {
    try {
      if (!isLoggedIn) {
        addToast('Please login to add items to cart', 'error')
        return
      }
      await cartAPI.addToCart({
        pizzaId:       pizza._id || pizza.id,
        quantity:      pizza.qty || 1,
        customization: pizza.customization || {},
      })
      await fetchCartCount()
      addToast(`${pizza.name} added to cart!`, 'success')
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to add to cart', 'error')
    }
  }

  const refreshCart = async () => {
    await fetchCartCount()
  }

  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount,
      cartTotal,
      addToCart,
      refreshCart,
      toasts,
      addToast,
      removeToast,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCartContext() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCartContext must be used inside CartProvider')
  return context
}