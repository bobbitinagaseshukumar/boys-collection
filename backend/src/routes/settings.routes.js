import express from 'express'
import { getSettings, updateSettings } from '../controllers/settings.controller.js'
import { protect, authorize } from '../middlewares/auth.js'

const router = express.Router()

router.get('/', getSettings)
router.put('/', protect, authorize('ADMIN'), updateSettings)

export default router
