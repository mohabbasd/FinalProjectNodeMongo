let mongoose = require("mongoose");

let usersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: false
    }
});

let User = mongoose.model("User", usersSchema);

module.exports = User;
