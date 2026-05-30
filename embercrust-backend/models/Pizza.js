import mongoose from 'mongoose'

const pizzaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Pizza name is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  image: {
    type: String,
    required: [true, 'Image URL is required'],
  },
  category: {
    type: String,
    enum: ['classic', 'spicy', 'veg', 'premium', 'seafood'],
    required: [true, 'Category is required'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0,
  },
  rating: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5,
  },
  ratingCount: {
    type: Number,
    default: 0,
  },
  isVeg: {
    type: Boolean,
    default: false,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  isPopular: {
    type: Boolean,
    default: false,
  },
  tag: {
    type: String,
    default: '',
  },
  stock: {
    type: Number,
    default: 50,
    min: 0,
  },
  deliveryTime: {
    type: Number,
    default: 28,
  },
}, { timestamps: true })

const Pizza = mongoose.model('Pizza', pizzaSchema)
export default Pizza