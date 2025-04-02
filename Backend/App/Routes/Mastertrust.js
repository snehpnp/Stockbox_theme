const router = require("express").Router()
const multer = require('multer');
const path = require('path');

const {GetAccessToken,placeOrder,ExitplaceOrder,checkOrder} = require('../Controllers/Mastertrust')

router.get('/mastertrust/getaccesstoken', GetAccessToken);
router.post('/mastertrust/placeorder', placeOrder);
router.post('/mastertrust/exitplaceorder', ExitplaceOrder);
router.post('/mastertrust/checkorder', checkOrder);


module.exports = router;
