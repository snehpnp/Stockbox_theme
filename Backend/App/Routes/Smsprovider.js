const router = require("express").Router()

const {getSmsprovider,updateSmsprovider,setActiveSmsProvider} = require('../Controllers/Smsprovider')



router.get('/smsprovider/list', getSmsprovider);
router.put('/smsprovider/update', updateSmsprovider);
router.post('/smsprovider/changestatus', setActiveSmsProvider);




module.exports = router;
