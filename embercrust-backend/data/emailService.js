import nodemailer from 'nodemailer'

// Check if email is configured
const isEmailConfigured = 
  process.env.EMAIL_USER && 
  process.env.EMAIL_PASS &&
  process.env.EMAIL_USER !== 'your_gmail@gmail.com' &&
  process.env.EMAIL_PASS !== 'your_gmail_app_password'

const transporter = isEmailConfigured
  ? nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })
  : null

// Send OTP email
export const sendOTPEmail = async (email, otp, type = 'verify') => {
  if (!isEmailConfigured) {
    console.log(`📧 Email not configured — skipping email`)
    console.log(`🔑 OTP for ${email}: ${otp}`)
    return
  }

  const subject = type === 'verify'
    ? '🔥 EmberCrust — Verify Your Email'
    : '🔥 EmberCrust — Reset Your Password'

  const message = type === 'verify'
    ? 'Welcome to EmberCrust! Your verification OTP is:'
    : 'Your password reset OTP is:'

  await transporter.sendMail({
    from:    `"EmberCrust 🔥" <${process.env.EMAIL_USER}>`,
    to:      email,
    subject,
    html: `
      <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:32px;background:#fdf8f2;border-radius:16px;border:1px solid #e8ddd0;">
        <h2 style="color:#2e1a0a;">🔥 EmberCrust</h2>
        <p style="color:#7a4820;">${message}</p>
        <div style="background:#e06020;color:#fff;font-size:36px;font-weight:900;letter-spacing:12px;text-align:center;padding:20px;border-radius:12px;margin:20px 0;">
          ${otp}
        </div>
        <p style="color:#c4a882;font-size:13px;">This OTP expires in <strong>10 minutes</strong>.</p>
      </div>
    `,
  })
}

// Send order confirmation email
export const sendOrderConfirmationEmail = async (email, name, orderId, total) => {
  if (!isEmailConfigured) {
    console.log(`📧 Order confirmation skipped — email not configured`)
    console.log(`   Order: ${orderId} | Total: ₹${total}`)
    return
  }

  await transporter.sendMail({
    from:    `"EmberCrust 🔥" <${process.env.EMAIL_USER}>`,
    to:      email,
    subject: '🔥 EmberCrust — Order Confirmed!',
    html: `
      <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:32px;background:#fdf8f2;border-radius:16px;border:1px solid #e8ddd0;">
        <h2 style="color:#2e1a0a;">🔥 Order Confirmed!</h2>
        <p style="color:#7a4820;">Hi <strong>${name}</strong>, your order has been placed!</p>
        <div style="background:#efe6d8;border-radius:12px;padding:16px;margin:20px 0;">
          <p style="color:#2e1a0a;margin:0;"><strong>Order ID:</strong> ${orderId}</p>
          <p style="color:#2e1a0a;margin:8px 0 0;"><strong>Total:</strong> ₹${total}</p>
        </div>
        <p style="color:#7a4820;">Track your order from your dashboard.</p>
      </div>
    `,
  })
}

// Send order status update email
export const sendOrderStatusEmail = async (email, name, orderId, status) => {
  if (!isEmailConfigured) {
    console.log(`📧 Status email skipped — email not configured`)
    console.log(`   Order: ${orderId} | Status: ${status}`)
    return
  }

  await transporter.sendMail({
    from:    `"EmberCrust 🔥" <${process.env.EMAIL_USER}>`,
    to:      email,
    subject: `🔥 EmberCrust — Order Update: ${status}`,
    html: `
      <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:32px;background:#fdf8f2;border-radius:16px;border:1px solid #e8ddd0;">
        <h2 style="color:#2e1a0a;">🔥 Order Status Updated</h2>
        <p style="color:#7a4820;">Hi <strong>${name}</strong>, your order status has been updated!</p>
        <div style="background:#e06020;color:#fff;text-align:center;padding:16px;border-radius:12px;margin:20px 0;font-size:18px;font-weight:700;">
          ${status}
        </div>
        <p style="color:#7a4820;"><strong>Order ID:</strong> ${orderId}</p>
      </div>
    `,
  })
}

// Send low stock alert to admin
export const sendLowStockEmail = async (pizzaName) => {
  if (!isEmailConfigured) {
    console.log(`⚠️ Low stock alert skipped — email not configured`)
    console.log(`   Pizza: ${pizzaName}`)
    return
  }

  await transporter.sendMail({
    from:    `"EmberCrust 🔥" <${process.env.EMAIL_USER}>`,
    to:      process.env.EMAIL_USER,
    subject: '⚠️ EmberCrust — Low Stock Alert',
    html: `
      <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:32px;background:#fdf8f2;border-radius:16px;border:1px solid #e8ddd0;">
        <h2 style="color:#dc2626;">⚠️ Low Stock Alert</h2>
        <p style="color:#7a4820;">This pizza is running low:</p>
        <div style="background:#efe6d8;border-radius:12px;padding:16px;margin:20px 0;">
          <p style="color:#2e1a0a;font-weight:700;font-size:18px;margin:0;">${pizzaName}</p>
        </div>
        <p style="color:#7a4820;">Update inventory from admin dashboard.</p>
      </div>
    `,
  })
}