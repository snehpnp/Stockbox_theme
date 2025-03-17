const router = require("express").Router()
const multer = require('multer');
const path = require('path');

const { checkPermission } = require('../Middleware/permissionMiddleware');

const {AddBanner,getBanner,updateBanner,deleteBanner,detailBanner,statusChange,activeBanner} = require('../Controllers/Banner')

const PERMISSIONS = {
    ADD: 'addbanner',
    VIEW: 'viewbanner',
    ALL_VIEW: 'allviewbanner',
    UPDATE: 'editbanner',
    DELETE: 'deletebanner',
    CHANGE_STATUS: 'bannerchangestatus',
  };



router.post('/banner/add', AddBanner);
router.get('/banner/list', getBanner);
router.post('/banner/update', updateBanner);
router.get('/banner/delete/:id', deleteBanner);
router.get('/banner/detail/:id', detailBanner);
router.post('/banner/change-status', statusChange);
router.get('/banner/activebanner',   activeBanner);


module.exports = router;
