let express = require("express");
let router = express.Router({mergeParams:true});

let passport = require("passport");

let User = require("../models/User");

router.get("/register", (req, res) =>{
    res.render("authentication/register");
}); 

router.post("/register", (req, res) =>{
    // Register a new user
    User.register(new User({username:req.body.username}), req.body.password, (err,user) =>{
        // Then login with this user
        passport.authenticate("local")(res, req, ()=>{
            res.redirect("/");
        });
    });
}); 

module.exports = router;