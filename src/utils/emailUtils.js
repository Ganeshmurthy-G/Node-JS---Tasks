const nodemailer = require('nodemailer');
require("dotenv").config();

async function sendExcelEmail(filePath) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SEND_EMAIL,
            pass: process.env.SEND_PASS,
        },
    });

    const htmlTable = `<p>Your Excel Report Here or use readExcel(filePath)</p>`; // Use your existing readExcel logic

    await transporter.sendMail({
        from: process.env.SEND_EMAIL,
        to: 'ganeshoct1710@gmail.com',
        subject: 'Excel Report',
        html: htmlTable,
        attachments: [{ filename: 'MOM 1.xlsx', path: filePath }],
    });

    console.log('Excel mail sent successfully!');
}

module.exports = { sendExcelEmail };
