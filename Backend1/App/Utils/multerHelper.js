// helpers/multerHelper.js
const multer = require('multer');
const path = require('path');

// Function to create a dynamic storage engine
const getMulterStorage = (folderName) => {
    return multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path.join(__dirname, `../../../${process.env.DOMAIN}/uploads`, folderName)); // Dynamic folder based on controller
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
        }
    });
};

// Function to create a multer instance with dynamic storage
const upload = (folderName) => multer({ storage: getMulterStorage(folderName) });

module.exports = upload;
