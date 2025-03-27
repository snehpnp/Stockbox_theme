const router = require("express").Router()
const multer = require('multer');
const path = require('path');


const {GetAccessToken,placeOrder,ExitplaceOrder,checkOrder,checkOrderBasket,MultipleplaceOrder,MultipleExitplaceOrder} = require('../Controllers/Upstox')

router.get('/upstox/getaccesstoken', GetAccessToken);
router.post('/upstox/placeorder', placeOrder);
router.post('/upstox/exitplaceorder', ExitplaceOrder);
router.post('/upstox/checkorder', checkOrder);
router.post('/upstox/checkorderbasket', checkOrderBasket);
router.post('/upstox/multipleplaceorder', MultipleplaceOrder);
router.post('/upstox/multipleexitplaceorder', MultipleExitplaceOrder);

module.exports = router;
