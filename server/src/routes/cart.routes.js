import express from 'express'
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  syncCart
} from '../controllers/cart.controller.js'
import { protect } from '../middlewares/auth.js'

const router = express.Router()

router.use(protect) // Protect all cart routes

router
  .route('/')
  .get(getCart)
  .post(addToCart)

router.post('/sync', syncCart)

router
  .route('/:id')
  .put(updateCartItem)
  .delete(removeFromCart)

export default router
