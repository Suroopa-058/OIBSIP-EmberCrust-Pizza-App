import jwt    from 'jsonwebtoken'
import crypto from 'crypto'
import User   from '../models/User.js'
import { sendOTPEmail } from '../data/emailService.js'

// ── Generate JWT ──────────────────────────────────
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  })
}

// ── Generate 6 digit OTP ──────────────────────────
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// ────────────────────────────────────────────────────
// @route  POST /api/auth/register
// @access Public
// ────────────────────────────────────────────────────
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' })
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' })
    }

    // Check if user exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' })
    }

    // Generate OTP
    const otp      = generateOTP()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 mins

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      otp,
      otpExpiry,
    })

    // Send OTP email
    try {
  await sendOTPEmail(email, otp, 'verify')
  console.log(`✅ OTP sent to ${email}`)
} catch (emailErr) {
  console.error('Email failed:', emailErr.message)
  console.log(`🔑 OTP for testing: ${otp}`)
}

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please verify your email.',
      email,
    })
  } catch (error) {
  console.error('Register error:', error.message)  // ← shows exact error
  res.status(500).json({ success: false, message: error.message || 'Server error' })
}
}

// ────────────────────────────────────────────────────
// @route  POST /api/auth/verify-otp
// @access Public
// ────────────────────────────────────────────────────
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: 'Email already verified' })
    }

    // Check OTP
    if (user.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' })
    }

    // Check expiry
    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ success: false, message: 'OTP has expired. Please register again.' })
    }

    // Mark verified
    user.isVerified = true
    user.otp        = null
    user.otpExpiry  = null
    await user.save()

    const token = generateToken(user._id)

    res.status(200).json({
      success: true,
      message: 'Email verified successfully!',
      token,
      user: {
        id:    user._id,
        name:  user.name,
        email: user.email,
        role:  user.role,
      },
    })
  } catch (error) {
    console.error('VerifyOTP error:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// ────────────────────────────────────────────────────
// @route  POST /api/auth/login
// @access Public
// ────────────────────────────────────────────────────
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' })
    }

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' })
    }

    // Check verified
    if (!user.isVerified) {
      return res.status(401).json({ success: false, message: 'Please verify your email first' })
    }

    // Check password
    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' })
    }

    const token = generateToken(user._id)

    res.status(200).json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id:    user._id,
        name:  user.name,
        email: user.email,
        role:  user.role,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// ────────────────────────────────────────────────────
// @route  POST /api/auth/forgot-password
// @access Public
// ────────────────────────────────────────────────────
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ success: false, message: 'No account found with this email' })
    }

    // Generate OTP
    const otp       = generateOTP()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 mins

    user.otp       = otp
    user.otpExpiry = otpExpiry
    await user.save()

    // Send OTP email
    await sendOTPEmail(email, otp, 'reset')

    res.status(200).json({
      success: true,
      message: 'Password reset OTP sent to your email.',
      email,
    })
  } catch (error) {
    console.error('ForgotPassword error:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// ────────────────────────────────────────────────────
// @route  POST /api/auth/reset-password
// @access Public
// ────────────────────────────────────────────────────
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'All fields are required' })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    // Check OTP
    if (user.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' })
    }

    // Check expiry
    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ success: false, message: 'OTP has expired. Please try again.' })
    }

    // Update password
    user.password  = newPassword
    user.otp       = null
    user.otpExpiry = null
    await user.save()

    res.status(200).json({
      success: true,
      message: 'Password reset successful! Please login.',
    })
  } catch (error) {
    console.error('ResetPassword error:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// ────────────────────────────────────────────────────
// @route  GET /api/auth/me
// @access Private
// ────────────────────────────────────────────────────
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -otp -otpExpiry')
    res.status(200).json({ success: true, user })
  } catch (error) {
    console.error('GetMe error:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}