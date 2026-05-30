// ────────────────────────────────────────────────────
// @route  POST /api/coupon/validate
// @access Private
// ────────────────────────────────────────────────────

const COUPONS = {
  EMBER30: {
    code:        'EMBER30',
    discount:    30,
    type:        'percent',
    minOrder:    25,
    description: '30% off on orders above ₹25',
  },
  EMBER10: {
    code:        'EMBER10',
    discount:    10,
    type:        'fixed',
    minOrder:    20,
    description: '₹10 off on orders above ₹20',
  },
  WELCOME50: {
    code:        'WELCOME50',
    discount:    50,
    type:        'fixed',
    minOrder:    50,
    description: '₹50 off on orders above ₹50',
  },
}

export const validateCoupon = async (req, res) => {
  try {
    const { code, totalAmount } = req.body

    if (!code) {
      return res.status(400).json({ success: false, message: 'Coupon code is required' })
    }

    const coupon = COUPONS[code.toUpperCase()]

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid coupon code' })
    }

    if (totalAmount < coupon.minOrder) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount of ₹${coupon.minOrder} required for this coupon`,
      })
    }

    // Calculate discount
    let discountAmount = 0
    if (coupon.type === 'percent') {
      discountAmount = (totalAmount * coupon.discount) / 100
    } else {
      discountAmount = coupon.discount
    }

    const finalAmount = totalAmount - discountAmount

    res.status(200).json({
      success: true,
      message: 'Coupon applied successfully!',
      data: {
        code:           coupon.code,
        description:    coupon.description,
        discountAmount: Math.round(discountAmount),
        finalAmount:    Math.round(finalAmount),
        type:           coupon.type,
        discount:       coupon.discount,
      },
    })
  } catch (error) {
    console.error('ValidateCoupon error:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}