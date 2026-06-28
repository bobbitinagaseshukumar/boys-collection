import express from 'express'
import {
  createOrder,
  verifyPayment,
  getMyOrders,
  getOrderDetails,
  updateOrderStatus
} from '../controllers/order.controller.js'
import { protect, authorize } from '../middlewares/auth.js'

const router = express.Router()

router.use(protect) // All order routes require authentication

router
  .route('/')
  .post(createOrder)
  .get(getMyOrders)

router.post('/verify-payment', verifyPayment)

router.route('/:id').get(getOrderDetails)

router.route('/:id/status').put(authorize('ADMIN'), updateOrderStatus)

export default router
