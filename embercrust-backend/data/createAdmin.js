import mongoose from 'mongoose'
import dotenv   from 'dotenv'
import User     from '../models/User.js'

dotenv.config()

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ Connected')

    const existing = await User.findOne({ email: 'admin@embercrust.com' })
    if (existing) {
      console.log('⚠️  Admin already exists!')
      console.log('   Email:    admin@embercrust.com')
      console.log('   Password: admin123')
      process.exit()
    }

    await User.create({
      name:       'EmberCrust Admin',
      email:      'admin@embercrust.com',
      password:   'admin123',
      role:       'admin',
      isVerified: true,
    })

    console.log('✅ Admin created!')
    console.log('   Email:    admin@embercrust.com')
    console.log('   Password: admin123')
    process.exit()
  } catch (err) {
    console.error('❌ Error:', err.message)
    process.exit(1)
  }
}

createAdmin()