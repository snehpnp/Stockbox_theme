const router = require("express").Router()

const multer = require('multer');
const path = require('path');

const { checkPermission } = require('../Middleware/permissionMiddleware'); // Path to your middleware
const {AddNews,getNews,updateNews,deleteNews,detailNews,statusChange,activeNews} = require('../Controllers/News')

const PERMISSIONS = {
    ADD: 'addnews',
    VIEW: 'viewnews',
    ALL_VIEW: 'allviewnews',
    UPDATE: 'editnews',
    DELETE: 'deletenews',
    CHANGE_STATUS: 'newschangestatus',
  };
  


router.post('/news/add', AddNews);
router.get('/news/list', getNews);
router.post('/news/update', updateNews);
router.get('/news/delete/:id', deleteNews);
router.get('/news/detail/:id', detailNews);
router.post('/news/change-status', statusChange);
router.get('/news/activenews',   activeNews);

module.exports = router;
