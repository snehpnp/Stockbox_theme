const router = require("express").Router()
const { checkPermission } = require('../Middleware/permissionMiddleware'); // Path to your middleware

const {AddSignal,getSignal,deleteSignal,detailSignal,closeSignal,targethitSignal,getSignalWithFilter,updateReport,showSignalsToClients,allShowSignalsToClients,AddSignalwithPlan,getPlansByService,getSymbol,getSignalWithFilterplan,closeSignalwithplan,getSignalWithFilterExport,getSignalWithFilterplanExport,AddSignals,getSignalsListWithFilte} = require('../Controllers/Signal')

const PERMISSIONS = {
    ADD: 'addsignal',
    VIEW: 'viewsignal',
    ALL_VIEW: 'allviewsignal',
    DELETE: 'deletesignal',
    CLOSE: 'closesignal',
    HIT: 'targethit',
  };
  
  
router.post('/signal/add', AddSignal);
router.get('/signal/list', getSignal);
router.post('/signal/listwithfilter', getSignalWithFilter);
router.get('/signal/delete/:id', deleteSignal);
router.get('/signal/detail/:id', detailSignal);
router.post('/signal/closesignal', closeSignal);
router.post('/signal/targethitsignal', targethitSignal);
router.post('/signal/updatereport', updateReport);
router.post('/signal/signalclient', showSignalsToClients);
router.post('/signal/allsignalclient', allShowSignalsToClients);

router.post('/signal/addsignalwithplan', AddSignalwithPlan);
router.post('/signal/getplansbyservice', getPlansByService);
router.get('/signal/getsymbol', getSymbol);
router.post('/signal/listwithfilterwithplan', getSignalWithFilterplan);
router.post('/signal/closesignalwithplan', closeSignalwithplan);

router.post('/signal/listwithfilterexport', getSignalWithFilterExport);

router.post('/signal/listwithfilterwithplanexport', getSignalWithFilterplanExport);


router.post('/signal/addsignalwithstock', AddSignals);
router.post('/signal/getsignalslistwithfilte', getSignalsListWithFilte);



module.exports = router;
