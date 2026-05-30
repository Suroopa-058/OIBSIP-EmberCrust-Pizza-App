import express from 'express'
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  getAdminStats,
} from '../controllers/orderController.js'
import { protect, adminOnly } from '../middleware/authMiddleware.js'

const router = express.Router()

// User routes
router.post('/create',          protect, createOrder)
router.get('/my-orders',        protect, getMyOrders)
router.get('/:id',              protect, getOrderById)

// Admin routes
router.get('/all/list',         protect, adminOnly, getAllOrders)
router.get('/admin/stats',      protect, adminOnly, getAdminStats)
router.put('/:id/status',       protect, adminOnly, updateOrderStatus)

export default router