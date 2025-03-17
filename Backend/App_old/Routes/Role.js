const router = require("express").Router()
const {AddRole,getRole,updateRole,deleteRole,detailRole} = require('../Controllers/Role')

router.post('/role/add', AddRole);
router.get('/role/list', getRole);
router.put('/role/update', updateRole);
router.get('/role/delete/:id', deleteRole);
router.get('/role/detail/:id', detailRole);

module.exports = router;
