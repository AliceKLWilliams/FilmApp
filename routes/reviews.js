let express = require("express");
let router = express.Router({mergeParams:true});

let middleware = require("./middleware");

let Review = require("../models/Review");
let Film = require("../models/Film");

let FilmAPI = require("../public/js/FilmAPI");

let apikey = process.env.APIKEY;

router.put("/:reviewID", middleware.isReviewOwner, (req, res) => {
    Review.findByIdAndUpdate(req.params.reviewID, {text:req.body.review, stars:req.body.overall})
    .then((review) => {
        res.redirect("/films/"+req.params.filmID);
    })
    .catch((err) =>{
        console.log(err);
        res.redirect("/error");
    });
});

router.get("/new", middleware.isLoggedIn, (req, res) => {
    let API = new FilmAPI(apikey);
    API.SearchID(req.params.filmID, "short")
    .then((film) => {
        res.render("reviews/new", {filmID: req.params.filmID, filmData:film});
    })
    .catch((err) =>{
        console.log(err);
        res.redirect("/error");
    });
});


router.get("/:reviewID", middleware.isReviewOwner, (req, res) => {
    Review.findById(req.params.reviewID)
    .then((foundReview) =>{
        res.render("reviews/edit", {review:foundReview, filmID:req.params.filmID});
    })
    .catch((err) => {
        console.log(err);
        res.redirect("/error");
    });
}); 

router.post("/", function(req, res){
    var createReview = Review.create({text:req.body.review, stars:req.body.overall, author:req.user._id});
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
        });
        res.redirect("/films/"+req.params.filmID);
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