var express = require('express');
var router = express.Router();
var requestController =require('../../controllers/siteVisitRequests') 
 import checkAuth from "../../middleware/check-auth";

router.get('/', checkAuth, requestController.fetch_all_requests)
router.post('/', checkAuth, requestController.create_request)
router.put('/:id', checkAuth, requestController.update_request)

module.exports = router;