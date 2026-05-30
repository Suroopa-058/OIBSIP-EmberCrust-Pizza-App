import mongoose from 'mongoose'

const customizationSchema = new mongoose.Schema({
  base:    { type: String, default: '' },
  sauce:   { type: String, default: '' },
  cheese:  { type: String, default: '' },
  veggies: { type: [String], default: [] },
}, { _id: false })

const orderItemSchema = new mongoose.Schema({
  pizza: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pizza',
    required: true,
  },
  name:          { type: String, required: true },
  image:         { type: String },
  price:         { type: Number, required: true },
  quantity:      { type: Number, required: true, min: 1 },
  customization: { type: customizationSchema, default: {} },
}, { _id: false })

const addressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone:    { type: String, required: true },
  street:   { type: String, required: true },
  city:     { type: String, required: true },
  state:    { type: String, required: true },
  pincode:  { type: String, required: true },
}, { _id: false })

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [orderItemSchema],

  address: {
    type: addressSchema,
    required: true,
  },

  totalAmount: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  finalAmount: {
    type: Number,
    required: true,
  },

  couponCode: {
    type: String,
    default: null,
  },

  // Razorpay
  razorpayOrderId:   { type: String, default: null },
  razorpayPaymentId: { type: String, default: null },
  razorpaySignature: { type: String, default: null },

  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
  },

  orderStatus: {
    type: String,
    enum: [
      'Order Received',
      'In Kitchen',
      'Sent to Delivery',
      'Delivered',
      'Cancelled',
    ],
    default: 'Order Received',
  },

}, { timestamps: true })

const Order = mongoose.model('Order', orderSchema)
export default Order