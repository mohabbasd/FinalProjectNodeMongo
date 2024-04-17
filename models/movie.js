let mongoose = require("mongoose");

let moviesSchema = new mongoose.Schema({
    plot: {
        type: String,
        required: false
    },
    genres: {
        type: [String],
        required: false
    },
    runtime: {
        type: Number,
        required: false
    },
    cast: {
        type: [String],
        required: false
    },
    num_mflix_comments: {
        type: Number,
        required: false
    },
    poster: {
        type: String,
        required: false
    },
    title: {
        type: String,
        required: false
    },
    fullplot: {
        type: String,
        required: false
    },
    languages: {
        type: [String],
        required: false
    },
    released: {
        type: Date,
        required: false
    },
    directors: {
        type: [String],
        required: false
    },
    writers: {
        type: [String],
        required: false
    },
    awards: {
        wins: {
            type: Number,
            required: false
        },
        nominations: {
            type: Number,
            required: false
        },
        text: {
            type: String,
            required: false
        }
    },
    lastupdated: {
        type: Date,
        required: false
    },
    year: {
        type: Number,
        required: false
    },
    imdb: {
        rating: {
            type: Number,
            required: false
        },
        votes: {
            type: Number,
            required: false
        },
        id: {
            type: Number,
            required: false
        }
    },
    countries: {
        type: [String],
        required: false
    },
    type: {
        type: String,
        required: false
    },
    tomatoes: {
        viewer: {
            rating: {
                type: Number,
                required: false
            },
            numReviews: {
                type: Number,
                required: false
            }
        },
        production: {
            type: String,
            required: false
        },
        lastUpdated: {
            type: Date,
            required: false
        }
    }
});

let Movie = mongoose.model("Movie", moviesSchema);

module.exports = Movie;
