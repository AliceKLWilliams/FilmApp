let express = require("express");
let router = express.Router({mergeParams:true});

let User = require("../models/User");
let FilmAPI = require("../")

router.get("/user/:id", (req, res) =>{
    User.findById(req.params.id, (err, user) =>{
        if(err){
            console.log(err);
            res.render("/error");
        }
        
        res.render("user/show", {
            user:user 
        });
    }); 
});

module.exports = router;