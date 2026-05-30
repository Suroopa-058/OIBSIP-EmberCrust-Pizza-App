import Pizza from '../models/Pizza.js'
import { sendLowStockEmail } from '../data/emailService.js'

// ────────────────────────────────────────────────────
// @route  GET /api/pizzas
// @access Public
// ────────────────────────────────────────────────────
export const getAllPizzas = async (req, res) => {
  try {
    const { category, search, sort } = req.query

    let query = {}

    // Category filter
    if (category && category !== 'all') {
      query.category = category
    }

    // Search filter
    if (search) {
      query.$or = [
        { name:        { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category:    { $regex: search, $options: 'i' } },
      ]
    }

    // Sort
    let sortOption = {}
    if (sort === 'price_asc')  sortOption = { price:  1 }
    if (sort === 'price_desc') sortOption = { price: -1 }
    if (sort === 'rating')     sortOption = { rating: -1 }
    if (sort === 'popular')    sortOption = { ratingCount: -1 }

    const pizzas = await Pizza.find(query).sort(sortOption)

    res.status(200).json({
      success: true,
      count: pizzas.length,
      data: pizzas,
    })
  } catch (error) {
    console.error('GetAllPizzas error:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// ────────────────────────────────────────────────────
// @route  GET /api/pizzas/:id
// @access Public
// ────────────────────────────────────────────────────
export const getPizzaById = async (req, res) => {
  try {
    const pizza = await Pizza.findById(req.params.id)

    if (!pizza) {
      return res.status(404).json({ success: false, message: 'Pizza not found' })
    }

    res.status(200).json({ success: true, data: pizza })
  } catch (error) {
    console.error('GetPizzaById error:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// ────────────────────────────────────────────────────
// @route  POST /api/pizzas
// @access Admin
// ────────────────────────────────────────────────────
export const createPizza = async (req, res) => {
  try {
    const {
      name, description, image, category,
      price, isVeg, isPopular, tag, stock, deliveryTime,
    } = req.body

    if (!name || !description || !image || !category || !price) {
      return res.status(400).json({ success: false, message: 'All required fields must be filled' })
    }

    const pizza = await Pizza.create({
      name, description, image, category,
      price, isVeg, isPopular, tag, stock, deliveryTime,
    })

    res.status(201).json({
      success: true,
      message: 'Pizza created successfully!',
      data: pizza,
    })
  } catch (error) {
    console.error('CreatePizza error:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// ────────────────────────────────────────────────────
// @route  PUT /api/pizzas/:id
// @access Admin
// ────────────────────────────────────────────────────
export const updatePizza = async (req, res) => {
  try {
    const pizza = await Pizza.findById(req.params.id)

    if (!pizza) {
      return res.status(404).json({ success: false, message: 'Pizza not found' })
    }

    const updated = await Pizza.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    // Check low stock — alert admin if stock <= 5
    if (updated.stock <= 5) {
      await sendLowStockEmail(updated.name)
    }

    res.status(200).json({
      success: true,
      message: 'Pizza updated successfully!',
      data: updated,
    })
  } catch (error) {
    console.error('UpdatePizza error:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// ────────────────────────────────────────────────────
// @route  DELETE /api/pizzas/:id
// @access Admin
// ────────────────────────────────────────────────────
export const deletePizza = async (req, res) => {
  try {
    const pizza = await Pizza.findById(req.params.id)

    if (!pizza) {
      return res.status(404).json({ success: false, message: 'Pizza not found' })
    }

    await pizza.deleteOne()

    res.status(200).json({
      success: true,
      message: 'Pizza deleted successfully!',
    })
  } catch (error) {
    console.error('DeletePizza error:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// ────────────────────────────────────────────────────
// @route  GET /api/pizzas/featured
// @access Public
// ────────────────────────────────────────────────────
export const getFeaturedPizzas = async (req, res) => {
  try {
    const pizzas = await Pizza.find({ isPopular: true, isAvailable: true }).limit(6)

    res.status(200).json({
      success: true,
      count: pizzas.length,
      data: pizzas,
    })
  } catch (error) {
    console.error('GetFeaturedPizzas error:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}