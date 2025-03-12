const router = require("express").Router()
const multer = require('multer');
const path = require('path');


const {GetAccessToken,placeOrder,ExitplaceOrder,checkOrder,checkOrderBasket} = require('../Controllers/Angle')

router.get('/angle/getaccesstoken', GetAccessToken);
router.post('/angle/placeorder', placeOrder);
router.post('/angle/exitplaceorder', ExitplaceOrder);
router.post('/angle/checkorder', checkOrder);
router.post('/angle/checkorderbasket', checkOrderBasket);

module.exports = router;
