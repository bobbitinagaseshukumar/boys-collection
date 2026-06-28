import prisma from '../config/db.js'
import { ErrorResponse } from '../middlewares/error.js'

// @desc    Get user cart items
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res, next) => {
  try {
    const cartItems = await prisma.cartItem.findMany({
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
      count: cartItems.length,
      data: cartItems
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addToCart = async (req, res, next) => {
  try {
    const { productId, size, color, quantity = 1 } = req.body
    const userId = req.user.id

    if (!productId || !size || !color) {
      return next(new ErrorResponse('Please provide productId, size, and color.', 400))
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) }
    })

    if (!product) {
      return next(new ErrorResponse('Product not found.', 404))
    }

    // Check if item already exists in user's cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        userId,
        productId: parseInt(productId),
        size,
        color
      }
    })

    let cartItem
    if (existingItem) {
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + parseInt(quantity) },
        include: { product: true }
      })
    } else {
      cartItem = await prisma.cartItem.create({
        data: {
          userId,
          productId: parseInt(productId),
          size,
          color,
          quantity: parseInt(quantity)
        },
        include: { product: true }
      })
    }

    res.status(200).json({
      success: true,
      message: 'Item added to cart.',
      data: cartItem
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update cart item quantity
// @route   PUT /api/cart/:id
// @access  Private
export const updateCartItem = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const { quantity } = req.body
    const userId = req.user.id

    if (!quantity || quantity < 1) {
      return next(new ErrorResponse('Quantity must be 1 or more.', 400))
    }

    const item = await prisma.cartItem.findUnique({
      where: { id }
    })

    if (!item) {
      return next(new ErrorResponse('Cart item not found.', 404))
    }

    if (item.userId !== userId) {
      return next(new ErrorResponse('Not authorized to modify this item.', 403))
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id },
      data: { quantity: parseInt(quantity) },
      include: { product: true }
    })

    res.status(200).json({
      success: true,
      message: 'Cart quantity updated.',
      data: updatedItem
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Remove item from cart
// @route   DELETE /api/cart/:id
// @access  Private
export const removeFromCart = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const userId = req.user.id

    const item = await prisma.cartItem.findUnique({
      where: { id }
    })

    if (!item) {
      return next(new ErrorResponse('Cart item not found.', 404))
    }

    if (item.userId !== userId) {
      return next(new ErrorResponse('Not authorized to delete this item.', 403))
    }

    await prisma.cartItem.delete({
      where: { id }
    })

    res.status(200).json({
      success: true,
      message: 'Item removed from cart.'
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Sync local cart on login
// @route   POST /api/cart/sync
// @access  Private
export const syncCart = async (req, res, next) => {
  try {
    const { items = [] } = req.body // [{productId, size, color, quantity}]
    const userId = req.user.id

    for (const item of items) {
      const existing = await prisma.cartItem.findFirst({
        where: {
          userId,
          productId: parseInt(item.productId),
          size: item.size,
          color: item.color
        }
      })

      if (existing) {
        await prisma.cartItem.update({
          where: { id: existing.id },
          data: { quantity: Math.max(existing.quantity, item.quantity) }
        })
      } else {
        await prisma.cartItem.create({
          data: {
            userId,
            productId: parseInt(item.productId),
            size: item.size,
            color: item.color,
            quantity: item.quantity
          }
        })
      }
    }

    const fullCart = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true }
    })

    res.status(200).json({
      success: true,
      message: 'Cart synced successfully.',
      data: fullCart
    })
  } catch (error) {
    next(error)
  }
}
