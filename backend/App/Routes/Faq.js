const router = require("express").Router()
const { checkPermission } = require('../Middleware/permissionMiddleware'); // Path to your middleware

const {AddFaq,getFaq,updateFaq,deleteFaq,detailFaq,statusChange,activeFaq} = require('../Controllers/Faq')

const PERMISSIONS = {
    ADD: 'addfaq',
    VIEW: 'viewfaq',
    ALL_VIEW: 'allviewfaq',
    UPDATE: 'editfaq',
    DELETE: 'deletefaq',
    CHANGE_STATUS: 'faqchangestatus',
  };


router.post('/faq/add', AddFaq);
router.get('/faq/list', getFaq);
router.put('/faq/update', updateFaq);
router.get('/faq/delete/:id', deleteFaq);
router.get('/faq/detail/:id', detailFaq);
router.post('/faq/change-status', statusChange);
router.get('/faq/activefaq',   activeFaq);

module.exports = router;
