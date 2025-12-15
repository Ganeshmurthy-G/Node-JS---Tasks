const express = require('express');
const fs = require('fs');
const path = require('path');
const { upload, uploadDirectory } = require('../middleware/uploadMiddleware');

const router = express.Router();

// Upload file
router.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    res.json({ message: 'File uploaded successfully', filename: req.file.filename });
});

// List uploaded files
router.get('/list', (req, res) => {
    fs.readdir(uploadDirectory, (err, files) => {
        if (err) return res.status(500).json({ error: err.message });
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.txt', '.pdf'];
        const filesUploaded = files.filter(file => allowedExtensions.includes(path.extname(file).toLowerCase()));
        res.json(filesUploaded);
    });
});

// Move file to deleted folder
const deletedDirectory = path.join(__dirname, '..', 'public', 'Deleted_Files');
if (!fs.existsSync(deletedDirectory)) fs.mkdirSync(deletedDirectory, { recursive: true });

router.post('/move-to-deleted', (req, res) => {
    const { filename } = req.body;
    if (!filename) return res.status(400).json({ error: 'Filename is required' });

    const oldPath = path.join(uploadDirectory, filename);
    const newPath = path.join(deletedDirectory, filename);

    fs.access(oldPath, fs.constants.F_OK, (err) => {
        if (err) return res.status(404).json({ error: 'File not found' });

        fs.rename(oldPath, newPath, (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'File moved to deleted folder successfully', filename });
        });
    });
});

module.exports = router;



// const express = require('express');
// const router = express.Router();
// const path = require('path');
// const fs = require('fs');
// const { upload, uploadDirectory } = require('../middlewares/upload.middleware');
// const { sendMail } = require('../services/mail.service');
// const { scheduleExcelMail } = require('../cron/cron.scheduler');

// // Upload a file
// router.post('/upload', upload.single('file'), async (req, res, next) => {
//     if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

//     try {
//         await sendMail({
//             to: 'pragatheeswaran.n@mitrahsoft.in',
//             subject: 'File Upload Notification',
//             html: `<b>New File Is Uploaded Successfully!</b>`,
//             attachments: [{ filename: req.file.filename, path: req.file.path }]
//         });

//         res.json({ message: 'File uploaded successfully', filename: req.file.filename });
//     } catch (err) {
//         next(err);
//     }
// });

// // List uploaded files
// router.get('/files', (req, res, next) => {
//     fs.readdir(uploadDirectory, (err, files) => {
//         if (err) return next(err);

//         const filesUploaded = files.filter(file => {
//             const ext = path.extname(file).toLowerCase();
//             return ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.txt', '.pdf'].includes(ext);
//         });

//         res.json(filesUploaded);
//     });
// });

// // Move file to deleted folder
// router.post('/delete-file', (req, res, next) => {
//     const { filename } = req.body;
//     if (!filename) return res.status(400).json({ error: 'Filename is required' });

//     const deletedDirectory = path.join(__dirname, '../public/Deleted_Files');
//     if (!fs.existsSync(deletedDirectory)) fs.mkdirSync(deletedDirectory, { recursive: true });

//     const oldPath = path.join(uploadDirectory, filename);
//     const newPath = path.join(deletedDirectory, filename);

//     fs.access(oldPath, fs.constants.F_OK, (err) => {
//         if (err) return res.status(404).json({ error: 'File not found' });

//         fs.rename(oldPath, newPath, (err) => {
//             if (err) return next(err);
//             res.json({ message: 'File moved to deleted folder successfully', filename });
//         });
//     });
// });

// // Start Excel cron job (optional route trigger)
// router.get('/start-cron', (req, res) => {
//     scheduleExcelMail();
//     res.json({ message: 'Excel cron job scheduled' });
// });

// module.exports = router;
