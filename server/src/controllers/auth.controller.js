import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import prisma from '../config/db.js'
import { ErrorResponse } from '../middlewares/error.js'

// Helper: Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  })
}

// Helper: Send Token response in cookie + json
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user.id)

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  }

  // Remove password from response
  const { password: _password, ...userWithoutPassword } = user

  res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .json({
      success: true,
      token,
      user: userWithoutPassword
    })
}

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body

    if (!name || !email || !password) {
      return next(new ErrorResponse('Please provide name, email and password.', 400))
    }

    // Check if user exists
    const userExists = await prisma.user.findUnique({
      where: { email }
    })

    if (userExists) {
      return next(new ErrorResponse('User already registered with this email.', 400))
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone
      }
    })

    sendTokenResponse(user, 210, res)
  } catch (error) {
    next(error)
  }
}

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return next(new ErrorResponse('Please provide email and password.', 400))
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return next(new ErrorResponse('Invalid credentials.', 401))
    }

    // Match password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials.', 401))
    }

    sendTokenResponse(user, 200, res)
  } catch (error) {
    next(error)
  }
}

// @desc    Logout user / clear cookie
// @route   GET /api/auth/logout
// @access  Public
export const logout = async (req, res, next) => {
  try {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    })

    res.status(200).json({
      success: true,
      message: 'Logged out successfully.'
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        avatar: true,
        createdAt: true
      }
    })

    res.status(200).json({
      success: true,
      data: user
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Send 6-digit OTP code to email
// @route   POST /api/auth/send-otp
// @access  Public
export const sendOTP = async (req, res, next) => {
  try {
    const { email } = req.body

    if (!email) {
      return next(new ErrorResponse('Please provide an email address.', 400))
    }

    // Generate 6 digit code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes expiry

    // Save in database
    await prisma.oTP.create({
      data: {
        email,
        code: otpCode,
        expiresAt
      }
    })

    // Setup nodemailer transport
    const mailConfigured = 
      process.env.SMTP_HOST && 
      process.env.SMTP_USER && 
      process.env.SMTP_PASS

    if (mailConfigured) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT) || 587,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      })

      const mailOptions = {
        from: `STYLEX <${process.env.FROM_EMAIL || 'noreply@stylex.in'}>`,
        to: email,
        subject: 'STYLEX Account Verification OTP',
        html: `
          <div style="font-family: 'Outfit', sans-serif; background-color: #0a0a0f; color: #e8e8f0; padding: 30px; border-radius: 12px; max-width: 500px; margin: 0 auto; border: 1px solid rgba(212,175,55,0.1);">
            <h2 style="color: #d4af37; text-align: center; letter-spacing: 2px;">STYLEX Verification</h2>
            <p>Welcome to STYLEX. Use the code below to verify your account. It is valid for 10 minutes.</p>
            <div style="background-color: rgba(255,255,255,0.04); padding: 15px; text-align: center; border-radius: 8px; border: 1px dashed rgba(212,175,55,0.3); margin: 25px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #d4af37;">${otpCode}</span>
            </div>
            <p style="font-size: 11px; color: rgba(255,255,255,0.3); text-align: center;">If you didn't request this code, you can ignore this email.</p>
          </div>
        `
      }

      await transporter.sendMail(mailOptions)
      console.log(`✉️ Email OTP sent to: ${email}`)
    } else {
      console.log(`✉️ [Mock Email OTP] to: ${email} -> CODE: ${otpCode}`)
    }

    res.status(200).json({
      success: true,
      message: 'OTP code sent to email successfully.',
      // Only returning OTP in development/mock situations for easier testing
      ...(mailConfigured ? {} : { mockOtp: otpCode })
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Verify 6-digit OTP code
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOTP = async (req, res, next) => {
  try {
    const { email, code } = req.body

    if (!email || !code) {
      return next(new ErrorResponse('Please provide email and OTP code.', 400))
    }

    // Find latest OTP for this email
    const otp = await prisma.oTP.findFirst({
      where: {
        email,
        code,
        verified: false,
        expiresAt: { gte: new Date() }
      },
      orderBy: { createdAt: 'desc' }
    })

    if (!otp) {
      return next(new ErrorResponse('Invalid or expired OTP code.', 400))
    }

    // Mark as verified
    await prisma.oTP.update({
      where: { id: otp.id },
      data: { verified: true }
    })

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully.'
    })
  } catch (error) {
    next(error)
  }
}
