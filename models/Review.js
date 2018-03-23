let mongoose = require("mongoose");

let reviewSchema = new mongoose.Schema({
    text:String
});

module.exports = mongoose.model("Review", reviewSchema)