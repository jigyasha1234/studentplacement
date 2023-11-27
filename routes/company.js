// IMPORTING THE MODULES

const express = require("express");
const passport = require("passport");
const router = express.Router();

// IMPORTING THE CONTROLLER
const CompanyController = require('../controllers/CompanyController');

// routes for /company/
router.get("/", passport.checkAuthentication, CompanyController.companyhome);

// routes for /company/allocateinterview"
router.get("/allocateinterview", passport.checkAuthentication, CompanyController.allocateInterview);

// routes for /company/scheduleInterview
router.post("/scheduleInterview",passport.checkAuthentication,CompanyController.scheduleInterview);

// routes for /company/update/<id>
router.post("/update/:id",passport.checkAuthentication,CompanyController.updateRecords);





module.exports = router;