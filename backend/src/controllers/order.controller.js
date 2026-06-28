import Razorpay from 'razorpay'
import crypto from 'crypto'
import prisma from '../config/db.js'
import { ErrorResponse } from '../middlewares/error.js'

// Setup Razorpay client conditionally
let razorpay = null
const isRazorpayConfigured = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET

if (isRazorpayConfigured) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  })
}

// @desc    Create checkout order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res, next) => {
  try {
    const { items, address, paymentMethod, couponCode } = req.body
    const userId = req.user.id

    if (!items || items.length === 0) {
      return next(new ErrorResponse('Please provide cart items.', 400))
    }

    if (!address) {
      return next(new ErrorResponse('Please provide a shipping address.', 400))
    }

    if (!paymentMethod) {
      return next(new ErrorResponse('Please specify a payment method.', 400))
    }

    // Generate unique order number
    const orderNumber = 'STX-' + Date.now().toString() + Math.floor(1000 + Math.random() * 9000).toString()

    // Retrieve product records to ensure price accuracy (security best practice)
    let totalAmount = 0
    const orderItemsToCreate = []

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: parseInt(item.productId) }
      })

      if (!product) {
        return next(new ErrorResponse(`Product not found for ID: ${item.productId}`, 404))
      }

      if (product.stock < item.quantity) {
        return next(new ErrorResponse(`Insufficient stock for product: ${product.title}`, 400))
      }

      const itemTotal = product.price * item.quantity
      totalAmount += itemTotal

      orderItemsToCreate.push({
        productId: product.id,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        price: product.price
      })
    }

    // Apply Coupon discount if applicable
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode, active: true }
      })

      if (coupon && coupon.endDate > new Date() && totalAmount >= coupon.minOrder) {
        let discountVal = (totalAmount * coupon.discount) / 100
        if (coupon.maxDiscount) {
          discountVal = Math.min(discountVal, coupon.maxDiscount)
        }
        totalAmount = Math.max(0, totalAmount - discountVal)
      }
    }

    // Add shipping charges (Free above 2000)
    const shippingCharge = totalAmount >= 2000 ? 0 : 199
    totalAmount += shippingCharge

    // Transaction to create the order, orderItems, shipping address, and decrement stock
    const dbOrder = await prisma.$transaction(async (tx) => {
      // 1. Create the order
      const order = await tx.order.create({
        data: {
          orderNumber,
          totalAmount,
          userId,
          paymentMethod: paymentMethod.toUpperCase(),
          status: 'PENDING',
          paymentStatus: paymentMethod.toUpperCase() === 'COD' ? 'PENDING' : 'PENDING'
        }
      })

      // 2. Create order items
      await tx.orderItem.createMany({
        data: orderItemsToCreate.map(item => ({
          ...item,
          orderId: order.id
        }))
      })

      // 3. Create shipping address
      await tx.shippingAddress.create({
        data: {
          orderId: order.id,
          name: address.name,
          phone: address.phone,
          address: address.address,
          city: address.city,
          state: address.state,
          pincode: address.pincode
        }
      })

      // 4. Update product stock levels
      for (const item of orderItemsToCreate) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        })
      }

      // 5. Clear user cart items
      await tx.cartItem.deleteMany({
        where: { userId }
      })

      return order
    })

    // If payment method is COD, order creation is complete
    if (paymentMethod.toUpperCase() === 'COD') {
      return res.status(201).json({
        success: true,
        message: 'Order created successfully with Cash on Delivery.',
        data: dbOrder
      })
    }

    // If prepaid (UPI/CARD), initiate Razorpay order
    let razorpayOrderPayload = null

    if (isRazorpayConfigured) {
      const options = {
        amount: Math.round(totalAmount * 100), // Razorpay amount in paise
        currency: 'INR',
        receipt: dbOrder.orderNumber.toString()
      }

      try {
        const rzOrder = await razorpay.orders.create(options)
        razorpayOrderPayload = {
          id: rzOrder.id,
          currency: rzOrder.currency,
          amount: rzOrder.amount
        }

        // Save Razorpay order ID to Payments log
        await prisma.payment.create({
          data: {
            orderId: dbOrder.id,
            transactionId: rzOrder.id,
            amount: totalAmount,
            status: 'INITIATED'
          }
        })
      } catch (rzErr) {
        console.error('Razorpay Order Creation Error:', rzErr)
        // Rollback is complex here, let's keep database order and let user retry payment
      }
    } else {
      // Mock payment payload if Razorpay is not configured
      razorpayOrderPayload = {
        id: 'rzp_mock_' + Math.random().toString(36).substring(2, 10),
        currency: 'INR',
        amount: Math.round(totalAmount * 100),
        isMock: true
      }
      console.warn('⚠️ Razorpay not configured. Returning mock gateway payload.')
    }

    res.status(201).json({
      success: true,
      message: 'Order created. Payment gateway initiated.',
      data: dbOrder,
      razorpay: razorpayOrderPayload
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Verify Razorpay payment status
// @route   POST /api/orders/verify-payment
// @access  Private
export const verifyPayment = async (req, res, next) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = req.body

    if (!orderId) {
      return next(new ErrorResponse('Please provide orderId.', 400))
    }

    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId) }
    })

    if (!order) {
      return next(new ErrorResponse('Order not found.', 404))
    }

    // Verify mock payments directly
    if (razorpayOrderId?.startsWith('rzp_mock_') || !isRazorpayConfigured) {
      await prisma.$transaction([
        prisma.order.update({
          where: { id: order.id },
          data: { paymentStatus: 'PAID', status: 'PROCESSING' }
        }),
        prisma.payment.create({
          data: {
            orderId: order.id,
            transactionId: razorpayPaymentId || 'pay_mock_' + Math.random().toString(36).substring(2, 10),
            amount: order.totalAmount,
            status: 'COMPLETED'
          }
        })
      ])

      return res.status(200).json({
        success: true,
        message: 'Mock payment verified and processed successfully.'
      })
    }

    // Verify cryptographic signature for production Razorpay gateways
    const text = razorpayOrderId + '|' + razorpayPaymentId
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex')

    const isValid = generatedSignature === razorpaySignature

    if (!isValid) {
      await prisma.order.update({
        where: { id: order.id },
        data: { paymentStatus: 'FAILED' }
      })
      return next(new ErrorResponse('Payment verification failed. Invalid signature.', 400))
    }

    // Successful Transaction Update
    await prisma.$transaction([
      prisma.order.update({
        where: { id: order.id },
        data: { paymentStatus: 'PAID', status: 'PROCESSING' }
      }),
      prisma.payment.updateMany({
        where: { transactionId: razorpayOrderId },
        data: {
          transactionId: razorpayPaymentId,
          status: 'COMPLETED'
        }
      })
    ])

    res.status(200).json({
      success: true,
      message: 'Payment verified and order processed successfully.'
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get current user order history
// @route   GET /api/orders
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                title: true,
                images: { take: 1 }
              }
            }
          }
        },
        address: true
      },
      orderBy: { createdAt: 'desc' }
    })

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get details of a single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrderDetails = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            product: true
          }
        },
        address: true,
        payments: true
      }
    })

    if (!order) {
      return next(new ErrorResponse('Order not found.', 404))
    }

    // Authorize: Owner of order or Admin
    if (order.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return next(new ErrorResponse('Not authorized to access this order detail.', 403))
    }

    res.status(200).json({
      success: true,
      data: order
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const { status } = req.body

    const validStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']
    if (!validStatuses.includes(status.toUpperCase())) {
      return next(new ErrorResponse('Invalid status type.', 400))
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status: status.toUpperCase() }
    })

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully.',
      data: order
    })
  } catch (error) {
    next(error)
  }
}
