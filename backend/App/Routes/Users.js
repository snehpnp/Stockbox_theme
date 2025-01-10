const router = require("express").Router()

const {loginUser,forgotPassword,resetPassword,changePassword,updateProfile} = require('../Controllers/Users')


  router.post(' /login', loginUser); 
  router.post('/user/forgot-password', forgotPassword);
  router.post('/user/reset-password', resetPassword);
  router.post('/user/change-password', changePassword);
  router.post('/user/update-profile', updateProfile);

  
  
  module.exports = router;
