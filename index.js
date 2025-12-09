const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
console.log('numCPUs: ', numCPUs);

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    // setInterval(() => {
    //     console.log("Active workers:");
    //     for (const id in cluster.workers) {
    //         console.log(`Worker ${id} is alive`);
    //     }
    // }, 5000);

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);

        cluster.fork();
    });

} else {
    const express = require("express");
    const cors = require('cors');
    const dotenv = require('dotenv');
    const app = express();
    const router = require('./src/routes/profileRoute');
    const errorHandler = require("./src/middleware/globalerror");
    const fs = require('fs');
    const path = require('path');
    const multer = require('multer');
    const handleConnection = require("./src/config/db");
    const bcrypt = require('bcryptjs');
    const jwt = require("jsonwebtoken");
    const verifyToken = require("./src/middleware/auth");
    const cookieParser = require('cookie-parser');
    const nodemailer = require('nodemailer');
    const cron = require("node-cron");

    dotenv.config();

    const PORT = 3000;

    const corsOptions = {
        origin: 'http://localhost:5173',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization']
    };

    app.use(cors(corsOptions));

    app.use(express.json());

    app.use(cookieParser());

    // Base URL
    app.use('/profile', router);

    // API for Public access route
    app.get('/public', (req, res) => {
        res.json({ message: 'Hey, Im Public Router' });
    });

    // API for Private Access Route With Verified Token From Cookies
    app.get('/protected', verifyToken, (req, res) => {
        res.json({ message: `Hey, Im Private Router ${req.user.email}` });
    });

    // Setting up the backend folder for uploading file/images
    const uploadDirectory = path.join(__dirname, 'src', 'public', 'FileImage_Uploads');
    console.log('uploadDirectory: ', uploadDirectory);

    if (!fs.existsSync(uploadDirectory)) {
        fs.mkdirSync(uploadDirectory, { recursive: true });
    }

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadDirectory);
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + '-' + file.originalname);
        },
    });

    const upload = multer({
        storage: storage, limits: {
            fileSize: 1024 * 1024 * 5
        }
    });

    // API for uploading files/images from local machine to backend folder
    app.post('/upload', upload.single('file'), (req, res) => {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        let transporter = nodemailer.createTransport({
            service: "gmail",
            port: 587,
            secure: false,
            auth: {
                user: process.env.SEND_EMAIL,
                pass: process.env.SEND_PASS,
            },
            tls: {
                ciphers: 'SSLv3',
                rejectUnauthorized: false
            }
        });

        transporter.verify(function (error, success) {
            if (error) {
                console.log(error);
            } else {
                console.log("Server is ready to take our messages");
            }
        });

        transporter.sendMail({
            from: process.env.SEND_EMAIL,
            to: 'sridharan.r@mitrahsoft.in',
            subject: 'Regarding File Upload',
            html: '<b>New File Is Uploaded Successfully!</b>',
            attachments: [
                {
                    filename: req.file.filename,
                    path: req.file.path
                }
            ]
        }, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        res.json({ message: 'File uploaded successfully', filename: req.file.filename });
    });

    // Sending mail for each and evey 1 minute for CRON 
    function sendEmail() {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            port: 587,
            secure: false,
            auth: {
                user: process.env.SEND_EMAIL,
                pass: process.env.SEND_PASS,
            },
            tls: {
                ciphers: 'SSLv3',
                rejectUnauthorized: false
            }
        });

        transporter.verify(function (error, success) {
            if (error) {
                console.log(error);
            } else {
                console.log("Server is ready to take our messages");
            }
        });

        transporter.sendMail({
            from: process.env.SEND_EMAIL,
            to: 'pragatheeswaran.n@mitrahsoft.in',
            subject: 'Regarding File Upload',
            html: '<b>New File Is Uploaded Successfully!</b>',
        }, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }

    // API for moving file from one folder to another folder
    app.get('/getFilesUploaded', (req, res) => {
        fs.readdir(uploadDirectory, (err, files) => {
            console.log('files: ', files);
            if (err) return next(err);

            const filesUploaded = files.filter(file => {
                const ext = path.extname(file).toLowerCase();
                console.log('ext: ', ext);
                return ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.txt', '.pdf'].includes(ext);
            });
            console.log('filesUploaded: ', filesUploaded);
            res.json(filesUploaded);
        });
    });

    const deletedDirectory = path.join(__dirname, 'src', 'public', 'Deleted_Files');
    console.log('deletedDirectory: ', deletedDirectory);

    if (!fs.existsSync(deletedDirectory)) {
        fs.mkdirSync(deletedDirectory, { recursive: true });
    }

    app.post('/movingToDeleteFolder', (req, res, next) => {
        const { filename } = req.body;
        console.log('filename: ', filename);

        if (!filename) {
            return res.status(400).json({ error: 'Filename is required' });
        }

        const oldPath = path.join(uploadDirectory, filename);
        console.log('oldPath: ', oldPath);
        const newPath = path.join(deletedDirectory, filename);
        console.log('newPath: ', newPath);

        fs.access(oldPath, fs.constants.F_OK, (err) => {
            if (err) {
                return res.status(404).json({ error: 'File not found' });
            }

            fs.rename(oldPath, newPath, (err) => {
                console.log('newPath -- : ', newPath);
                console.log('oldPath -- : ', oldPath);
                if (err) return next(err);

                res.json({
                    message: 'File moved to deleted folder successfully',
                    filename: filename
                });
            });
        });
    });

    const JWT_SECRET = process.env.JWT_SECRET;
    console.log('JWT_SECRET: ', JWT_SECRET);

    // API for login user
    app.post("/login", (req, res, next) => {
        const { email, password } = req.body;

        const sql = 'SELECT * FROM profiles WHERE email = ?';
        handleConnection.query(sql, [email], async (err, results) => {
            console.log('results: ', results);

            if (err) return next(err);

            if (results.length === 0) {
                return res.status(404).send('User not found');
            }

            const user = results[0];
            console.log('user: ', user);

            const isMatch = await bcrypt.compare(password, user.password);
            console.log('isMatch: ', isMatch);

            if (isMatch === false) {
                res.status(401).send('Invalid credentials');
            }

            if (user) {
                const token = jwt.sign(
                    { id: user.id, email: user.email },
                    JWT_SECRET,
                    { expiresIn: "10h" }
                );
                console.log('token: ', token);

                res.cookie('jwt', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 3600000,
                    sameSite: 'Lax',
                });

                res.status(200).json({ message: 'Logged in successfully!' });
            }
        });
    });

    // Creating a cron job which runs on every 1 minute
    cron.schedule("*/1 * * * *", function () {
        // sendEmail();
        console.log("Cron Works Fine!");
    });

    // App uses the middleware
    app.use(errorHandler);

    // APP listens on the port 3000
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

    console.log(`Worker ${process.pid} started`);
}

