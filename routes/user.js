// IMPORTING THE MODULES
const express = require("express");
const passport = require("passport");
const router = express.Router();

// IMPORTING THE CONTROLLERS
const UserController = require("../controllers/UserController");
const DownloadController = require("../controllers/DownloadController");

// routes for /users/login
router.get("/login", UserController.login);

// routes for /users/SignUp
router.get("/SignUp", UserController.signup);

// routes for /users/SignOut
router.get("/SignOut", passport.checkAuthentication, UserController.signout);

// routes for /users/create
router.post("/create", UserController.CreateUser);

//use passport as a middleware for authenication
router.post(
  "/create-session",
  passport.authenticate("local", { failureRedirect: "/users/login" }),
  UserController.CreateSession
);

// routes for /users/fetchdata
router.get(
  "/fetchdata",
  passport.checkAuthentication,
  DownloadController.downloadfile
);

module.exports = router;
