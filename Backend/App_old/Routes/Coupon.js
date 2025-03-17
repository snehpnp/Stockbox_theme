const router = require("express").Router()
const multer = require('multer');
const path = require('path');

const { checkPermission } = require('../Middleware/permissionMiddleware');

const {AddCoupon,getCoupon,updateCoupon,deleteCoupon,detailCoupon,statusChange,activeCoupon,showStatusChange} = require('../Controllers/Coupon')


const PERMISSIONS = {
    ADD: 'addcoupon',
    VIEW: 'viewcoupon',
    ALL_VIEW: 'allviewcoupon',
    UPDATE: 'editcoupon',
    DELETE: 'deletecoupon',
    CHANGE_STATUS: 'couponchangestatus',
  };

router.post('/coupon/add', AddCoupon);
router.get('/coupon/list', getCoupon);
router.put('/coupon/update', updateCoupon);
router.get('/coupon/delete/:id', deleteCoupon);
router.get('/coupon/detail/:id', detailCoupon);
router.post('/coupon/change-status', statusChange);
router.post('/coupon/show-change-status', showStatusChange);
router.get('/coupon/activecoupon',   activeCoupon);


module.exports = router;
