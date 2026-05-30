// import express   from 'express'
// import cors      from 'cors'
// import dotenv    from 'dotenv'
// import connectDB from './config/db.js'
// import authRoutes from './routes/authRoutes.js'
// import pizzaRoutes from './routes/pizzaRoutes.js'
// import cartRoutes from './routes/cartRoutes.js'
// import orderRoutes from './routes/orderRoutes.js'
// import paymentRoutes from './routes/paymentRoutes.js'
// import couponRoutes  from './routes/couponRoutes.js'
// dotenv.config()
// connectDB()

// const app = express()

// app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
// app.use(express.json())
// app.use('/api/auth', authRoutes)
// app.use('/api/pizzas', pizzaRoutes)
// app.use('/api/cart', cartRoutes)
// app.use('/api/orders', orderRoutes)
// app.use('/api/payment', paymentRoutes)
// app.use('/api/coupon',  couponRoutes)
// // Health check
// app.get('/api/health', (req, res) => {
//   res.json({ status: '🔥 EmberCrust backend running!' })
// })

// // 404 handler
// app.use((req, res) => {
//   res.status(404).json({ success: false, message: 'Route not found' })
// })

// // Global error handler
// app.use((err, req, res, next) => {
//   console.error(err.stack)
//   res.status(500).json({ success: false, message: err.message || 'Server Error' })
// })

// const PORT = process.env.PORT || 5000
// app.listen(PORT, () => {
//   console.log(`🔥 EmberCrust server running at http://localhost:${PORT}`)
// })
import express        from 'express'
import cors           from 'cors'
import dotenv         from 'dotenv'
import connectDB      from './config/db.js'
import authRoutes     from './routes/authRoutes.js'
import pizzaRoutes    from './routes/pizzaRoutes.js'
import cartRoutes     from './routes/cartRoutes.js'
import orderRoutes    from './routes/orderRoutes.js'
import paymentRoutes  from './routes/paymentRoutes.js'
import couponRoutes   from './routes/couponRoutes.js'

dotenv.config()
connectDB()

const app = express()

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
app.use(express.json())

app.use('/api/auth',    authRoutes)
app.use('/api/pizzas',  pizzaRoutes)
app.use('/api/cart',    cartRoutes)
app.use('/api/orders',  orderRoutes)
app.use('/api/payment', paymentRoutes)
app.use('/api/coupon',  couponRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: '🔥 EmberCrust backend running!' })
})

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ success: false, message: err.message || 'Server Error' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🔥 EmberCrust server running at http://localhost:${PORT}`)
})