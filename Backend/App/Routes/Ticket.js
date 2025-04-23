const router = require("express").Router()

const {getTicketWithFilter,deleteTicket,detailTicket,rePly,statusChange} = require('../Controllers/Ticket')

router.post('/ticket/reply', rePly);
router.post('/ticket/listwithfilter', getTicketWithFilter);
router.get('/ticket/delete/:id', deleteTicket);
router.get('/ticket/detail/:ticketid', detailTicket);
router.post('/ticket/change-status', statusChange);



module.exports = router;
