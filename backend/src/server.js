import dotenv from 'dotenv'
import app from './app.js'

// Load environment variables
dotenv.config()

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => {
  console.log(`
┌──────────────────────────────────────────────┐
│  STYLEX API Server Initialized               │
│                                              │
│  ➜  Port:     ${PORT}                           │
│  ➜  Mode:     ${process.env.NODE_ENV}            │
│  ➜  Health:   http://localhost:${PORT}/api/health │
└──────────────────────────────────────────────┘
  `)
})

// Handle unhandled promise rejections gracefully
process.on('unhandledRejection', (err) => {
  console.error(`❌ Unhandled Rejection Error: ${err.message}`)
  // Close server & exit process
  server.close(() => process.exit(1))
})

// Handle uncaught exceptions gracefully
process.on('uncaughtException', (err) => {
  console.error(`❌ Uncaught Exception Error: ${err.message}`)
  // Close server & exit process
  server.close(() => process.exit(1))
})
