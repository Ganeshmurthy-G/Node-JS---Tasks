const XLSX = require('xlsx');

const readExcelToHtml = (filePath) => {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    let html = `<h3>Excel Report</h3><table border="1" cellpadding="5" cellspacing="0">`;

    data.forEach((row, rowIndex) => {
        html += '<tr>';
        row.forEach(cell => {
            html += rowIndex === 0
                ? `<th style="background-color:#007BFF; color:black;">${cell}</th>`
                : `<td>${cell}</td>`;
        });
        html += '</tr>';
    });

    html += '</table>';
    return html;
};

module.exports = { readExcelToHtml };
