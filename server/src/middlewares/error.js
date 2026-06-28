export class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
  }
}

export const errorHandler = (err, req, res, next) => {
  let error = { ...err }
  error.message = err.message

  // Log to console for development
  if (process.env.NODE_ENV === 'development') {
    console.error(err)
  }

  // Prisma unique constraint violation (Error P2002)
  if (err.code === 'P2002') {
    const fields = err.meta?.target || ['field']
    const message = `Duplicate value entered for field(s): ${fields.join(', ')}`
    error = new ErrorResponse(message, 400)
  }

  // Prisma record not found (Error P2025)
  if (err.code === 'P2025') {
    const message = err.meta?.cause || 'Resource not found'
    error = new ErrorResponse(message, 404)
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new ErrorResponse('Invalid signature or token.', 401)
  }

  if (err.name === 'TokenExpiredError') {
    error = new ErrorResponse('Token expired. Please login again.', 401)
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Internal Server Error'
  })
}
