const router = require("express").Router()
const multer = require('multer');
const path = require('path');

const {GetAccessToken,placeOrder,ExitplaceOrder,checkOrder,checkOrderBasket} = require('../Controllers/Zerodha')

router.get('/zerodha/getaccesstoken', GetAccessToken);
router.post('/zerodha/placeorder', placeOrder);
router.post('/zerodha/exitplaceorder', ExitplaceOrder);
router.post('/zerodha/checkorder', checkOrder);
router.post('/zerodha/checkorderbasket', checkOrderBasket);

// router.get('/aliceblue/getpendingorder', callfunction);

module.exports = router;
