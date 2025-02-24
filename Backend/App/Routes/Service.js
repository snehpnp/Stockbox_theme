const router = require("express").Router()
const { checkPermission } = require('../Middleware/permissionMiddleware'); // Path to your middleware

const {AddService,getService,updateService,deleteService,detailService,statusChange,activeService} = require('../Controllers/Service')

const PERMISSIONS = {
    ADD: 'addservice',
    VIEW: 'viewservice',
    ALL_VIEW: 'allviewservice',
    UPDATE: 'editservice',
    DELETE: 'deleteservice',
    CHANGE_STATUS: 'servicechangestatus',
  };
  


router.post('/service/add', AddService);
router.get('/service/list', getService);
router.put('/service/update', updateService);
router.get('/service/delete/:id', deleteService);
router.get('/service/detail/:id', detailService);
router.post('/service/change-status', statusChange);
router.get('/service/activeservice',   activeService);


module.exports = router;
