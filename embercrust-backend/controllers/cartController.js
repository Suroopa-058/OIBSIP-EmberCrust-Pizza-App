import Cart  from '../models/Cart.js'
import Pizza from '../models/Pizza.js'

// ────────────────────────────────────────────────────
// @route  GET /api/cart
// @access Private
// ────────────────────────────────────────────────────
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate('items.pizza', 'name image price isAvailable category tag isVeg')

    if (!cart) {
      return res.status(200).json({
        success: true,
        data: { items: [], totalAmount: 0 },
      })
    }

    res.status(200).json({ success: true, data: cart })
  } catch (error) {
    console.error('GetCart error:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// ────────────────────────────────────────────────────
// @route  POST /api/cart/add
// @access Private
// ────────────────────────────────────────────────────
export const addToCart = async (req, res) => {
  try {
    const { pizzaId, quantity = 1, customization = {} } = req.body

    if (!pizzaId) {
      return res.status(400).json({ success: false, message: 'Pizza ID is required' })
    }

    // Check pizza exists
    const pizza = await Pizza.findById(pizzaId)
    if (!pizza) {
      return res.status(404).json({ success: false, message: 'Pizza not found' })
    }

    if (!pizza.isAvailable) {
      return res.status(400).json({ success: false, message: 'Pizza is currently unavailable' })
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: req.user._id })
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] })
    }

    // Check if same pizza with same customization exists
    const existingIndex = cart.items.findIndex(item => {
      const samePizza = item.pizza.toString() === pizzaId
      const sameBase   = (item.customization?.base   || '') === (customization?.base   || '')
      const sameSauce  = (item.customization?.sauce  || '') === (customization?.sauce  || '')
      const sameCheese = (item.customization?.cheese || '') === (customization?.cheese || '')
      const sameVeggies = JSON.stringify(item.customization?.veggies?.sort() || []) ===
                          JSON.stringify(customization?.veggies?.sort() || [])
      return samePizza && sameBase && sameSauce && sameCheese && sameVeggies
    })

    if (existingIndex > -1) {
      // Update quantity
      cart.items[existingIndex].quantity += quantity
    } else {
      // Add new item
      cart.items.push({
        pizza:         pizzaId,
        quantity,
        customization,
        price:         pizza.price,
      })
    }

    await cart.save()

    // Populate and return
    const updatedCart = await Cart.findById(cart._id)
      .populate('items.pizza', 'name image price isAvailable category tag isVeg')

    res.status(200).json({
      success: true,
      message: 'Item added to cart!',
      data: updatedCart,
    })
  } catch (error) {
    console.error('AddToCart error:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// ────────────────────────────────────────────────────
// @route  PUT /api/cart/update
// @access Private
// ────────────────────────────────────────────────────
export const updateCartItem = async (req, res) => {
  try {
    const { itemId, quantity } = req.body

    if (!itemId || quantity === undefined) {
      return res.status(400).json({ success: false, message: 'Item ID and quantity are required' })
    }

    const cart = await Cart.findOne({ user: req.user._id })
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' })
    }

    const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId)
    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' })
    }

    if (quantity <= 0) {
      // Remove item
      cart.items.splice(itemIndex, 1)
    } else {
      cart.items[itemIndex].quantity = quantity
    }

    await cart.save()

    const updatedCart = await Cart.findById(cart._id)
      .populate('items.pizza', 'name image price isAvailable category tag isVeg')

    res.status(200).json({
      success: true,
      message: 'Cart updated!',
      data: updatedCart,
    })
  } catch (error) {
    console.error('UpdateCartItem error:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// ────────────────────────────────────────────────────
// @route  DELETE /api/cart/remove/:itemId
// @access Private
// ────────────────────────────────────────────────────
export const removeCartItem = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' })
    }

    const itemIndex = cart.items.findIndex(
      item => item._id.toString() === req.params.itemId
    )

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' })
    }

    cart.items.splice(itemIndex, 1)
    await cart.save()

    const updatedCart = await Cart.findById(cart._id)
      .populate('items.pizza', 'name image price isAvailable category tag isVeg')

    res.status(200).json({
      success: true,
      message: 'Item removed from cart!',
      data: updatedCart,
    })
  } catch (error) {
    console.error('RemoveCartItem error:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// ────────────────────────────────────────────────────
// @route  DELETE /api/cart/clear
// @access Private
// ────────────────────────────────────────────────────
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' })
    }

    cart.items       = []
    cart.totalAmount = 0
    await cart.save()

    res.status(200).json({
      success: true,
      message: 'Cart cleared!',
      data: { items: [], totalAmount: 0 },
    })
  } catch (error) {
    console.error('ClearCart error:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}