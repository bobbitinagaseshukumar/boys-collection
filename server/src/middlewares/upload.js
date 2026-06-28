import multer from 'multer'
import path from 'path'
import { ErrorResponse } from './error.js'

// Multer memory storage (keeps file in buffer for Cloudinary or custom saving)
const storage = multer.memoryStorage()

// Check file type
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|webp/
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = filetypes.test(file.mimetype)

  if (extname && mimetype) {
    return cb(null, true)
  } else {
    cb(new ErrorResponse('Only image files (JPEG, JPG, PNG, WEBP) are allowed!', 400), false)
  }
}

// Configure upload limits
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB Limit
  fileFilter
})
