const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SEND_EMAIL,
        pass: process.env.SEND_PASS
    },
    tls: { rejectUnauthorized: false }
});

module.exports = transporter;
