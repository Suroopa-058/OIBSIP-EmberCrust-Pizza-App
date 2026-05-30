import mongoose from 'mongoose'
import dotenv   from 'dotenv'
import User     from '../models/User.js'

dotenv.config()

const listUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ Connected')

    const users = await User.find().select('name email role isVerified createdAt')

    if (users.length === 0) {
      console.log('❌ No users found in database')
    } else {
      console.log(`\n📋 Found ${users.length} user(s):\n`)
      users.forEach((u, i) => {
        console.log(`${i + 1}. Name:       ${u.name}`)
        console.log(`   Email:      ${u.email}`)
        console.log(`   Role:       ${u.role}`)
        console.log(`   Verified:   ${u.isVerified}`)
        console.log(`   Created:    ${u.createdAt}`)
        console.log('   ─────────────────────────')
      })
    }

    process.exit()
  } catch (err) {
    console.error('❌ Error:', err)
    process.exit(1)
  }
}

listUsers()