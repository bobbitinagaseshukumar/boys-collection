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
          bannerImages: '',
          tagline: 'Redefine your style',
          aboutUs: 'Timeless elegance',
          missionStatement: 'Providing the best luxury fashion',
          storeStory: 'Founded in 2026',
          homepageLayout: [
            { "id": "hero", "name": "Hero Section", "enabled": true, "order": 0 },
            { "id": "new-arrivals", "name": "New Arrivals", "enabled": true, "order": 1 },
            { "id": "trending", "name": "Trending Products", "enabled": true, "order": 2 },
            { "id": "categories", "name": "Categories", "enabled": true, "order": 3 },
            { "id": "special-offers", "name": "Special Offers", "enabled": true, "order": 4 },
            { "id": "testimonials", "name": "Testimonials", "enabled": true, "order": 5 },
            { "id": "newsletter", "name": "Newsletter", "enabled": true, "order": 6 }
          ],
          popups: {
            "welcomePopup": { "enabled": false, "title": "Welcome to Style Inverse", "text": "Enjoy 10% off your first purchase!", "delay": 3 },
            "exitPopup": { "enabled": false, "title": "Leaving so soon?", "text": "Subscribe to our club for updates!" }
          },
          announcements: [
            { "text": "✨ Festive Sale: Enjoy FREE Delivery above ₹2000! ✨", "active": true },
            { "text": "⭐ New Collection is LIVE! Explore traditional Sarees now! ⭐", "active": true }
          ],
          paymentConfig: { "method": "BOTH", "razorpayEnabled": true, "upiEnabled": true, "cardEnabled": true },
          seoConfig: { "title": "Style Inverse @Jeshuvesre | Luxury Wear", "description": "Curated traditional sarees and premium men's collections.", "keywords": "sarees, shirts, pants, gold jewellery" }
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
    const {
      shopName, whatsapp, phone, address, instagram, facebook, logo, bannerImages,
      tagline, aboutUs, missionStatement, storeStory,
      homepageLayout, popups, announcements, paymentConfig, seoConfig
    } = req.body

    let settings = await prisma.settings.findFirst()

    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          id: 1,
          shopName, whatsapp, phone, address, instagram, facebook, logo, bannerImages,
          tagline, aboutUs, missionStatement, storeStory,
          homepageLayout, popups, announcements, paymentConfig, seoConfig
        }
      })
    } else {
      settings = await prisma.settings.update({
        where: { id: settings.id },
        data: {
          shopName, whatsapp, phone, address, instagram, facebook, logo, bannerImages,
          tagline, aboutUs, missionStatement, storeStory,
          homepageLayout, popups, announcements, paymentConfig, seoConfig
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
