let plm = require("passport-local-mongoose");

let mongoose = require("mongoose");

let userSchema = new mongoose.Schema({
    username:String,
    password:String
});

// Add useful authentication methods
userSchema.plugin(plm);

module.exports = mongoose.model("User", userSchema);