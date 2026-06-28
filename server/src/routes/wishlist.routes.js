import express from 'express'
import {
  getWishlist,
  toggleWishlist
} from '../controllers/wishlist.controller.js'
import { protect } from '../middlewares/auth.js'

const router = express.Router()

router.use(protect) // Protect all wishlist routes

router.get('/', getWishlist)
router.post('/toggle', toggleWishlist)

export default router
