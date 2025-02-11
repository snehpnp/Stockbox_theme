const router = require("express").Router()
const multer = require('multer');
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage }); // Apply storage settings
const { checkPermission } = require('../Middleware/permissionMiddleware'); // Path to your middleware

const {AddStockrating,getStockrating,updateStockrating,deleteStockrating} = require('../Controllers/Stockrating')



router.post('/stockrating/add', AddStockrating);
router.get('/stockrating/list', getStockrating);
router.put('/stockrating/update', updateStockrating);
router.get('/stockrating/delete/:id', deleteStockrating);



module.exports = router;
