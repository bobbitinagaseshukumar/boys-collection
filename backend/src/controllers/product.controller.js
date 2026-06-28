import prisma from '../config/db.js'
import { ErrorResponse } from '../middlewares/error.js'

// @desc    Get all products with filters, sorting, and pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const { category, search, minPrice, maxPrice, sortBy, page = 1, limit = 24, featured, trending, newArrival } = req.query

    const pageNum = parseInt(page)
    const limitNum = parseInt(limit)
    const skip = (pageNum - 1) * limitNum

    // Build filter query object
    const where = {}

    if (category) {
      where.category = { slug: category }
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice)
      if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }

    if (featured === 'true') where.isFeatured = true
    if (trending === 'true') where.isTrending = true
    if (newArrival === 'true') where.isNewArrival = true

    // Build sorting options
    let orderBy = {}
    switch (sortBy) {
      case 'price-asc':
        orderBy = { price: 'asc' }
        break
      case 'price-desc':
        orderBy = { price: 'desc' }
        break
      case 'newest':
        orderBy = { id: 'desc' }
        break
      case 'name':
        orderBy = { title: 'asc' }
        break
      default:
        // Default sort: featured products first, then id desc
        orderBy = [
          { isFeatured: 'desc' },
          { id: 'desc' }
        ]
    }

    // Fetch filtered products count
    const total = await prisma.product.count({ where })

    // Fetch products
    const products = await prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: limitNum,
      include: {
        images: true,
        colors: true,
        sizes: true
      }
    })

    res.status(200).json({
      success: true,
      count: products.length,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        limit: limitNum
      },
      data: products
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single product by slug
// @route   GET /api/products/:slug
// @access  Public
export const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        images: true,
        colors: true,
        sizes: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!product) {
      return next(new ErrorResponse(`Product not found with slug: ${slug}`, 404))
    }

    res.status(200).json({
      success: true,
      data: product
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res, next) => {
  try {
    const {
      title,
      description,
      price,
      originalPrice,
      discount,
      brand,
      stock,
      categoryId,
      isFeatured,
      isTrending,
      isNewArrival,
      images, // Array of strings (urls)
      colors, // Array of objects: [{name, code}]
      sizes // Array of strings: ['S', 'M']
    } = req.body

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

    const product = await prisma.product.create({
      data: {
        title,
        slug,
        description,
        price: parseFloat(price),
        originalPrice: parseFloat(originalPrice),
        discount: parseFloat(discount || 0),
        brand: brand || 'STYLEX',
        stock: parseInt(stock || 0),
        categoryId: parseInt(categoryId),
        isFeatured: !!isFeatured,
        isTrending: !!isTrending,
        isNewArrival: !!isNewArrival,
        images: {
          create: images?.map(url => ({ url })) || []
        },
        colors: {
          create: colors?.map(c => ({ name: c.name, code: c.code })) || []
        },
        sizes: {
          create: sizes?.map(value => ({ value })) || []
        }
      },
      include: {
        images: true,
        colors: true,
        sizes: true
      }
    })

    res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      data: product
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const {
      title,
      description,
      price,
      originalPrice,
      discount,
      brand,
      stock,
      categoryId,
      isFeatured,
      isTrending,
      isNewArrival,
      images,
      colors,
      sizes
    } = req.body

    const updateData = {}
    if (title) {
      updateData.title = title
      updateData.slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    }
    if (description) updateData.description = description
    if (price) updateData.price = parseFloat(price)
    if (originalPrice) updateData.originalPrice = parseFloat(originalPrice)
    if (discount !== undefined) updateData.discount = parseFloat(discount)
    if (brand) updateData.brand = brand
    if (stock !== undefined) updateData.stock = parseInt(stock)
    if (categoryId) updateData.categoryId = parseInt(categoryId)
    if (isFeatured !== undefined) updateData.isFeatured = !!isFeatured
    if (isTrending !== undefined) updateData.isTrending = !!isTrending
    if (isNewArrival !== undefined) updateData.isNewArrival = !!isNewArrival

    // Transaction to update product details and handle related relational updates cleanly
    const product = await prisma.$transaction(async (tx) => {
      // Remove old colors, sizes, images if new ones are provided
      if (colors) {
        await tx.color.deleteMany({ where: { productId: id } })
        updateData.colors = {
          create: colors.map(c => ({ name: c.name, code: c.code }))
        }
      }
      if (sizes) {
        await tx.size.deleteMany({ where: { productId: id } })
        updateData.sizes = {
          create: sizes.map(value => ({ value }))
        }
      }
      if (images) {
        await tx.productImage.deleteMany({ where: { productId: id } })
        updateData.images = {
          create: images.map(url => ({ url }))
        }
      }

      return await tx.product.update({
        where: { id },
        data: updateData,
        include: {
          images: true,
          colors: true,
          sizes: true
        }
      })
    })

    res.status(200).json({
      success: true,
      message: 'Product updated successfully.',
      data: product
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)

    await prisma.product.delete({
      where: { id }
    })

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully.'
    })
  } catch (error) {
    next(error)
  }
}
