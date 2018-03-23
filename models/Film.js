let mongoose = require("mongoose");

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