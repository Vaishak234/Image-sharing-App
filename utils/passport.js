const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require("passport");
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback",
    scope: ["profile", "email"],
    
  },
  async function(accessToken, refreshToken, profile, cb) {
      const userExist = await User.findOne({ email: profile._json.email })
      if (userExist) {
          cb(null,userExist._id)
        }
      else {
          cb(null,false)
      }
  }
));

passport.serializeUser((userId, done) => {
  
    done(null,userId)
})

passport.deserializeUser((userId, done) => {
    
    done(null,userId)
})