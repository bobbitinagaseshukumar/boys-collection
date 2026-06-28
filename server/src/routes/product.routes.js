import express from 'express'
import {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/product.controller.js'
import { protect, authorize } from '../middlewares/auth.js'

const router = express.Router()

router
  .route('/')
  .get(getProducts)
  .post(protect, authorize('ADMIN'), createProduct)

router
  .route('/:slug')
  .get(getProductBySlug)

router
  .route('/:id')
  .put(protect, authorize('ADMIN'), updateProduct)
  .delete(protect, authorize('ADMIN'), deleteProduct)

export default router
