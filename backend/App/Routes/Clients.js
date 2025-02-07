const router = require("express").Router()
const { checkPermission } = require('../Middleware/permissionMiddleware');

const {AddClient,getClient,updateClient,deleteClient,detailClient,statusChange,activeClient,processPayoutRequest,payoutList,freetrialList,deleteFreetrial,helpdeskList,deleteHelpdesk,myPlan,myService,deActiveClient,getClientWithFilter,freetrialListWithFilter,getClientWithFilterExcel,getDeleteClientWithFilter,clientRequest,deleteClientrequest,orderListDetail,PlanCartList,BasketCartList,getClientWithFilterwithplan} = require('../Controllers/Clients')





const PERMISSIONS = {
    ADD: 'addclient',
    VIEW: 'viewclient',
    ALL_VIEW: 'allviewclient',
    UPDATE: 'editclient',
    DELETE: 'deleteclient',
    CHANGE_STATUS: 'clientchangestatus',
  };

router.post('/client/add', AddClient);
router.get('/client/list', getClient);
router.post('/client/listwithfilter', getClientWithFilter);
router.post('/client/deletelistwithfilter', getDeleteClientWithFilter);

router.get('/client/listwithfilterexcel', getClientWithFilterExcel);


router.put('/client/update', updateClient);
router.get('/client/delete/:id', deleteClient);
router.get('/client/detail/:id', detailClient);
router.post('/client/change-status', statusChange);
router.get('/client/activeclient',   activeClient);
router.get('/client/deactiveclient',   deActiveClient);

router.get('/client/payoutlist', payoutList);
router.get('/client/freetriallist', freetrialList);
router.post('/client/freetriallistwithfilter', freetrialListWithFilter);
router.get('/client/freetrialdelete/:id', deleteFreetrial);
router.get('/client/helpdesklist', helpdeskList);
router.get('/client/helpdeskdelete/:id', deleteHelpdesk);
router.post('/client/process-payout-request', processPayoutRequest);
router.get('/client/myplan/:id', myPlan); 
router.get('/client/myservice/:id', myService); 

router.post('/client/clientrequest', clientRequest); 
router.get('/client/deleteclientrequest/:id',   deleteClientrequest);

router.post('/client/orderlistdetail', orderListDetail); 

router.get('/client/plancartlist/:client_id', PlanCartList); 
router.get('/client/basketcartlist/:client_id', BasketCartList); 

router.post('/client/listwithfilterwithplan', getClientWithFilterwithplan);


module.exports = router;
