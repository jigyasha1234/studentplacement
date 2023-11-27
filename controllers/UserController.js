
// IMPORTING THE ALL DATABASE COLLECTIONS
const User = require("../models/user");
const Student = require("../models/student");
const Company = require("../models/company")

// AFTER THE LOGIN PAGE
module.exports.home = async function(req,resp){

    if (!req.isAuthenticated()) {
      return resp.redirect("/users/login");
    }

    let students = await Student.find({});
    let company = await Company.find({});

    return resp.render("home",{students,company});
}

// SIGN / LOGIN
module.exports.login = function (req, resp) {

  if (!req.isAuthenticated()) {
    return resp.render("sigin");
  }

  return resp.redirect("/");
};


// SIGN UP FORM
module.exports.signup = function (req, resp) {

  if (!req.isAuthenticated()) {
    return resp.render("signup");
  }

  return resp.redirect("/");
};

// CREATE A USER FROM THE SIGNUP DATA
module.exports.CreateUser = async function (req, resp) {
  try {
    if (req.body.password != req.body.confirmpassword) {
      req.flash("error", "Password doesn't match..Renter..");
      return resp.redirect("back");
    }

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      const newuser = await User.create({
        name: req.body.username,
        email: req.body.email,
        password: req.body.password,
      });
      await newuser.save();

      if (!newuser) {
        console.log("error in creating new user");
        return resp.redirect("back");
      }

      console.log("Successfully create the user");

      return resp.redirect("/users/login");
      
    } else {
      req.flash("error", "E-Mail ID Already present");
      return resp.redirect("back");
    }
  } catch (error) {
    console.log(`Error during submit the sigup form:  ${error}`);
    resp.redirect("back");
  }
};

// CREATE A SESSION 
module.exports.CreateSession = function (req, resp) {
  req.flash("success", "Yayy !!! Logged In Successfully");
  return resp.redirect("/");
};

// SIGNOUT
module.exports.signout = function (req, res) {
  req.flash("success", "Ooops !!! Logged Out Successfully");
  req.logout();
  return res.redirect("/");
};