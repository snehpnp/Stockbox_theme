const router = require("express").Router()
const multer = require('multer');
const path = require('path');

const {GetAccessToken,placeOrder,ExitplaceOrder,checkOrder,GetAccessTokenAdmin,brokerLink,checkOrderBasket,MultipleplaceOrder,MultipleExitplaceOrder} = require('../Controllers/Aliceblue')

router.get('/aliceblue/getaccesstoken', GetAccessToken);
router.post('/aliceblue/placeorder', placeOrder);
router.post('/aliceblue/exitplaceorder', ExitplaceOrder);
router.post('/aliceblue/checkorder', checkOrder);
router.get('/aliceblue/getaccesstokenadmin', GetAccessTokenAdmin);
router.post('/aliceblue/brokerlink', brokerLink);
router.post('/aliceblue/checkorderbasket', checkOrderBasket);


router.post('/aliceblue/multipleplaceorder', MultipleplaceOrder);
router.post('/aliceblue/multipleexitplaceorder', MultipleExitplaceOrder);


// router.get('/aliceblue/getpendingorder', callfunction);

module.exports = router;
