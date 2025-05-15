const router = require("express").Router()
const { checkPermission } = require('../Middleware/permissionMiddleware'); // Path to your middleware

const {AddScript,getScript,deleteScript,detailScript} = require('../Controllers/Script')

const PERMISSIONS = {
    ADD: 'addscript',
    VIEW: 'viewscript',
    ALL_VIEW: 'allviewscript',
    DELETE: 'deletescript',
  };
  


router.post('/script/add', AddScript);
router.get('/script/list', getScript);
router.get('/script/delete/:id', deleteScript);
router.get('/script/detail/:id', detailScript);


module.exports = router;
