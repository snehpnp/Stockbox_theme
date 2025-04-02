const router = require("express").Router()
const multer = require('multer');
const path = require('path');

const { checkPermission } = require('../Middleware/permissionMiddleware');

const {AddBroadcast,getBroadcast,updateBroadcast,deleteBroadcast,detailBroadcast,statusChange,activeBroadcast} = require('../Controllers/Broadcast')



router.post('/broadcast/add', AddBroadcast);
router.get('/broadcast/list', getBroadcast);
router.post('/broadcast/update', updateBroadcast);
router.get('/broadcast/delete/:id', deleteBroadcast);
router.get('/broadcast/detail/:id', detailBroadcast);
router.post('/broadcast/change-status', statusChange);
router.get('/broadcast/activebroadcast',   activeBroadcast);


module.exports = router;
