let express = require("express");
let router = express.Router({mergeParams:true});

let Film = require("../models/Film");
let User = require("../models/User");

let middleware = require("./middleware");

const FilmAPI = require("../modules/FilmAPI");

router.get("/:id", function(req, res){
    let filmID = req.params.id;

    let FilmPromise = FilmAPI.SearchID(filmID, "full");
    let FindFilm = Film.findOne({filmID:filmID}).populate({
        path:"reviews",
        model:"Review",
        populate: {
            path:"author",
            model:"User"
        }
    }).exec();

    Promise.all([FilmPromise, FindFilm])
    .then((data) => {
        // Actors String -> Array
        let arrActors = data[0].Actors.split(",");

        for(let actor in arrActors){
            actor.replace(/\s/g, '');
        }

        data[0].Actors = arrActors;

        // Get Average Review Score
        let avgReview = 0;
        if(data[1]){
            data[1].reviews.forEach(review => {
                avgReview += review.ratings.overall;
            });
            avgReview = avgReview / data[1].reviews.length;
        }
        

        res.render("films/show", {
            data:data[0],
            modelData:data[1],
            avgReview
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
            let filmPromise = foundFilm.IncrementWatched();

            Promise.all([filmPromise, foundUser.save()])
            .then(() => {
                req.flash("success", "Added to watch list!");
                res.redirect("back");
            }).catch((err) => {throw err;});

        } else{
            foundUser.watched.pull(req.params.id);

            Promise.all([foundUser.save(), foundFilm.DecrementWatched()])
            .then(() => {
                req.flash("success", "Removed from watch list!");
                res.redirect("back");
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
            let filmPromise = foundFilm.IncrementWanted();

            Promise.all([filmPromise, foundUser.save()])
            .then(() => {
                req.flash("success", "Added to wanted list!");
                res.redirect("back");
            }).catch((err) => {throw err;});

        } else{
            foundUser.want.pull(req.params.id);

            Promise.all([foundUser.save(), foundFilm.DecrementWanted()])
            .then(() => {
                req.flash("success", "Removed from wanted list!");
                res.redirect("back");
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