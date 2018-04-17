let express = require("express");
let router = express.Router({mergeParams:true});

let fetch = require("node-fetch");

require("dotenv").config();
let apikey = process.env.APIKEY;

let Film = require("../models/Film");
let User = require("../models/User");

let middleware = require("./middleware");

let FilmAPI = require("../public/js/FilmAPI");

router.get("/:id", function(req, res){
    let filmID = req.params.id;
    let API = new FilmAPI(apikey);

    let FilmPromise = API.SearchID(filmID, "full");
    let FindFilm = Film.findOne({filmID:filmID}).populate("reviews").exec();

    Promise.all([FilmPromise, FindFilm])
    .then((data) => {
        res.render("films/show", {
            data:data[0],
            modelData:data[1] 
        });
    })
    .catch((err) => {
        console.log(err);
        res.redirect("/error");
    });
});

router.put("/:id/watched", middleware.isLoggedIn, (req, res) => {
    let findUser = User.findOne({_id:req.user._id});
    let findFilm = Film.FindFilm(req.params.id);
    Promise.all([findUser, findFilm])
    .then( (data) => {
        let foundUser = data[0];
        let foundFilm = data[1];

        if(!foundUser.watched.includes(req.params.id)){
            foundUser.watched.push(req.params.id);
            let filmPromise = foundFilm.AddToWatched(1);

            Promise.all([filmPromise, foundUser.save()])
            .then(() => {
                req.flash("success", "Added to watch list!");
                res.redirect("/films/"+req.params.id);
            }).catch((err) => {throw err;});

        } else{
            foundUser.watched.pull(req.params.id);

            Promise.all([foundUser.save(), foundFilm.AddToWatched(-1)])
            .then(() => {
                req.flash("success", "Removed from watch list!");
                res.redirect("/films/"+req.params.id);
            })
            .catch((err) => {throw err;});
        }
    })
    .catch((err) => {
        console.log(err);
        res.redirect("/error");
    });

});


router.put("/:id/want", middleware.isLoggedIn, (req, res) => {
    let findUser = User.findOne({_id:req.user._id});
    let findFilm = Film.FindFilm(req.params.id);

    Promise.all([findUser, findFilm])
    .then((data) => {
        let foundUser = data[0];
        let foundFilm = data[1];

        if(!foundUser.want.includes(req.params.id)){
            foundUser.want.push(req.params.id);
            let filmPromise = foundFilm.AddToWanted(1);

            Promise.all([filmPromise, foundUser.save()])
            .then(() => {
                req.flash("success", "Added to wanted list!");
                res.redirect("/films/"+req.params.id);
            }).catch((err) => {throw err;});

        } else{
            foundUser.want.pull(req.params.id);

            Promise.all([foundUser.save(), foundFilm.AddToWanted(-1)])
            .then(() => {
                req.flash("success", "Removed from wanted list!");
                res.redirect("/films/"+req.params.id);
            })
            .catch((err) => {throw err;});
        }
    })
    .catch((err) => {
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