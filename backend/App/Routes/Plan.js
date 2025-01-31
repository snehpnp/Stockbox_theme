const router = require("express").Router()
const { checkPermission } = require('../Middleware/permissionMiddleware'); // Path to your middleware
const {AddPlan,getPlan,updatePlan,deletePlan,detailPlan,statusChange,activePlan,addPlanSubscription,paymentHistory,getPlanByClient,paymentHistoryWithFilter,addPlanSubscriptionAddToCart} = require('../Controllers/Plan')


const PERMISSIONS = {
    ADD: 'addplan',
    VIEW: 'viewplan',
    ALL_VIEW: 'allviewplan',
    UPDATE: 'editplan',
    DELETE: 'deleteplan',
    CHANGE_STATUS: 'planchangestatus',
    addPlanSubscription: 'addPlanSubscription',
  };
  

router.post('/plan/add', AddPlan);
router.get('/plan/list', getPlan);
router.get('/plan/listbyclient/:id', getPlanByClient);
router.put('/plan/update', updatePlan);
router.get('/plan/delete/:id', deletePlan);
router.get('/plan/detail/:id', detailPlan);
router.post('/plan/change-status', statusChange);
router.get('/plan/activeplan',   activePlan);
router.post('/plan/addplansubscription', addPlanSubscription); 
router.get('/plan/paymenthistory', paymentHistory); 
router.post('/plan/paymenthistorywithfilter', paymentHistoryWithFilter); 

router.post('/plan/addplansubscriptionaddtocart', addPlanSubscriptionAddToCart); 

module.exports = router;
