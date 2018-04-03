let express = require("express");
let router = express.Router({mergeParams:true});

let fetch = require("node-fetch");

require("dotenv").config();
let apikey = process.env.APIKEY;

let Film = require("../models/Film");
let User = require("../models/User");

let middleware = require("./middleware");

let FilmAPI = require("../js/FilmAPI");

router.get("/:id", function(req, res){
    let filmID = req.params.id;
    let API = new FilmAPI(apikey);

    let FilmPromise = API.SearchID(filmID, "full");

    FilmPromise.then(function(data){
        Film.findOne({filmID:filmID}).populate("reviews").exec(function(err, foundFilm){
            res.render("films/show", {
                data:data,
                modelData:foundFilm
            });
        });
    }, function(err){
        throw Error(err.statusText);
    }).catch(function(err){
        console.log(err);
        res.redirect("/error");
    });
});

router.put("/:id/watched", middleware.isLoggedIn, (req, res) => {
    User.findOne({_id:req.user._id}, (err, foundUser) => {
        if(err){
            console.log(err);
            return res.redirect("/error");
        }

        if(!foundUser.watched.includes(req.params.id)){
            foundUser.watched.push(req.params.id);
            foundUser.save((err, user) => {
                if(err){
                    console.log(err);
                    return res.redirect("/error");
                }

                req.flash("success", "Added to watch list!");
                res.redirect("/films/"+req.params.id);
            });
        } else{
            foundUser.watched.pull(req.params.id);
            foundUser.save((err, user) => {
                if(err){
                    console.log(err);
                    return res.redirect("/error");
                }

                req.flash("success", "Removed from watch list!");
                res.redirect("/films/"+req.params.id);
            });
        }
    }); 
});


router.put("/:id/want", middleware.isLoggedIn, (req, res) => {
    User.findOne({_id:req.user._id}, (err, foundUser) => {
        if(err){
            console.log(err);
            return res.redirect("/error");
        }

        if(!foundUser.want.includes(req.params.id)){
            foundUser.want.push(req.params.id);
            foundUser.save((err, user) => {
                if(err){
                    console.log(err);
                    return res.redirect("/error");
                }

                req.flash("success", "Added to wanted list!");
                res.redirect("/films/"+req.params.id);
            });
        } else{
            foundUser.want.pull(req.params.id);
            foundUser.save((err, user) => {
                if(err){
                    console.log(err);
                    return res.redirect("/error");
                }

                req.flash("success", "Removed from wanted list!");
                res.redirect("/films/"+req.params.id);
            });
        }
    }); 
});

function handleResponseError(response){
    if(!response.ok){
        console.log(response.statusText);
        throw Error(response.statusText);
    }
    return response;
}

module.exports = router;