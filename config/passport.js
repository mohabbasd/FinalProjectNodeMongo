// Import passport-local, bcrypt, and user schema
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const bcrypt = require("bcryptjs");

module.exports = function (passport) {
  // Local Strategy
  passport.use(
    // Create local strategy with email as username
    new LocalStrategy({ usernameField: "email" }, async function (
      email,
      password,
      done
    ) {
      // Use email to query user
      let query = { email: email };
      let user = await User.findOne(query);
      // If user is not found
      if (!user) {
        return done(null, false, { message: "User not found" });
      }
      // Verify hashed password
      bcrypt.compare(password, user.password, function (err, isMatch) {
        if (err) {
          console.log(err);
        }
        // If hashed passwords match
        if (isMatch) {
          // Login succeeded
          return done(null, user);
        } else {
          return done(null, false, { message: "Invalid credentials" });
        }
      });
    })
  );

  // Serialize user into session
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  // Deserialize user from session
  passport.deserializeUser(async function (id, done) {
    try {
      const user = await User.findById(id);
      if (!user) {
        return done(null, false, { error: "User not found" });
      }
      done(null, user);
    } catch (err) {
      done(err, false, { error: err });
    }
  });
};