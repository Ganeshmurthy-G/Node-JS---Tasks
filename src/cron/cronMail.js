const cron = require("node-cron");
const nodemailer = require("nodemailer");
const path = require("path");
const XLSX = require("xlsx");

function readExcel(filePath) {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    let html = `<h3>Excel Report</h3><table border="1" cellpadding="5" cellspacing="0">`;
    data.forEach((row, rowIndex) => {
        html += "<tr>";
        row.forEach(cell => {
            if (rowIndex === 0) html += `<th style="background-color:#007BFF;color:black">${cell}</th>`;
            else html += `<td>${cell}</td>`;
        });
        html += "</tr>";
    });
    html += "</table>";
    return html;
}

function sendEmail() {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.SEND_EMAIL,
            pass: process.env.SEND_PASS
        }
    });

    const excelPath = path.join(__dirname, "../public/Excel/MOM 1.xlsx");

    const htmlTable = readExcel(excelPath);

    transporter.sendMail({
        from: process.env.SEND_EMAIL,
        to: "ganeshoct1710@gmail.com",
        subject: "Excel Report Generation",
        html: htmlTable
    }, (err, info) => {
        if (err) console.error("Error sending scheduled email:", err);
        else console.log("Scheduled email sent:", info.response);
    });
}

function startCron() {
    // Every 1 minute
    cron.schedule("* * * * *", () => {
        console.log("Running cron job...");
        sendEmail();
    });
}

module.exports = { startCron };
