const router = require("express").Router()
const multer = require('multer');
const path = require('path');

const {GetAccessToken,placeOrder,ExitplaceOrder,checkOrder,checkOrderBasket} = require('../Controllers/Dhan')

router.get('/dhan/getaccesstoken', GetAccessToken);
router.post('/dhan/placeorder', placeOrder);
router.post('/dhan/exitplaceorder', ExitplaceOrder);
router.post('/dhan/checkorder', checkOrder);
router.post('/dhan/checkorderbasket', checkOrderBasket);

// router.get('/aliceblue/getpendingorder', callfunction);

module.exports = router;
