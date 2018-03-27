let mongoose = require("mongoose");

let reviewSchema = new mongoose.Schema({
    text:String,
    stars:Number
});

module.exports = mongoose.model("Review", reviewSchema)