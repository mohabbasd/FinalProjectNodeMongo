// Import express
const express = require("express");
const path = require("path");
// Import mongoose
const mongoose = require("mongoose");
// Import passport library
const passport = require("passport");
// Import session
const session = require("express-session");
// Import CORS
const cors = require('cors')
// MongoDB Config
const config = require("./config/database");

// Import movie routes
var movie_routes = require("./routes/movies");

// Import movie routes
var user_routes = require("./routes/users");
// Import user routes
//var user_routes = require("./routes/movies_embedded");

// Connect to database
mongoose.connect(config.database);
let db = mongoose.connection;

// Check connection
db.once("open", function () {
  console.log("Connected to MongoDB");
});

// Check for DB errors
db.on("error", function (err) {
  console.log("DB Error");
});

// Initialize express app
const app = express();

// Initialize built-in middleware for urlencoding and json
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("/public"));

// Initialize session
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {},
}));

// Passport config
require("./config/passport")(passport);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Enable CORS on all routes
app.use(cors())

// Import Movie Mongoose schemas
let Movie = require("./models/movie");

// Load view engine
app.set("/", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Wildcard route to allow user to be
// used in templates
app.get("*", function(req, res, next){
    res.locals.user = req.user || null;
    next();
})

//app.use("/users", user_routes);
app.use("/api/movie", movie_routes);

//app.use("/users", user_routes);
app.use("/api/users", user_routes);

app.get("/", async function (req, res) {
  let perPage = parseInt(req.query.perPage) || 10; // Parse perPage as integer
  let page = parseInt(req.query.page) || 1; // Parse page as integer
  
  try {
    const movies = await Movie.find()
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .exec();

    const count = await Movie.countDocuments();

    const current = page.toString();
    const pages = Math.ceil(count / perPage);

    res.render("index", {
      movies: movies,
      current: page,
      page: page,
      pages: pages,
      perPage: perPage.toString(), // Convert perPage to string for comparison
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while fetching movies");
  }
});


/*app.use("/", async function (req, res) {
  let movies = await Movie.find({})
    if (!movies) {
      res.send("No books found")
    } else {
      // Pass books to index
      res.render("index", {
        movies: movies,
      });
}});

app.use("/", async function (req, res) {
  let books = await Book.find({})
    if (!books) {
      res.send("No books found")
    } else {
      // Pass books to index
      res.render("index", {
        books: books,
      });
}});*/

// Set constant for port
const PORT = process.env.PORT || 8000;

// Listen on a port
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
