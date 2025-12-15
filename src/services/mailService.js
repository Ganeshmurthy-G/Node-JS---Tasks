const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: false,
    auth: {
        user: process.env.SEND_EMAIL,
        pass: process.env.SEND_PASS,
    },
    tls: {
        rejectUnauthorized: false
    }
});

async function sendMailWithAttachment({ to, subject, html, attachments }) {
    return transporter.sendMail({ from: process.env.SEND_EMAIL, to, subject, html, attachments });
}

async function sendHtmlMail({ to, subject, html }) {
    return transporter.sendMail({ from: process.env.SEND_EMAIL, to, subject, html });
}

module.exports = { sendMailWithAttachment, sendHtmlMail };


// const XLSX = require('xlsx');

// const readExcelToHtml = (filePath) => {
//     const workbook = XLSX.readFile(filePath);
//     const sheetName = workbook.SheetNames[0];
//     const sheet = workbook.Sheets[sheetName];
//     const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

//     let html = `<h3>Excel Report</h3>
//         <table border="1" cellpadding="5" cellspacing="0">`;

//     data.forEach((row, rowIndex) => {
//         html += '<tr>';
//         row.forEach(cell => {
//             if (rowIndex === 0) {
//                 html += `<th style="background-color:#007BFF; color:black;">${cell}</th>`;
//             } else {
//                 html += `<td>${cell}</td>`;
//             }
//         });
//         html += '</tr>';
//     });

//     html += '</table>';
//     return html;
// };

// module.exports = { readExcelToHtml };




// // const transporter = require('../config/mail.config');

// // const sendMail = async ({ to, subject, html, attachments }) => {
// //     return transporter.sendMail({
// //         from: process.env.SEND_EMAIL,
// //         to,
// //         subject,
// //         html,
// //         attachments
// //     });
// // };

// // module.exports = { sendMail };


// const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: process.env.SEND_EMAIL,
//         pass: process.env.SEND_PASS
//     },
//     tls: {
//         rejectUnauthorized: false
//     }
// });

// // Send email function
// const sendMail = async ({ to, subject, html, attachments }) => {
//     return transporter.sendMail({ from: process.env.SEND_EMAIL, to, subject, html, attachments });
// };

// module.exports = { sendMail, transporter };