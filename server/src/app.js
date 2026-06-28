import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'

// Import Middlewares
import { errorHandler } from './middlewares/error.js'

// Import Routes
import authRoutes from './routes/auth.routes.js'
import productRoutes from './routes/product.routes.js'
import categoryRoutes from './routes/category.routes.js'
import cartRoutes from './routes/cart.routes.js'
import wishlistRoutes from './routes/wishlist.routes.js'
import orderRoutes from './routes/order.routes.js'
import reviewRoutes from './routes/review.routes.js'

const app = express()

// Global Security Headers
app.use(helmet())

// CORS configuration (Premium cross-origin allowances)
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'], // Vite standard client ports
    credentials: true
  })
)

// Request Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Body Parsers
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Mount API routes
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/wishlist', wishlistRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/reviews', reviewRoutes)

// Welcome / Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'STYLEX API server is running in peak condition.'
  })
})

// Centralized Global Error Handler Middleware
app.use(errorHandler)

export default app
