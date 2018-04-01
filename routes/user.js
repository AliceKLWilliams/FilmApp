let express = require("express");
let router = express.Router({mergeParams:true});

let User = require("../models/User");
let FilmAPI = require("../js/FilmAPI");

require("dotenv").config();
let apikey = process.env.APIKEY;

router.get("/user/:id", (req, res) =>{
    User.findById(req.params.id, (err, user) =>{
        if(err){
            console.log(err);
            res.render("/error");
        }

        let Search = new FilmAPI(apikey);
        let FilmPromise = Search.GetBasicInfo(user.watched);

        FilmPromise.then(data =>{
            res.render("user/show",{
                user:user,
                watched:data
            });
        })
        .catch(err =>{
            req.flash("error", err);
            res.render("/error");
        });
    }); 
});

module.exports = router;