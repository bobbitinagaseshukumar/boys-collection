import prisma from '../config/db.js'
import { ErrorResponse } from '../middlewares/error.js'

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
export const getWishlist = async (req, res, next) => {
  try {
    const wishlist = await prisma.wishlistItem.findMany({
      where: { userId: req.user.id },
      include: {
        product: {
          include: {
            images: { take: 1 }
          }
        }
      }
    })

    res.status(200).json({
      success: true,
      count: wishlist.length,
      data: wishlist
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Toggle wishlist item (Add or Remove)
// @route   POST /api/wishlist/toggle
// @access  Private
export const toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body
    const userId = req.user.id

    if (!productId) {
      return next(new ErrorResponse('Please provide a productId.', 400))
    }

    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) }
    })

    if (!product) {
      return next(new ErrorResponse('Product not found.', 404))
    }

    const existingItem = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId: parseInt(productId)
        }
      }
    })

    if (existingItem) {
      // Remove
      await prisma.wishlistItem.delete({
        where: { id: existingItem.id }
      })
      res.status(200).json({
        success: true,
        message: 'Product removed from wishlist.',
        added: false
      })
    } else {
      // Add
      const newItem = await prisma.wishlistItem.create({
        data: {
          userId,
          productId: parseInt(productId)
        },
        include: { product: true }
      })
      res.status(200).json({
        success: true,
        message: 'Product added to wishlist.',
        added: true,
        data: newItem
      })
    }
  } catch (error) {
    next(error)
  }
}
