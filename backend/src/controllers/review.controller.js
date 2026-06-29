import prisma from '../config/db.js'
import { ErrorResponse } from '../middlewares/error.js'

// Helper function to update product average rating
const updateProductRating = async (productId) => {
  const stats = await prisma.review.aggregate({
    where: { productId },
    _avg: { rating: true },
    _count: { id: true }
  })

  await prisma.product.update({
    where: { id: productId },
    data: {
      rating: stats._avg.rating || 0,
      reviewCount: stats._count.id || 0
    }
  })
}

// @desc    Get all reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
export const getProductReviews = async (req, res, next) => {
  try {
    const productId = parseInt(req.params.productId)

    const reviews = await prisma.review.findMany({
      where: { productId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Create a product review
// @route   POST /api/reviews/product/:productId
// @access  Private
export const createReview = async (req, res, next) => {
  try {
    const productId = parseInt(req.params.productId)
    const userId = req.user.id
    const { rating, comment } = req.body

    if (!rating || !comment) {
      return next(new ErrorResponse('Please provide a rating and a comment.', 400))
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return next(new ErrorResponse('Product not found.', 404))
    }

    // Verify purchase eligibility
    const hasOrder = await prisma.order.findFirst({
      where: {
        userId,
        orderItems: {
          some: { productId }
        },
        OR: [
          { paymentStatus: 'PAID' },
          { status: { in: ['DELIVERED', 'SHIPPED', 'PROCESSING'] } }
        ]
      }
    })

    let hasWhatsAppOrder = false
    if (!hasOrder && req.user.phone) {
      const waOrder = await prisma.whatsAppOrder.findFirst({
        where: {
          phoneNumber: req.user.phone,
          productName: product.title,
          status: 'Completed'
        }
      })
      if (waOrder) {
        hasWhatsAppOrder = true
      }
    }

    if (!hasOrder && !hasWhatsAppOrder) {
      return next(new ErrorResponse('Only verified buyers who completed their purchase can review this product.', 403))
    }

    // Check if user already reviewed this product
    const existingReview = await prisma.review.findFirst({
      where: { productId, userId }
    })

    let review
    if (existingReview) {
      // Update existing review
      review = await prisma.review.update({
        where: { id: existingReview.id },
        data: { rating: parseFloat(rating), comment }
      })
    } else {
      // Create new review
      review = await prisma.review.create({
        data: {
          rating: parseFloat(rating),
          comment,
          userId,
          productId
        }
      })
    }

    // Update product rating stats
    await updateProductRating(productId)

    res.status(201).json({
      success: true,
      message: existingReview ? 'Review updated successfully.' : 'Review created successfully.',
      data: review
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const userId = req.user.id
    const userRole = req.user.role

    const review = await prisma.review.findUnique({
      where: { id }
    })

    if (!review) {
      return next(new ErrorResponse('Review not found.', 404))
    }

    // Only owner of review or Admin can delete
    if (review.userId !== userId && userRole !== 'ADMIN') {
      return next(new ErrorResponse('Not authorized to delete this review.', 403))
    }

    await prisma.review.delete({
      where: { id }
    })

    // Update product rating stats
    await updateProductRating(review.productId)

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully.'
    })
  } catch (error) {
    next(error)
  }
}
