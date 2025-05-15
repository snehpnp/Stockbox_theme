const router = require("express").Router()

const {getSmstemplate,updateSmstemplate,detailSmstemplate} = require('../Controllers/Smstemplate')


router.get('/smstemplate/list', getSmstemplate);
router.put('/smstemplate/update', updateSmstemplate);
router.get('/smstemplate/detail/:id',  detailSmstemplate);

module.exports = router;
