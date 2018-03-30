let Review = require("../models/Review");

var middleware = {
    isLoggedIn: (req, res, next) => {
        if(req.isAuthenticated()){
            return next();
        } else{
            req.flash("error", "You need to be logged in.");
            res.redirect("/login");
        }
    },

    isReviewOwner: (req, res, next) => {
        if(req.isAuthenticated()){
            Review.findById(req.params.reviewID, (err, foundReview) =>{
                if(foundReview.author.equals(req.user._id)){
                    return next();
                } else{
                    req.flash("error", "You need to be the review author.");
                    res.redirect("/");
                }
            });
        } else{
            req.flash("error", "You need to be logged in.");
            res.redirect("/login");
        }
    }
}

module.exports = middleware;