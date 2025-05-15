const router = require("express").Router()
const multer = require('multer');
const path = require('path');

const {GetAccessToken,placeOrder,ExitplaceOrder,checkOrder,checkOrderBasket,MultipleplaceOrder,MultipleExitplaceOrder} = require('../Controllers/Markethub')

router.post('/markethub/getaccesstoken', GetAccessToken);
router.post('/markethub/placeorder', placeOrder);
router.post('/markethub/exitplaceorder', ExitplaceOrder);
router.post('/markethub/checkorder', checkOrder);
router.post('/markethub/checkorderbasket', checkOrderBasket);

router.post('/markethub/multipleplaceorder', MultipleplaceOrder);
router.post('/markethub/multipleexitplaceorder', MultipleExitplaceOrder);
module.exports = router;
