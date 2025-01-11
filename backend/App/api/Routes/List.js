const router = require("express").Router()

const {Blogslist,Newslist,Bannerlist,Plancategorysist,getPlansByPlancategoryId,addPlanSubscription,myPlan,Couponlist,Signallist,applyCoupon,showSignalsToClients,Servicelist,Faqlist,detailContent,showSignalsToClientsClose,BasketList,pastPerformance,addBasketSubscription,getallPlan,addFreeTrail,BroadcastList,myFreetrial,basicSetting,pastPerformances,myService,CloseSignal,showSignalsToClientsCloses,Notification,Bank,Qrcode,BlogslistwithPagination,NewslistwithPagination,Refer,BasketLists,BasketstockList,myBasketPlan,placeOrder,exitPlaceOrder,checkBasketSell,BasketListss,BasketstockLists,getLivePrice,MyPorfolio,BasketstockListBalance,getBasketVersionOrder,Logout,addRequest} = require('../Controllers/List')


router.get('/api/list/blogs',Blogslist);
router.get('/api/list/blogspagination',BlogslistwithPagination);

router.get('/api/list/news', Newslist);
router.get('/api/list/newspagination', NewslistwithPagination);

router.get('/api/list/banner', Bannerlist); 
router.get('/api/list/plancategory', Plancategorysist); 
router.get('/api/list/planbycategory', getPlansByPlancategoryId); 
router.get('/api/list/getallplan', getallPlan); 


router.post('/api/list/addplansubscription', addPlanSubscription); 
router.post('/api/list/freetrial', addFreeTrail); 
router.post('/api/list/addrequest', addRequest); 


router.post('/api/list/addbasketsubscription', addBasketSubscription); 

router.get('/api/list/myplan/:id', myPlan); 
router.get('/api/list/coupon', Couponlist);
router.get('/api/list/signal', Signallist);
router.post('/api/list/applycoupon', applyCoupon);
router.post('/api/list/signalclient', showSignalsToClients);
router.post('/api/list/closesignalclient', showSignalsToClientsCloses);
router.post('/api/list/closesignal', CloseSignal);
router.post('/api/list/signalclientclose', showSignalsToClientsClose);

router.get('/api/list/service', Servicelist);
router.get('/api/list/faq', Faqlist);
router.get('/api/list/content/:id', detailContent);
router.get('/api/list/basket/:clientId', BasketList);
router.get('/api/list/basket', BasketLists);
router.post('/api/list/baskets', BasketListss);
router.get('/api/list/basketstock/:id', BasketstockList);
router.get('/api/list/myportfolio/:id/:clientid', MyPorfolio);

router.get('/api/list/basketstocks/:id/:clientid', BasketstockLists);
router.get('/api/list/basketstockbalance/:id/:clientid', BasketstockListBalance);

router.post('/api/list/getbasketversionorder', getBasketVersionOrder);

router.get('/api/list/mybasketplan/:id', myBasketPlan); 


router.get('/api/list/past-performance/:id', pastPerformance);
router.get('/api/list/past-performances', pastPerformances);

router.post('/api/list/broadcast', BroadcastList);
router.get('/api/list/myfreetrial/:id', myFreetrial); 
router.get('/api/list/basicsetting', basicSetting); 
router.get('/api/list/myservice/:id', myService); 
router.get('/api/list/notification/:id', Notification); 
router.get('/api/list/bank', Bank);
router.get('/api/list/qrcode', Qrcode);
router.get('/api/refer', Refer);
router.post('/api/placeorder', placeOrder);
router.post('/api/exitplaceorder', exitPlaceOrder);
router.post('/api/checkbasketsell', checkBasketSell);
router.get('/api/getliveprice', getLivePrice);
router.get('/api/list/logout/:id', Logout); 


module.exports = router;
