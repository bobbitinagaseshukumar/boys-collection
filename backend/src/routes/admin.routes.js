import express from 'express'
import {
  getDashboardStats,
  getAnalyticsData,
  getCustomersAdmin,
  exportBackup,
  importBackup
} from '../controllers/admin.controller.js'
import { protect, authorize } from '../middlewares/auth.js'

const router = express.Router()

router.use(protect)
router.use(authorize('ADMIN'))

router.get('/stats', getDashboardStats)
router.get('/analytics', getAnalyticsData)
router.get('/customers', getCustomersAdmin)
router.get('/backup/export', exportBackup)
router.post('/backup/import', importBackup)

export default router
