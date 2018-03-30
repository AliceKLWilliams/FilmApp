let express = require("express");
let router = express.Router({mergeParams:true});

let passport = require("passport");
let LocalStrategy = require("passport-local");

let User = require("../models/User");

passport.use(new LocalStrategy(User.authenticate()));

router.get("/register", (req, res) =>{
    res.render("authentication/register");
}); 

router.post("/register", (req, res) =>{
    // Register a new user
    User.register(new User({username:req.body.username}), req.body.password, (err,user) =>{
        // Then login with this user
        if(err){
            req.flash("error", err.message);
            res.redirect("/");
        } else{  
            passport.authenticate("local")(req, res, ()=>{
                req.flash("success", `You are registered as: ${req.body.username}!`);
                res.redirect("/");
            });
        }
    });
}); 


router.get("/login", (req, res) =>{
    res.render("authentication/login");
});

router.post("/login", passport.authenticate("local" , {successRedirect:"/", failureRedirect:"/login", failureFlash:true}));

module.exports = router;