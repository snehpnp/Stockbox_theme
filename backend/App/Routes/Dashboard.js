const router = require("express").Router()
const cors = require('cors');


const { getcount, getLicense, pastPerformance, pastPerformances, CloseSignal, PlanExipreList, CloseSignalWithFilter, PlanExipreListWithFilter, CompanyStatus, Notification, statusChangeNotifiction, totalClient, NotificationList,allStatusChangeNotifiction,pastPerformancewithtype,CloseSignalwithtype } = require('../Controllers/Dashboard')

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


module.exports = router;
