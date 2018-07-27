let Review = require("../models/Review");

var middleware = {
    isLoggedIn: (req, res, next) => {
        if(req.isAuthenticated()){
            next();
        } else{
            req.flash("error", "You need to be logged in.");
            res.redirect("/login");
        }
    },

    isReviewOwner: (req, res, next) => {
        if(req.isAuthenticated()){
            Review.findById(req.params.reviewID, (err, foundReview) =>{
                if(foundReview.author.equals(req.user._id)){
                    next();
                } else{
                    req.flash("error", "You need to be the review author.");
                    res.redirect("/");
                }
            });
        } else{
            req.flash("error", "You need to be logged in.");
            res.redirect("/login");
        }
    },

    isCurrentUser: (req, res, next) => {
        if(req.isAuthenticated()){
            if(req.user._id == req.params.id){
                next();
            } else{
                req.flash("error", "You cannot access someone else's profile.")
                res.redirect("back");
            }
        } else{
            req.flash("error", "You cannot access someone else's profile.")
            res.redirect("back");
        }
    }
}

module.exports = middleware;