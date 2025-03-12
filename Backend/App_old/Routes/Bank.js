const router = require("express").Router()
const multer = require('multer');
const path = require('path');

const { checkPermission } = require('../Middleware/permissionMiddleware');

const {AddBank,getBank,updateBank,deleteBank,detailBank,statusChange,activeBank,AddQrcode,getQrcode,updateQrcode,activeQrcode,statusChangeQrcode,deleteQrcode} = require('../Controllers/Bank')

const PERMISSIONS = {
    ADD: 'addBank',
    VIEW: 'viewBank',
    ALL_VIEW: 'allviewBank',
    UPDATE: 'editBank',
    DELETE: 'deleteBank',
    CHANGE_STATUS: 'Bankchangestatus',
  };



router.post('/bank/add', AddBank);
router.get('/bank/list', getBank);
router.post('/bank/update', updateBank);
router.get('/bank/delete/:id', deleteBank);
router.get('/bank/detail/:id', detailBank);
router.post('/bank/change-status', statusChange);
router.get('/bank/activebank',   activeBank);




router.post('/qrcode/add', AddQrcode);
router.get('/qrcode/list', getQrcode);
router.post('/qrcode/update', updateQrcode);
router.post('/qrcode/change-status', statusChangeQrcode);
router.get('/qrcode/activeqrcode',   activeQrcode);
router.get('/qrcode/delete/:id', deleteQrcode);


module.exports = router;
