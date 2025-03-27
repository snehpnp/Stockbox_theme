const router = require("express").Router()
const multer = require('multer');
const path = require('path');

const {GetAccessToken,placeOrder,ExitplaceOrder,checkOrder,checkOrderBasket,MultipleplaceOrder,MultipleExitplaceOrder} = require('../Controllers/Dhan')

router.post('/dhan/getaccesstoken', GetAccessToken);
router.post('/dhan/placeorder', placeOrder);
router.post('/dhan/exitplaceorder', ExitplaceOrder);
router.post('/dhan/checkorder', checkOrder);
router.post('/dhan/checkorderbasket', checkOrderBasket);

// router.get('/aliceblue/getpendingorder', callfunction);

router.post('/dhan/multipleplaceorder', MultipleplaceOrder);
router.post('/dhan/multipleexitplaceorder', MultipleExitplaceOrder);
module.exports = router;
