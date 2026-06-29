import prisma from '../config/db.js'

// @desc    Get website settings
// @route   GET /api/settings
// @access  Public
export const getSettings = async (req, res, next) => {
  try {
    let settings = await prisma.settings.findFirst()

    // If no settings exist yet, create a default one
    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          id: 1,
          shopName: 'Style Inverse @Jeshuvesre',
          whatsapp: '+917993466185',
          phone: '+917993466185',
          address: '42, Marine Drive, South Mumbai, Maharashtra - 400020',
          instagram: 'https://instagram.com/style_inverse',
          facebook: 'https://facebook.com/style_inverse',
          logo: '',
          bannerImages: ''
        }
      })
    }

    res.status(200).json({
      success: true,
      data: settings
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update website settings
// @route   PUT /api/settings
// @access  Private/Admin
export const updateSettings = async (req, res, next) => {
  try {
    const { shopName, whatsapp, phone, address, instagram, facebook, logo, bannerImages } = req.body

    let settings = await prisma.settings.findFirst()

    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          id: 1,
          shopName,
          whatsapp,
          phone,
          address,
          instagram,
          facebook,
          logo,
          bannerImages
        }
      })
    } else {
      settings = await prisma.settings.update({
        where: { id: settings.id },
        data: {
          shopName,
          whatsapp,
          phone,
          address,
          instagram,
          facebook,
          logo,
          bannerImages
        }
      })
    }

    res.status(200).json({
      success: true,
      message: 'Website configurations updated successfully.',
      data: settings
    })
  } catch (error) {
    next(error)
  }
}
