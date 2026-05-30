import express from 'express'
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from '../controllers/cartController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

// All cart routes are protected
router.get('/',                protect, getCart)
router.post('/add',            protect, addToCart)
router.put('/update',          protect, updateCartItem)
router.delete('/remove/:itemId', protect, removeCartItem)
router.delete('/clear',        protect, clearCart)

export default router