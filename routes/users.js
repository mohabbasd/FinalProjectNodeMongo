const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
// Import Express validatior
const { check, validationResult } = require("express-validator");
const path = require("path");

const registerPage = path.join(__dirname, "../public/pages/register.html");
const loginPage = path.join(__dirname, "../public/pages/login.html");

let User = require("../models/user");

// Attach routes to router
router
  .route("/register")
  // Get method renders the register user page
  .get((req, res) => {
    // Render page with list of genres
    res.sendFile(registerPage);
  })
  .post(async (req, res) => {
    // Async validation check of form elements
    await check("name", "Name is required").notEmpty().run(req);
    await check("email", "Email is required").notEmpty().run(req);
    await check("email", "Email is invalid").isEmail().run(req);
    await check("password", "Password is required").notEmpty().run(req);
    await check("confirm_password", "Confirm password is required")
      .notEmpty()
      .run(req);
    await check(
      "confirm_password",
      "Password and confirm password do not match"
    )
      .equals(req.body.password)
      .run(req);

    // Get validation errors
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      // Create new user from mongoose model
      let newUser = new User();
      // Assign attributes based on form data
      newUser.name = req.body.name;
      newUser.email = req.body.email;

      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(req.body.password, salt, async function (err, hashed_password) {
          if (err) {
            console.log(err);
          } else {
            newUser.password = hashed_password;
            // Save new user to MongoDB
            let result = await newUser.save()
            if (!result) {
              // Log error if failed
              res.send("Could not save user")
            } else {
              // Route to login if user created
              res.redirect("/api/users/login");
            }
          }
        });
      });
    } else {
      // Render form with errors
      res.render("register", {
        errors: errors.array(),
      });
    }
  });

router
  .route("/login")
  .get(async (req, res) => {
      res.sendFile(loginPage, {
      })
    })
    .post(async (req, res, next) => {
      // Check form elements are submitted and valid
      await check("email", "Email is required").notEmpty().run(req);
      await check("email", "Email is invalid").isEmail().run(req);
      await check("password", "Password is required").notEmpty().run(req);
  
      // Get validation errors
      const errors = validationResult(req);
  
      if (errors.isEmpty()) {
        // Authenticate using passport and redirect
        passport.authenticate("local", {
          successRedirect: "/",
          failureRedirect: "/api/users/login",
          failureMessage: true,
        })(req, res, next);
      } else {
        // If form errors then render login with errors
        res.render("login", {
          errors: errors.array(),
        });
      }
    });

    router.get("/logout", (req, res) => {
      // Logout user
      req.logout(() => {
        // Redirect to login page after logout
        res.redirect("/api/users/login");
      });
    });
 
// Function to protect routes from unauthenticated users
function ensureAuthenticated(req, res, next) {
  // If logged in proceed to next middleware
  if (req.isAuthenticated()) {
    return next();
    // Otherwise redirect to login page
  } else {
    res.redirect("/api/users/login");
  }
}

module.exports = router;
