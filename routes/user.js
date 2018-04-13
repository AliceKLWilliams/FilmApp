let express = require("express");
let router = express.Router({mergeParams:true});

let User = require("../models/User");
let FilmAPI = require("../js/FilmAPI");

require("dotenv").config();
let apikey = process.env.APIKEY;

router.get("/user/:id", (req, res) =>{
    User.findById(req.params.id)
    .then((user) =>{
        let Search = new FilmAPI(apikey);
        let watchedPromise = Search.GetBasicInfo(user.watched);
        let wantPromise = Search.GetBasicInfo(user.want);
        
        Promise.all([watchedPromise, wantPromise]).then((films) =>{
            res.render("user/show", {
                user:user,
                watched:films[0],
                want:films[1]
            });
        })
        .catch(err =>{
            req.flash("error", err);
            res.render("/error");
        });
    })
    .catch((err) =>{
        req.flash("error", err);
        res.render("/error");
    });
});

module.exports = router;