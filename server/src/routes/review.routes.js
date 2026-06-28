import express from 'express'
import {
  getProductReviews,
  createReview,
  deleteReview
} from '../controllers/review.controller.js'
import { protect } from '../middlewares/auth.js'

const router = express.Router()

router
  .route('/product/:productId')
  .get(getProductReviews)
  .post(protect, createReview)

router
  .route('/:id')
  .delete(protect, deleteReview)

export default router
