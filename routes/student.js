// IMPORTING THE MODULES

const express = require("express");
const passport = require("passport");
const router = express.Router();


// IMPORTING THE CONTROLLERS
const StudentController = require('../controllers/StudentControllers');

// routes for /student/create
router.get("/create", passport.checkAuthentication, StudentController.createreq);

// routes for /student/createstudent
router.post("/createstudent", passport.checkAuthentication, StudentController.createStudent);

// routes for /student//view/<id>
router.get("/view/:id",passport.checkAuthentication, StudentController.viewdata);

// routes for /student//update/<id>
router.get("/update/:id",passport.checkAuthentication, StudentController.updatereq);

// routes for /student/modifydone
router.post("/modifydone",passport.checkAuthentication, StudentController.updtedone);

// routes for /student/delete/<id>
router.get("/delete/:id",passport.checkAuthentication, StudentController.deletedata);


module.exports = router;