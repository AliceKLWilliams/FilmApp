let mongoose = require("mongoose");

mongoose.promise = Promise;

let filmSchema = new mongoose.Schema({
    filmID: String,
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Review"
        }
    ]
});

module.exports = mongoose.model("Film", filmSchema)