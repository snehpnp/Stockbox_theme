const router = require("express").Router()
const { checkPermission } = require('../Middleware/permissionMiddleware'); // Path to your middleware

const {AddContent,getContent,updateContent,deleteContent,detailContent,statusChange,activeContent} = require('../Controllers/Content')

const PERMISSIONS = {
    ADD: 'addcontent',
    VIEW: 'viewcontent',
    ALL_VIEW: 'allviewcontent',
    UPDATE: 'editcontent',
    DELETE: 'deletecontent',
    CHANGE_STATUS: 'contentchangestatus',
  };


router.post('/content/add', AddContent);
router.get('/content/list', getContent);
router.put('/content/update', updateContent);
router.get('/content/delete/:id', deleteContent);
router.get('/content/detail/:id', detailContent);
router.post('/content/change-status', statusChange);
router.get('/content/activecontent',   activeContent);

module.exports = router;
