const express = require("express");
const router = express.Router({mergeParams:true});

const middleware = require("./middleware");

// DB Models
const Review = require("../models/Review");
const Film = require("../models/Film");

// External JS
const FilmAPI = require("../modules/FilmAPI");

router.put("/:reviewID", middleware.isReviewOwner, (req, res) => {
    Review.findByIdAndUpdate(req.params.reviewID, {
        title:req.body.title,
        text:req.body.review, 
        ratings: {
            overall:req.body.overall, 
            story:req.body.story,
            writing:req.body.writing,
            cinematography:req.body.cinematography,
            music:req.body.music,
            acting:req.body.acting
        }
    })
    .then((review) => {
        res.redirect("/films/"+req.params.filmID);
    })
    .catch((err) =>{
        console.log(err);
        res.redirect("/error");
    });
});

router.get("/new", middleware.isLoggedIn, (req, res) => {
    FilmAPI.SearchID(req.params.filmID, "short")
    .then((film) => {
        let filmCategories = [];
        let attributes = Object.keys(Review.schema.paths);
        attributes.forEach((attr) => {
            if(attr.startsWith("rating")){
                filmCategories.push(attr.slice(8));
            }
        });
        res.render("reviews/new", {filmID: req.params.filmID, filmData:film, categories:filmCategories});
    })
    .catch((err) =>{
        console.log(err);
        res.redirect("/error");
    });
});


router.get("/:reviewID/edit", middleware.isReviewOwner, (req, res) => {
    let promises = Promise.all([Review.findById(req.params.reviewID), FilmAPI.SearchID(req.params.filmID, "short")]);
    promises.then(([review, film]) => {
        res.render("reviews/edit", {
            review:review, 
            filmID:req.params.filmID, 
            filmData:film
        });
    })
    .catch((err) => {
        console.log(err);
        res.redirect("/error");
    });
}); 

router.post("/", function(req, res){
    var createReview = Review.create({
        title:req.body.title,
        text:req.body.review, 
        author:req.user._id,
        ratings:{
            overall:req.body.overall, 
            story:req.body.story,
            writing:req.body.writing,
            cinematography:req.body.cinematography,
            music:req.body.music,
            acting:req.body.acting
        }
    });
    var findFilm = Film.FindFilm(req.params.filmID);

    Promise.all([createReview, findFilm])
    .then((data) =>{
        let newReview = data[0];
        let foundFilm = data[1];
        
        foundFilm.reviews.push(newReview._id);
        foundFilm.save((err, film) => {
            if (err) {
                console.log(err);
                return res.redirect("/error");
            }
            res.redirect("/films/"+req.params.filmID);
        });
    }).catch((err) =>{
        console.log(err);
        res.redirect("/error");
    });
});


router.delete("/:reviewID", middleware.isReviewOwner, function(req, res){
    let updateFilm = Film.update({filmID: req.params.filmID} , {$pull:{reviews:req.params.reviewID}});
    let deleteReview =  Review.findByIdAndRemove(req.params.reviewID);

    Promise.all([updateFilm, deleteReview])
    .then((data) => {res.redirect("/films/"+req.params.filmID)})
    .catch((err) => {
        console.log(err);
        res.redirect("/error");
    });
});


module.exports = router;