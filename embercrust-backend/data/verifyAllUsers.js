import mongoose from 'mongoose'
import dotenv   from 'dotenv'
import User     from '../models/User.js'

dotenv.config()

const verifyAll = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ Connected')

    const result = await User.updateMany(
      { isVerified: false },
      { isVerified: true, otp: null, otpExpiry: null }
    )

    console.log(`✅ Verified ${result.modifiedCount} users!`)
    process.exit()
  } catch (err) {
    console.error('❌ Error:', err)
    process.exit(1)
  }
}

verifyAll()