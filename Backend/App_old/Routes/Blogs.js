const router = require("express").Router()

const multer = require('multer');
const path = require('path');

const { checkPermission } = require('../Middleware/permissionMiddleware');

const {AddBlogs,getBlogs,updateBlogs,deleteBlogs,detailBlogs,statusChange,activeBlogs} = require('../Controllers/Blogs')

const PERMISSIONS = {
    ADD: 'addblogs',
    VIEW: 'viewblogs',
    ALL_VIEW: 'allviewblogs',
    UPDATE: 'editblogs',
    DELETE: 'deleteblogs',
    CHANGE_STATUS: 'blogchangestatus',
  };



router.post('/blogs/add', AddBlogs);
router.get('/blogs/list', getBlogs);
router.post('/blogs/update', updateBlogs);
router.get('/blogs/delete/:id', deleteBlogs);
router.get('/blogs/detail/:id', detailBlogs);
router.post('/blogs/change-status', statusChange);
router.get('/blogs/activeblogs',   activeBlogs);


module.exports = router;
