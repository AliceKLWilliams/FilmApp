let plm = require("passport-local-mongoose");

let mongoose = require("mongoose");

mongoose.promise = Promise;

let userSchema = new mongoose.Schema({
    username:String,
    password:String,
    watched: [{
        type:String
    }],
    want: [{
        type:String
    }]
});

// Add useful authentication methods
userSchema.plugin(plm);

module.exports = mongoose.model("User", userSchema);