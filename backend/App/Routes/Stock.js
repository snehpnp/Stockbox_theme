const router = require("express").Router()
const multer = require('multer');
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage }); // Apply storage settings
const { checkPermission } = require('../Middleware/permissionMiddleware'); // Path to your middleware

const {AddStock,getStock,updateStock,deleteStock,detailStock,statusChange,AddBulkStock,activeStock,getStockByService,getStocksByExpiry,getStocksByExpiryByStrike,getStockBySymbol} = require('../Controllers/Stock')

const PERMISSIONS = {
    ADD: 'addstock',
    VIEW: 'viewstock',
    ALL_VIEW: 'allviewstock',
    UPDATE: 'editstock',
    DELETE: 'deletestock',
    CHANGE_STATUS: 'stockchangestatus',
    ADDBULKSTOCK: 'addbulkstock',
  };
  


router.post('/stock/add', AddStock);
router.get('/stock/list', getStock);
router.put('/stock/update', updateStock);
router.get('/stock/delete/:id', deleteStock);
router.get('/stock/detail/:id', detailStock);
router.post('/stock/change-status', statusChange);
router.post('/stock/addbulkstock', upload.single('file'), AddBulkStock);
router.get('/stock/activestock',   activeStock);
router.post('/stock/getstockbyservice', getStockByService);
router.post('/stock/getstockbysymbol', getStockBySymbol);
router.post('/stock/getstocksbyexpiry', getStocksByExpiry);
router.post('/stock/getstocksbyexpirybystrike', getStocksByExpiryByStrike);


module.exports = router;
