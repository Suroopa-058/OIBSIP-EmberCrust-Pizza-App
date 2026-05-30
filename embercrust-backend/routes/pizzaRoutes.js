import express from 'express'
import {
  getAllPizzas,
  getPizzaById,
  createPizza,
  updatePizza,
  deletePizza,
  getFeaturedPizzas,
} from '../controllers/pizzaController.js'
import { protect, adminOnly } from '../middleware/authMiddleware.js'

const router = express.Router()

// Public routes
router.get('/',          getAllPizzas)
router.get('/featured',  getFeaturedPizzas)
router.get('/:id',       getPizzaById)

// Admin only routes
router.post('/',         protect, adminOnly, createPizza)
router.put('/:id',       protect, adminOnly, updatePizza)
router.delete('/:id',    protect, adminOnly, deletePizza)

export default router