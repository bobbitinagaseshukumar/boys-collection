import prisma from '../config/db.js'
import { ErrorResponse } from '../middlewares/error.js'

// @desc    Log a WhatsApp order request
// @route   POST /api/orders/whatsapp
// @access  Public (Optional Auth)
export const logWhatsAppOrder = async (req, res, next) => {
  try {
    const { productName, productPrice, selectedColor, customerName, phoneNumber } = req.body

    // Resolve name and phone from logged-in user if available
    const finalName = customerName || req.user?.name || 'Anonymous Customer'
    const finalPhone = phoneNumber || req.user?.phone || 'Not Provided'

    const whatsappOrder = await prisma.whatsAppOrder.create({
      data: {
        customerName: finalName,
        phoneNumber: finalPhone,
        productName,
        productPrice: parseFloat(productPrice),
        selectedColor: selectedColor || 'Default',
        status: 'New'
      }
    })

    res.status(201).json({
      success: true,
      message: 'WhatsApp order request logged successfully.',
      data: whatsappOrder
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get all WhatsApp order requests
// @route   GET /api/orders/admin/whatsapp
// @access  Private/Admin
export const getWhatsAppOrders = async (req, res, next) => {
  try {
    const orders = await prisma.whatsAppOrder.findMany({
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

// @desc    Update WhatsApp order request status
// @route   PUT /api/orders/admin/whatsapp/:id/status
// @access  Private/Admin
export const updateWhatsAppOrderStatus = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const { status } = req.body

    const validStatuses = ['New', 'Contacted', 'Completed']
    if (!validStatuses.includes(status)) {
      return next(new ErrorResponse('Invalid status type.', 400))
    }

    const order = await prisma.whatsAppOrder.update({
      where: { id },
      data: { status }
    })

    res.status(200).json({
      success: true,
      message: 'WhatsApp order status updated successfully.',
      data: order
    })
  } catch (error) {
    next(error)
  }
}
