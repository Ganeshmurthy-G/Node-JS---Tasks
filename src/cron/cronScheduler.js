const cron = require("node-cron");
const sendExcelEmail = require("./cronMail");

function scheduleExcelMail() {
    // Run once every day at 9 AM (adjust as needed)
    cron.schedule("1 * * * *", () => {
        console.log("Running scheduled Excel email...");
        sendExcelEmail();
    });
}

module.exports = { scheduleExcelMail };






// const cron = require('node-cron');
// const { sendMail } = require('../services/mail.service');
// const path = require('path');
// const { readExcelToHtml } = require('../services/excel.service');

// const scheduleExcelMail = () => {
//     cron.schedule('*/1 * * * *', async () => { // every 1 minute
//         try {
//             const excelPath = path.join(__dirname, '../public/Excel/MOM 1.xlsx');
//             const htmlTable = readExcelToHtml(excelPath);

//             await sendMail({
//                 to: 'ganeshoct1710@gmail.com',
//                 subject: 'Excel Report Generation',
//                 html: htmlTable
//             });

//             console.log('Excel report email sent!');
//         } catch (err) {
//             console.error('Error sending Excel email:', err);
//         }
//     });
// };

// module.exports = { scheduleExcelMail };
