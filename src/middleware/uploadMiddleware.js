const multer = require('multer');
const fs = require('fs');
const path = require('path');

const uploadDirectory = path.join(__dirname, '..', 'public', 'FileImage_Uploads');

// Create directory if not exists
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDirectory),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({
    storage,
    limits: { fileSize: 1024 * 1024 * 5 } // 5MB limit
});

module.exports = { upload, uploadDirectory };
