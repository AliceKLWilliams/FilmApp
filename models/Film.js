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

filmSchema.methods.IncrementWatched = function(){
    this.watched += 1;
    return this.save();
}

filmSchema.methods.DecrementWatched = function(){
    this.watched -= 1;
    return this.save();
}

filmSchema.methods.IncrementWanted = function(){
    this.wanted += 1;
    return this.save();
}

filmSchema.methods.DecrementWanted = function(){
    this.wanted -= 1;
    return this.save();
}

module.exports = mongoose.model("Film", filmSchema)