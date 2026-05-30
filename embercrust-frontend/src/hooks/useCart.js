import { useState, useCallback } from 'react'

export function useCart() {
  const [cartItems, setCartItems] = useState([])

  const addToCart = useCallback((pizza) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === pizza.id)
      if (existing) {
        return prev.map(i =>
          i.id === pizza.id ? { ...i, qty: i.qty + 1 } : i
        )
      }
      return [...prev, { ...pizza, qty: 1 }]
    })
  }, [])

  const removeFromCart = useCallback((id) => {
    setCartItems(prev => prev.filter(i => i.id !== id))
  }, [])

  const updateQty = useCallback((id, qty) => {
    if (qty < 1) {
      setCartItems(prev => prev.filter(i => i.id !== id))
      return
    }
    setCartItems(prev =>
      prev.map(i => i.id === id ? { ...i, qty } : i)
    )
  }, [])

  const clearCart = useCallback(() => setCartItems([]), [])

  const cartCount = cartItems.reduce((sum, i) => sum + i.qty, 0)
  const cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0)

  return {
    cartItems,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
  }
}