import prisma from '../config/db.js'
import { ErrorResponse } from '../middlewares/error.js'

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      }
    })

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single category by slug
// @route   GET /api/categories/:slug
// @access  Public
export const getCategoryBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params

    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        products: {
          include: {
            images: true,
            colors: true,
            sizes: true
          }
        }
      }
    })

    if (!category) {
      return next(new ErrorResponse(`Category not found with slug: ${slug}`, 404))
    }

    res.status(200).json({
      success: true,
      data: category
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Create new category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = async (req, res, next) => {
  try {
    const { name, description, image } = req.body
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        image
      }
    })

    res.status(201).json({
      success: true,
      message: 'Category created successfully.',
      data: category
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const { name, description, image } = req.body

    const updateData = { description, image }

    if (name) {
      updateData.name = name
      updateData.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    }

    const category = await prisma.category.update({
      where: { id },
      data: updateData
    })

    res.status(200).json({
      success: true,
      message: 'Category updated successfully.',
      data: category
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)

    await prisma.category.delete({
      where: { id }
    })

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully.'
    })
  } catch (error) {
    next(error)
  }
}
