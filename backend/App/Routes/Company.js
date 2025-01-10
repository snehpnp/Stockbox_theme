const router = require("express").Router()

const {AddCompany,getCompany,updateCompany,deleteCompany,detailCompany,statusChange,activeCompany,clientList} = require('../Controllers/Company')



router.post('/company/add', AddCompany);
router.get('/company/list', getCompany);
router.post('/company/update', updateCompany);
router.get('/company/delete/:id', deleteCompany);
router.get('/company/detail/:id', detailCompany);
router.post('/company/change-status', statusChange);
router.get('/company/activecompany',   activeCompany);
router.get('/company/clientlist/:id',   clientList);


module.exports = router;
