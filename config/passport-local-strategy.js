//PASSPORT LOCAL STRATEGY WITH SETTING THE USER IN OUR REQUEST

const passport = require('passport');
const LocalStratgey = require('passport-local').Strategy;

const User = require('../models/user');

passport.use(
  new LocalStratgey(
    {
      usernameField: "email",
      passReqToCallback: true,
    },
    function (req,email, password, done) {
      //find a user and establish identity
      User.findOne({ email: email }, function (error, user) {
        if (error) {
          req.flash("error", err);
          return done(error);
        }

        if (!user || user.password != password) {
          req.flash("error", "Invalid the user/password");
          console.log("Invalid Username/password");
          return done(null, false);
        }

        return done(null, user);
      });
    }
  )
);

//serializing the user to decide the which key is kept in the cookies
passport.serializeUser(function(user,done){
    done(null,user.id);
})

//deserializing the user from the key in cookies
passport.deserializeUser(function(id,done){

     User.findById(id, function (err, user) {
       if (err) {
         console.log("Error in finding user--> Passport");
         return done(err);
       }

       return done(null, user);
     });
})

//check if the user is authenicated
passport.checkAuthentication = function(req,resp,next){

    //if the user is signed in then pass to request's next function(controller's action)
    if (req.isAuthenticated()) {
      return next();
    }

    return resp.redirect('/users/login');

}

//set the authenicated user for views
passport.setAuthenticatedUser = function (req, resp, next) {
  if (req.isAuthenticated()) {
    resp.locals.user = req.user;
  }
  next();
};





module.exports = passport;
