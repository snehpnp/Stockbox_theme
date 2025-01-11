const router = require("express").Router()
const { checkPermission } = require('../Middleware/permissionMiddleware'); // Path to your middleware

const {AddUser,getUser,updateUser,deleteUser,detailUser,loginUser,statusChange,updateUserPermissions,forgotPassword,resetPassword,changePassword,updateProfile,activeUser , sendMessage} = require('../Controllers/Users')


const PERMISSIONS = {
    ADD: 'adduser',
    VIEW: 'viewuser',
    ALL_VIEW: 'allviewuser',
    UPDATE: 'edituser',
    DELETE: 'deleteuser',
    CHANGE_STATUS: 'userchangestatus',
    UPDATE_PERMISSIONS: 'updatepermissions'
  };

  
  // Apply permission checks
  router.post('/user/add', AddUser);
  router.get('/user/list', getUser);
  router.put('/user/update', updateUser);
  router.get('/user/delete/:id', deleteUser);
  router.get('/user/detail/:id', detailUser);
  router.post('/user/login', loginUser); // No permission check for login
  router.post('/user/change-status', statusChange);
  router.post('/user/update-permissions', updateUserPermissions);
  router.post('/user/forgot-password', forgotPassword);
  router.post('/user/reset-password', resetPassword);
  router.post('/user/change-password', changePassword);
  router.post('/user/update-profile', updateProfile);
  router.get('/user/activeUser', activeUser);
  router.post('/sendMessage', sendMessage);


  
  
  module.exports = router;
