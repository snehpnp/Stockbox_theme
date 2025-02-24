const router = require("express").Router()
const { checkPermission } = require('../Middleware/permissionMiddleware'); // Path to your middleware

const {AddPlancategory,getPlancategory,updatePlancategory,deletePlancategory,detailPlancategory,statusChange,activePlancategory} = require('../Controllers/Plancategory')

const PERMISSIONS = {
    ADD: 'addplancategory',
    VIEW: 'viewplancategory',
    ALL_VIEW: 'allviewplancategory',
    UPDATE: 'editplancategory',
    DELETE: 'deleteplancategory',
    CHANGE_STATUS: 'plancategorychangestatus',
  };
  


router.post('/plancategory/add', AddPlancategory);
router.get('/plancategory/list', getPlancategory);
router.put('/plancategory/update', updatePlancategory);
router.get('/plancategory/delete/:id', deletePlancategory);
router.get('/plancategory/detail/:id', detailPlancategory);
router.post('/plancategory/change-status', statusChange);
router.get('/plancategory/activeplancategory',   activePlancategory);


module.exports = router;
