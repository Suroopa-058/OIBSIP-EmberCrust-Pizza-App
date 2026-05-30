import Order from '../models/Order.js'
import Cart  from '../models/Cart.js'
import Pizza from '../models/Pizza.js'
import {
  sendOrderConfirmationEmail,
  sendOrderStatusEmail,
  sendLowStockEmail,
} from '../data/emailService.js'

// ────────────────────────────────────────────────────
// @route  POST /api/orders/create
// @access Private
// ────────────────────────────────────────────────────
export const createOrder = async (req, res) => {
  try {
    const {
      items,
      address,
      totalAmount,
      discount,
      finalAmount,
      couponCode,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = req.body

    if (!items || !items.length) {
      return res.status(400).json({ success: false, message: 'No items in order' })
    }
    if (!address) {
      return res.status(400).json({ success: false, message: 'Delivery address is required' })
    }
    if (!razorpayPaymentId) {
      return res.status(400).json({ success: false, message: 'Payment not completed' })
    }

    // Create order
    const order = await Order.create({
      user:              req.user._id,
      items,
      address,
      totalAmount,
      discount:          discount || 0,
      finalAmount,
      couponCode:        couponCode || null,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      paymentStatus:     'paid',
      orderStatus:       'Order Received',
    })

    // ── Task 7: Update stock for each pizza ──────────
    for (const item of items) {
      const pizza = await Pizza.findById(item.pizza)
      if (pizza) {
        pizza.stock = Math.max(0, pizza.stock - item.quantity)

        // ── Task 8: Low stock email if stock <= 5 ────
        if (pizza.stock <= 5) {
          await sendLowStockEmail(pizza.name)
          console.log(`⚠️ Low stock alert sent for: ${pizza.name}`)
        }

        // Mark unavailable if stock = 0
        if (pizza.stock === 0) {
          pizza.isAvailable = false
        }

        await pizza.save()
      }
    }

    // Clear cart after order
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [], totalAmount: 0 }
    )

    // Send confirmation email
    await sendOrderConfirmationEmail(
      req.user.email,
      req.user.name,
      order._id,
      finalAmount
    )

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      data:    order,
    })
  } catch (error) {
    console.error('CreateOrder error:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// ────────────────────────────────────────────────────
// @route  GET /api/orders/my-orders
// @access Private
// ────────────────────────────────────────────────────
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.pizza', 'name image')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count:   orders.length,
      data:    orders,
    })
  } catch (error) {
    console.error('GetMyOrders error:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// ────────────────────────────────────────────────────
// @route  GET /api/orders/:id
// @access Private
// ────────────────────────────────────────────────────
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.pizza', 'name image category')
      .populate('user', 'name email')

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' })
    }

    // Only owner or admin can view
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized' })
    }

    res.status(200).json({ success: true, data: order })
  } catch (error) {
    console.error('GetOrderById error:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// ────────────────────────────────────────────────────
// @route  GET /api/orders/all/list
// @access Admin
// ────────────────────────────────────────────────────
export const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query

    let query = {}
    if (status) query.orderStatus = status

    const orders = await Order.find(query)
      .populate('user',        'name email')
      .populate('items.pizza', 'name image')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))

    const total = await Order.countDocuments(query)

    res.status(200).json({
      success: true,
      count:   orders.length,
      total,
      page:    Number(page),
      data:    orders,
    })
  } catch (error) {
    console.error('GetAllOrders error:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// ────────────────────────────────────────────────────
// @route  PUT /api/orders/:id/status
// @access Admin
// ────────────────────────────────────────────────────
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body

    const validStatuses = [
      'Order Received',
      'In Kitchen',
      'Sent to Delivery',
      'Delivered',
      'Cancelled',
    ]

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      })
    }

    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' })
    }

    order.orderStatus = status
    order.updatedAt   = new Date()
    await order.save()

    // Send status update email to user
    await sendOrderStatusEmail(
      order.user.email,
      order.user.name,
      order._id,
      status
    )

    res.status(200).json({
      success: true,
      message: 'Order status updated!',
      data:    order,
    })
  } catch (error) {
    console.error('UpdateOrderStatus error:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// ────────────────────────────────────────────────────
// @route  GET /api/orders/admin/stats
// @access Admin
// ────────────────────────────────────────────────────
export const getAdminStats = async (req, res) => {
  try {
    const totalOrders    = await Order.countDocuments()
    const totalRevenue   = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$finalAmount' } } },
    ])
    const pendingOrders  = await Order.countDocuments({ orderStatus: 'Order Received' })
    const todayOrders    = await Order.countDocuments({
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
    })
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } },
    ])

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        totalRevenue:  totalRevenue[0]?.total || 0,
        pendingOrders,
        todayOrders,
        ordersByStatus,
      },
    })
  } catch (error) {
    console.error('GetAdminStats error:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}