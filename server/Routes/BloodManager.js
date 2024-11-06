const express = require('express');
const router = express.Router();
const { registerBloodManagerController, loginBloodManagerController, approveOrDenyRequest, bloodbankstock, FetchPendingRequests, recentDonations, recentBloodRequests } = require('../Controllers/BloodManager');

//BM register route.....
router.post("/bm-register", registerBloodManagerController);

//BM Login route....
router.post("/bm-login", loginBloodManagerController);

//BM requestHadle route....
router.post("/bm-request-handle", approveOrDenyRequest);

//BM bloodbank table stock status route...
router.get("/bm-bloodbank-stock",bloodbankstock);

//BM Handle pending request get api route..
router.get("/bm-fetch-pending-request",FetchPendingRequests);

//BM recent donation get api route..
router.get("/bm-recent-donations",recentDonations);

//BM recent donation request get api route..
router.get("/bm-recent-donations-request",recentBloodRequests);


module.exports = router;