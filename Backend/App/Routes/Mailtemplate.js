const router = require("express").Router()
const { checkPermission } = require('../Middleware/permissionMiddleware'); // Path to your middleware

const {getMailtemplate,updateMailtemplate,detailMailtemplate} = require('../Controllers/Mailtemplate')

const PERMISSIONS = {
    ADD: 'addMailtemplate',
    VIEW: 'viewMailtemplate',
    ALL_VIEW: 'allviewMailtemplate',
    UPDATE: 'editMailtemplate',
    DELETE: 'deleteMailtemplate',
    CHANGE_STATUS: 'Mailtemplatechangestatus',
  };


router.get('/mailtemplate/list', getMailtemplate);
router.put('/mailtemplate/update', updateMailtemplate);
router.get('/mailtemplate/detail/:id',  detailMailtemplate);

module.exports = router;
