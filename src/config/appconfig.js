const path = require('path');

module.exports = {
    PORT: process.env.PORT || 3002,
    UPLOAD_DIR: path.join(__dirname, '..', 'public', 'FileImage_Uploads'),
    DELETED_DIR: path.join(__dirname, '..', 'public', 'Deleted_Files'),
};
