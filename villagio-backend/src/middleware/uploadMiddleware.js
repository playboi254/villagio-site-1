// ─── Secure Multer Upload Middleware ─────────────────────────────────────────
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2 MB

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// File filter – only allow safe image types
const fileFilter = (req, file, cb) => {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(
      new multer.MulterError(
        'LIMIT_UNEXPECTED_FILE',
        `Only image files are allowed (jpeg, jpg, png, webp). Received: ${file.mimetype}`
      ),
      false
    )
  }
  cb(null, true)
}

// Disk storage with sanitized filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    // Sanitize: use UUID + extension only (no original filename)
    const ext = path.extname(file.originalname).toLowerCase()
    const safeFilename = `${uuidv4()}${ext}`
    cb(null, safeFilename)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
})

// Multer error handler helper
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ message: 'File too large. Maximum size is 2MB.' })
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(415).json({ message: err.field || 'Unsupported file type.' })
    }
    return res.status(400).json({ message: err.message })
  }
  next(err)
}

module.exports = { upload, handleMulterError }
