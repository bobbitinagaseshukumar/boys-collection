import jwt from 'jsonwebtoken'
import prisma from '../config/db.js'

export const protect = async (req, res, next) => {
  try {
    let token

    // Check authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1]
    } 
    // Check cookies
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token required.'
      })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true
      }
    })

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists.'
      })
    }

    // Attach user to request
    req.user = user
    next()
  } catch (error) {
    console.error('Auth Middleware Error:', error)
    return res.status(401).json({
      success: false,
      message: 'Not authorized, invalid token.'
    })
  }
}

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role ${req.user?.role || 'Guest'} is not authorized to access this route.`
      })
    }
    next()
  }
}
