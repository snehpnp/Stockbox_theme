const router = require("express").Router()
const multer = require('multer');
const path = require('path');

const {GetAccessToken,placeOrder,ExitplaceOrder,checkOrder,checkOtp,checkOrderBasket,MultipleplaceOrder,MultipleExitplaceOrder} = require('../Controllers/Kotakneo')

router.post('/kotakneo/getaccesstoken', GetAccessToken);
router.post('/kotakneo/placeorder', placeOrder);
router.post('/kotakneo/exitplaceorder', ExitplaceOrder);
router.post('/kotakneo/checkorder', checkOrder);
router.post('/kotakneo/checkotp', checkOtp);
router.post('/kotakneo/checkorderbasket', checkOrderBasket);

router.post('/kotakneo/multipleplaceorder', MultipleplaceOrder);
router.post('/kotakneo/multipleexitplaceorder', MultipleExitplaceOrder);

module.exports = router;
