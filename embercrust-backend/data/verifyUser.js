import mongoose from 'mongoose'
import dotenv   from 'dotenv'
import User     from '../models/User.js'

dotenv.config()

const verifyUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ Connected')

    const email = 'priya@apollo.com' // ← change to your email

    const user = await User.findOneAndUpdate(
      { email },
      { isVerified: true, otp: null, otpExpiry: null },
      { new: true }
    )

    if (!user) {
      console.log('❌ User not found')
    } else {
      console.log(`✅ User verified: ${user.email}`)
      console.log(`   Name: ${user.name}`)
      console.log(`   Role: ${user.role}`)
    }

    process.exit()
  } catch (err) {
    console.error('❌ Error:', err)
    process.exit(1)
  }
}

verifyUser()