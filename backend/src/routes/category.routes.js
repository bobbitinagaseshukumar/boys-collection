import express from 'express'
import {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/category.controller.js'
import { protect, authorize } from '../middlewares/auth.js'

const router = express.Router()

router
  .route('/')
  .get(getCategories)
  .post(protect, authorize('ADMIN'), createCategory)

router
  .route('/:slug')
  .get(getCategoryBySlug)

router
  .route('/:id')
  .put(protect, authorize('ADMIN'), updateCategory)
  .delete(protect, authorize('ADMIN'), deleteCategory)

export default router
