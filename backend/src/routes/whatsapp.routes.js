import express from 'express'
import {
  logWhatsAppOrder,
  getWhatsAppOrders,
  updateWhatsAppOrderStatus
} from '../controllers/whatsapp.controller.js'
import { protect, authorize } from '../middlewares/auth.js'

const router = express.Router()

// Log click (public)
router.post('/whatsapp', logWhatsAppOrder)

// Admin views (protected)
router.get('/admin/whatsapp', protect, authorize('ADMIN'), getWhatsAppOrders)
router.put('/admin/whatsapp/:id/status', protect, authorize('ADMIN'), updateWhatsAppOrderStatus)

export default router
