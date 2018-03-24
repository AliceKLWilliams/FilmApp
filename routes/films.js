let express = require("express");
let router = express.Router({mergeParams:true});

let fetch = require("node-fetch");

require("dotenv").config();
let apikey = process.env.APIKEY;

let Film = require("../models/Film");

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

function handleResponseError(response){
    if(!response.ok){
        console.log(response.statusText);
        throw Error(response.statusText);
    }
    return response;
}

module.exports = router;