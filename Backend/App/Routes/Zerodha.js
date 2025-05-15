const router = require("express").Router()
const multer = require('multer');
const path = require('path');

const {GetAccessToken,placeOrder,ExitplaceOrder,checkOrder,checkOrderBasket,MultipleplaceOrder,MultipleExitplaceOrder} = require('../Controllers/Zerodha')

router.get('/zerodha/getaccesstoken', GetAccessToken);
router.post('/zerodha/placeorder', placeOrder);
router.post('/zerodha/exitplaceorder', ExitplaceOrder);
router.post('/zerodha/checkorder', checkOrder);
router.post('/zerodha/checkorderbasket', checkOrderBasket);

// router.get('/aliceblue/getpendingorder', callfunction);
router.post('/zerodha/multipleplaceorder', MultipleplaceOrder);
router.post('/zerodha/multipleexitplaceorder', MultipleExitplaceOrder);
module.exports = router;
