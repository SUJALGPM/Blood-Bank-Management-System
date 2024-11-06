const express = require('express');
const router = express.Router();
const { registerController, updateProfileController, loginController, makeDonationController,getDonorDetailsController } = require('../Controllers/Donor');

//Donor register route.....
router.post("/donor-register", registerController);

//Donor Login route....
router.post("/donor-login", loginController);

//Donor update profile route.....
router.put("/donor-update-profile/:id", updateProfileController);

//Donor makeDonation route.....
router.post("/donor-makeDonation", makeDonationController);

//Donor details route...
router.get('/donor-getDetails/:id', getDonorDetailsController);

module.exports = router;