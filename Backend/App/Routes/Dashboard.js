const router = require("express").Router()
const cors = require('cors');


const { getcount, getLicense, pastPerformance, pastPerformances, CloseSignal, PlanExipreList, CloseSignalWithFilter, PlanExipreListWithFilter, CompanyStatus, Notification, statusChangeNotifiction, totalClient, NotificationList,allStatusChangeNotifiction,pastPerformancewithtype,CloseSignalwithtype,referEarn,PlanExipreListWithFilterExport,CloseSignalWithFilterExport,getMonthlySubscriptionCounts,getMonthlyProfitLoss,getDailyProfitLoss,getAllStates,getCityByStates, sendMailToClient } = require('../Controllers/Dashboard')

router.get('/dashboard/getcount', getcount);
router.post('/dashboard/getlicense', getLicense);
router.get('/dashboard/past-performance/:id', pastPerformance);
router.get('/dashboard/past-performances', pastPerformances);
router.post('/dashboard/closesignal', CloseSignal);
router.post('/dashboard/closesignalwithfilter', CloseSignalWithFilter);

router.get('/dashboard/planexiprelist', PlanExipreList);
router.post('/dashboard/planexiprelistwithfilter', PlanExipreListWithFilter);

router.post('/dashboard/companystatus', CompanyStatus);
router.get('/dashboard/notification', Notification);
router.post('/dashboard/notificationlist', NotificationList);

router.post('/dashboard/statuschangenotifiction', statusChangeNotifiction);
router.get('/dashboard/allstatuschangenotifiction', allStatusChangeNotifiction);

router.get('/dashboard/totalclientmonth', cors(), totalClient);

router.get('/dashboard/past-performance-type/:id/:callduration?', pastPerformancewithtype);
router.post('/dashboard/closesignalwithtype', CloseSignalwithtype);

router.post('/dashboard/referearn', referEarn);


router.post('/dashboard/planexiprelistwithfilterexport', PlanExipreListWithFilterExport);
router.post('/dashboard/closesignalwithfilterexport', CloseSignalWithFilterExport);

router.post('/dashboard/getmonthlysubscriptioncounts', getMonthlySubscriptionCounts);
router.get('/dashboard/getmonthlyprofitloss/:id', getMonthlyProfitLoss);
router.get('/dashboard/getdailyprofitloss/:id', getDailyProfitLoss);
router.get('/dashboard/getstates', getAllStates);
router.get('/dashboard/getcitybystates/:stateName', getCityByStates);
router.post('/dashboard/sendmailtoclient', sendMailToClient);
sendMailToClient



module.exports = router;
