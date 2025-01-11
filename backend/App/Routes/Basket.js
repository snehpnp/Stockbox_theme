const router = require("express").Router()
const multer = require('multer');
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage });
const { checkPermission } = require('../Middleware/permissionMiddleware'); // Path to your middleware
const {AddBasket,getBasket,updateBasket,deleteBasket,detailBasket,statusChange,activeBasket,AddStockInBasket,AddStockInBasketForm,UpdateStockInBasketForm,getBasketstockList,addBasketSubscription,BasketSubscriptionList,BasketSubscriptionListWithId,activeBasketList,statusRebanceChange,statusPublishChange} = require('../Controllers/Basket')


const PERMISSIONS = {
    ADD: 'addbasket',
    VIEW: 'viewbasket',
    ALL_VIEW: 'allviewbasket',
    UPDATE: 'editbasket',
    DELETE: 'deletebasket',
    CHANGE_STATUS: 'basketchangestatus',
  };
  

router.post('/basket/add', AddBasket);
router.post('/basket/list', getBasket);
router.put('/basket/update', updateBasket);
router.get('/basket/delete/:id', deleteBasket);
router.get('/basket/detail/:id', detailBasket);
router.post('/basket/change-status', statusChange);
router.post('/basket/change-status-publish', statusPublishChange);
router.post('/basket/change-status-rebalance', statusRebanceChange);

router.get('/basket/activebasket',   activeBasket);
router.post('/basket/activebasketlist',   activeBasketList);

router.post('/basket/addstockbasket', upload.single('file'), AddStockInBasket);
router.post('/basket/addstockbasketform',  AddStockInBasketForm);
router.post('/basket/updatestockbasketform',  UpdateStockInBasketForm);
router.get('/basket/stocklist/:id', getBasketstockList);
router.post('/basket/addbasketsubscription', addBasketSubscription); 
router.post('/basket/basketsubscriptionlist', BasketSubscriptionList); 
router.post('/basket/basketsubscriptionlistwithid', BasketSubscriptionListWithId); 



module.exports = router;
