let mongoose = require("mongoose");

mongoose.promise = Promise;

let reviewSchema = new mongoose.Schema({
    text:String,
    stars:Number,
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
});

module.exports = mongoose.model("Review", reviewSchema)