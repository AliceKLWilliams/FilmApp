let express = require("express");
let router = express.Router({mergeParams:true});

let fetch = require("node-fetch");

require("dotenv").config();
let apikey = process.env.APIKEY;

let Film = require("../models/Film");

router.get("/:id", function(req, res){
    let filmID = req.params.id;
    fetch("http://www.omdbapi.com/?apikey="+apikey+"&plot=full&i="+filmID)
    .then(handleResponseError)
    .then(response => response.json())
    .then(APIData => {
        Film.findOne({filmID:filmID}).populate("reviews").exec(function(err, foundFilm){
            res.render("films/show", {
                data:APIData,
                modelData:foundFilm
            });
        });
    }).catch(error => {
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