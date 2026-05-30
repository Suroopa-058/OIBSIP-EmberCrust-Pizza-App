import crypto from 'crypto'

// ────────────────────────────────────────────────────
// @route  POST /api/payment/create-order
// @access Private
// ────────────────────────────────────────────────────
export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Valid amount is required' })
    }

    // Initialize inside function so .env is loaded
    const Razorpay = (await import('razorpay')).default
    const razorpay = new Razorpay({
      key_id:     process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })

    const options = {
      amount:   Math.round(amount * 100),
      currency: 'INR',
      receipt:  `receipt_${Date.now()}`,
    }

    const order = await razorpay.orders.create(options)

    res.status(200).json({
      success: true,
      data: {
        orderId:  order.id,
        amount:   order.amount,
        currency: order.currency,
        receipt:  order.receipt,
      },
    })
  } catch (error) {
    console.error('CreateRazorpayOrder error:', error)
    res.status(500).json({ success: false, message: 'Payment initialization failed' })
  }
}

// ────────────────────────────────────────────────────
// @route  POST /api/payment/verify
// @access Private
// ────────────────────────────────────────────────────
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment details are incomplete' })
    }

    const body     = razorpay_order_id + '|' + razorpay_payment_id
    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex')

    if (expected !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed' })
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully!',
      data: {
        razorpayOrderId:   razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      },
    })
  } catch (error) {
    console.error('VerifyPayment error:', error)
    res.status(500).json({ success: false, message: 'Payment verification failed' })
  }
}