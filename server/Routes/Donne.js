const express = require('express');
const router = express.Router();
const {registerController,loginController,updateProfileController,receiveBloodController, getDoneeDetailsController  } = require('../Controllers/Donne');

//Donee register route.....
router.post("/donee-register", registerController);

//Donee Login route....
router.post("/donee-login", loginController);

//Donee update profile route.....
router.put("/donee-update-profile/:id", updateProfileController);

//Donee request blood route.....
router.post("/donee-request-blood/:id", receiveBloodController);

//Donee details route...
router.get('/donee-getDetails/:id', getDoneeDetailsController);
    

module.exports = router;