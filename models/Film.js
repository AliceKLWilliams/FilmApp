let mongoose = require("mongoose");

mongoose.promise = Promise;

let filmSchema = new mongoose.Schema({
    filmID: String,
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    watched: {
        type:Number,
        default:0
    },
    want:{
        type:Number,
        default:0
    }
});

filmSchema.statics.FindFilm = function(ID){
    return new Promise((resolve, reject) => {
        this.findOne({filmID:ID})
        .then((film) => {
            if(!film){
                this.create({filmID:ID})
                .then((newFilm) => {resolve(newFilm)});
            } else{
                resolve(film);
            }
        }).catch((err) => {reject(err)});
    });
}

filmSchema.methods.AddToWatched = function(num){
    this.watched += num;
    return this.save();
};

module.exports = mongoose.model("Film", filmSchema)