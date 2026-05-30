import mongoose from 'mongoose'

const customizationSchema = new mongoose.Schema({
  base:    { type: String, default: '' },
  sauce:   { type: String, default: '' },
  cheese:  { type: String, default: '' },
  veggies: { type: [String], default: [] },
}, { _id: false })

const cartItemSchema = new mongoose.Schema({
  pizza: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pizza',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  customization: {
    type: customizationSchema,
    default: {},
  },
  price: {
    type: Number,
    required: true,
  },
}, { _id: true })

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  items: [cartItemSchema],
  totalAmount: {
    type: Number,
    default: 0,
  },
}, { timestamps: true })

// Auto calculate total before saving
cartSchema.pre('save', function (next) {
  this.totalAmount = this.items.reduce((total, item) => {
    return total + item.price * item.quantity
  }, 0)
  next()
})

const Cart = mongoose.model('Cart', cartSchema)
export default Cart