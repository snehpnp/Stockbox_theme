const router = require("express").Router()
const multer = require('multer');
const path = require('path');


const {AddClover,getClover,updateClover,deleteClover,detailClover,statusChange,activeClover} = require('../Controllers/Clover')

const PERMISSIONS = {
    ADD: 'addclover',
    VIEW: 'viewclover',
    ALL_VIEW: 'allviewclover',
    UPDATE: 'editclover',
    DELETE: 'deleteclover',
    CHANGE_STATUS: 'cloverchangestatus',
  };



router.post('/clover/add', AddClover);
router.get('/clover/list', getClover);
router.post('/clover/update', updateClover);
router.get('/clover/delete/:id', deleteClover);
router.get('/clover/detail/:id', detailClover);
router.post('/clover/change-status', statusChange);
router.get('/clover/activeclover',   activeClover);


module.exports = router;
