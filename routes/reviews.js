let express = require("express");
let router = express.Router({mergeParams:true});

let Review = require("../models/Review");
let Film = require("../models/Film");

router.put("/:reviewID", function(req, res){
    Review.findByIdAndUpdate(req.params.reviewID, {text:req.body.review}, function(err, review){
        if(err){
            console.log(err);
        } else{
            res.redirect("/films/"+req.params.filmID);
        }
    });
});

router.get("/new", function(req, res){
    res.render("reviews/new", {filmID: req.params.filmID});
});


router.get("/:reviewID", function(req, res){
    Review.findById(req.params.reviewID, function(err, foundReview){
        if(err){
            console.log(err);
        } else{
            res.render("reviews/edit", {review:foundReview, filmID:req.params.filmID});
        }
    }); 
}); 

router.post("/", function(req, res){
    Review.create({text:req.body.review}, function(err, newReview){
        Film.findOne({filmID:req.params.filmID}, function(err, foundFilm){
            if(foundFilm){
                foundFilm.reviews.push(newReview._id);
                foundFilm.save((err, film) => {if(err) console.log(err)});
            } else{
                Film.create({filmID: req.params.filmID, reviews:[newReview._id]}, (err, newFilm) => {
                    if(err) console.log(err);
                });
            }
            res.redirect("/films/"+req.params.filmID);
        });
    });
});


router.delete("/:reviewID", function(req, res){
    Film.update({filmID: req.params.filmID} , {$pull:{reviews:req.params.reviewID}}, function(err, numRemoved){
        if(err){
            console.log(err);
        } else{
            Review.findByIdAndRemove(req.params.reviewID, function(err, review){
                if(err) console.log(err);
            });
        }
    });
    res.redirect("/films/"+req.params.filmID);
});


module.exports = router;