const router = require("express").Router()

const {AddClient,detailClient,loginClient,forgotPassword,resetPassword,changePassword,updateProfile,deleteClient,otpSubmit,aadhaarVerification,aadhaarOtpSubmit,clientKycAndAgreement,uploadDocument,downloadDocument,requestPayout,payoutList,referEarn,brokerLink,deleteBrokerLink,addHelpDesk,helpdeskList,resend,orderList,orderListDetail,basketOrderList} = require('../Controllers/Clients')



router.post('/api/client/add',AddClient);
router.get('/api/client/detail/:id', detailClient);
router.post('/api/client/login', loginClient); 
router.post('/api/client/forgot-password', forgotPassword);
router.post('/api/client/reset-password', resetPassword);
router.post('/api/client/change-password', changePassword);
router.post('/api/client/update-profile', updateProfile);
router.get('/api/client/deleteclient/:id', deleteClient);
router.post('/api/client/otp_submit', otpSubmit);
router.post('/api/client/aadhaarverification', aadhaarVerification);
router.post('/api/client/aadhaarotpsubmit', aadhaarOtpSubmit);
router.post('/api/client/clientkycandagreement', clientKycAndAgreement);
router.post('/api/client/uploaddocument', uploadDocument);
router.post('/api/client/downloaddocument', downloadDocument);
router.post('/api/client/payoutlist', payoutList);
router.post('/api/client/requestpayout', requestPayout);
router.post('/api/client/referearn', referEarn);
router.post('/api/client/brokerlink', brokerLink);
router.post('/api/client/deletebrokerlink', deleteBrokerLink);
router.post('/api/client/addhelpdesk',addHelpDesk);
router.get('/api/client/helpdesk/:id', helpdeskList);
router.post('/api/client/resend',resend);
router.post('/api/client/orderlist', orderList);
router.post('/api/client/orderlistdetail', orderListDetail);
router.post('/api/client/basketorderlist', basketOrderList);






module.exports = router;
