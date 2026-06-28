import express from 'express'
import {
  register,
  login,
  logout,
  getMe,
  sendOTP,
  verifyOTP
} from '../controllers/auth.controller.js'
import { protect } from '../middlewares/auth.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/logout', logout)
router.get('/me', protect, getMe)
router.post('/send-otp', sendOTP)
router.post('/verify-otp', verifyOTP)

export default router
