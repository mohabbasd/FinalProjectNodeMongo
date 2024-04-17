const express = require("express");
const router = express.Router();
// Import Express validatior
const { check, validationResult } = require("express-validator");
const movie = require("../models/movie");

// Import Book and User Mongoose schemas
let Movie = require("../models/movie");
let User = require("../models/movie_embedded");

// Genres
let genres = [
  "Short",
  "Drama",
  "Animation",
  "Comedy",
  "History",
  "Romance",
  "Adventure",
  "War",
  "Action",
  "Crime",
  "Musical",
  "Fantasy",
  "Biography",
  "Horror",
  "Family",
  "Film-Noir",
  "Thriller",
  "Mystery",
  "Sci-Fi",
  "Sport",
  "Western",
];

// Attach routes to router
router
  .route("/add")
  // Get method renders the pug add_movie page
  .get(ensureAuthenticated, (req, res) => {
    // Render page with list of genres
    res.render("add_movie", {
      genres: genres,
    });
  })
  // Post method accepts form submission and saves movie in MongoDB
  .post(ensureAuthenticated, async (req, res) => {
    // Async validation check of form elements
    await check("title", "Title is required").notEmpty().run(req);
    // You can add more validation checks for other fields here

    // Get validation errors
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        // Create new movie from mongoose model
        let movie = new Movie();
        // Assign attributes based on form data
        movie.title = req.body.title;
        movie.plot = req.body.plot;
        movie.genres = req.body.genres;
        movie.runtime = req.body.runtime;
        movie.cast = req.body.cast;
        movie.num_mflix_comments = req.body.num_mflix_comments;
        movie.fullplot = req.body.fullplot;
        movie.languages = req.body.languages;
        movie.released = req.body.released;
        movie.directors = req.body.directors;
        movie.rated = req.body.rated;
        movie.awards = {
            wins: req.body["awards.wins"],
            nominations: req.body["awards.nominations"],
            text: req.body["awards.text"]
        };
        movie.lastupdated = req.body.lastupdated;
        movie.year = req.body.year;
        movie.imdb = {
            rating: req.body["imdb.rating"],
            votes: req.body["imdb.votes"],
            id: req.body["imdb.id"]
        };
        movie.countries = req.body.countries;
        movie.type = req.body.type;
        movie.tomatoes = {
            viewer: {
                rating: req.body["tomatoes.viewer.rating"],
                numReviews: req.body["tomatoes.viewer.numReviews"]
            },
            production: req.body["tomatoes.production"],
            lastUpdated: req.body["tomatoes.lastUpdated"]
        };

        try {
            // Save movie to MongoDB
            let result = await movie.save();
            if (result) {
                // Route to home to view movies if succeeded
                res.redirect(`/api/movie/${movie._id}`);
            } else {
                // Log error if failed
                res.send("Could not save movie");
            }
        } catch (err) {
            console.error(err);
            res.send("An error occurred while saving the movie");
        }
    } else {
        res.render("add_movie", {
            // Render form with errors
            errors: errors.array(),
            genres: genres,
        });
    }
});

router
  .route("/:id")
  .get(ensureAuthenticated, async (req, res) => {
    // Get book by id from MongoDB
    // Get user name by id from DB
    let movie = await Movie.findById(req.params.id);
    console.log(movie);
    if (!movie) {
      res.send("Could not find book");
    }
    /*let user = User.findById(movie.posted_by);
    if (!user) {
      res.send("Could not find user");
    } else {*/
      res.render("movie", {
        movie: movie,
        //posted_by: user.name,
      });
    //}
  })
  .delete(async (req, res) => {
    // Restrict delete if user not logged in
    if (!req.user._id) {
      res.status(500).send();
    }

    // Create query dict
    let query = { _id: req.params.id };

    let movie = await Movie.findById(req.params.id);
    if (!movie) {
      res.send("Could not find movie");
    }
    // Restrict delete if user did not post book
    if (movie.posted_by != req.user._id) {
      res.status(500).send();
    } else {
      // MongoDB delete with Mongoose schema deleteOne
      let result = Movie.deleteOne(query, function (err) {
        if (!result) {
          res.status(500).send();
        }
        res.send("Successfully Deleted");
      });
    }
  });

  router
  .route("/edit/:id")
  .get(ensureAuthenticated, async (req, res) => {
    // Get book by id from MongoDB
    let movie = await Movie.findById(req.params.id)
      if(!movie){
        res.send("Could not find book")
      }
      // Restrict to only allowing user that posted to make updates
      /*if (book.posted_by != req.user._id) {
        res.redirect("/");
      }*/
      res.render("edit_movie", {
        movie: movie,
        genres: genres,
      });
    })
  .post(async (req, res) => {
    // Create dict to hold book values
    let movie = {};

    // Assign attributes based on form data
    movie.title = req.body.title;
    movie.plot = req.body.plot;
    movie.genres = req.body.genres;
    movie.runtime = req.body.runtime;
    movie.cast = req.body.cast;
    movie.num_mflix_comments = req.body.num_mflix_comments;
    movie.fullplot = req.body.fullplot;
    movie.languages = req.body.languages;
    movie.released = req.body.released;
    movie.directors = req.body.directors;
    movie.rated = req.body.rated;
    movie.awards = {
        wins: req.body["awards.wins"],
        nominations: req.body["awards.nominations"],
        text: req.body["awards.text"]
    };
    movie.lastupdated = req.body.lastupdated;
    movie.year = req.body.year;
    movie.imdb = {
        rating: req.body["imdb.rating"],
        votes: req.body["imdb.votes"],
        id: req.body["imdb.id"]
    };
    movie.countries = req.body.countries;
    movie.type = req.body.type;
    movie.tomatoes = {
        viewer: {
            rating: req.body["tomatoes.viewer.rating"],
            numReviews: req.body["tomatoes.viewer.numReviews"]
        },
        production: req.body["tomatoes.production"],
        lastUpdated: req.body["tomatoes.lastUpdated"]
    };
    
    let query = { _id: req.params.id };

    let movie_db = await Movie.findById(req.params.id)
    if(!movie_db){
      res.send("Could not find book")
    }
    console.log(movie_db)
    // Restrict to only allowing user that posted to make updates
    if (movie_db.posted_by != req.user._id) {
      res.send("Only user who posted book can edit")
    } else {
      // Update book in MongoDB
      let result = await Movie.updateOne(query, movie)
        if (!result) {
          res.send("Could not update book")
        } else {
          res.redirect("/");
        }
    }
  })

// Function to protect routes from unauthenticated users
function ensureAuthenticated(req, res, next) {
  // If logged in proceed to next middleware
  if (req.isAuthenticated()) {
    return next();
    // Otherwise redirect to login page
  } else {
    res.redirect("/users/login");
  }
}

module.exports = router;
