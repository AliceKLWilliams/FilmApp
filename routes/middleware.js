let Review = require("../models/Review");

var middleware = {
    isLoggedIn: (req, res, next) => {
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error", "You need to be logged in.");
        res.redirect("/login");
    },

    isReviewOwner: (req, res, next) => {
        if(req.isAuthenticated()){
            Review.findById(req.params.reviewID, (err, foundReview) =>{
                if(foundReview.author.equals(req.user._id)){
                    return next();
                }
            });
        }
        req.flash("error", "You have to be the review owner.");
        res.redirect("/")
    }
}

module.exports = middleware;