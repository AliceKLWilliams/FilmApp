let express = require("express");
let app = express();

let fetch = require("node-fetch");
let methodOverride = require("method-override");
let mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/FilmApp");

require("dotenv").config();

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/styles"));
app.use(methodOverride("_method"));

let bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Tables
let Review = require("./models/Review");
let Film = require("./models/Film");

let apikey = process.env.APIKEY;

app.get("/search", function(req,res){
    let filmName = req.query.filmName;
    let page = (req.query.page) ? parseInt(req.query.page) : 1;

    fetch("http://www.omdbapi.com/?apikey="+apikey+"&s="+filmName+"&page="+page+"&type=movie")
    .then(handleResponseError)
    .then(response => response.json())
    .then(data => {

        let paginationRange = 2;

        let paginationStart = page - paginationRange;
        let numberPages = Math.ceil(data.totalResults/10);
        if(page === numberPages){
            paginationStart = page - (paginationRange+2);
        } else if(page === 1){
            paginationStart = page;
        }

        let paginationEnd = page+paginationRange;
        if(page === numberPages){
            paginationEnd = page;
        } else if(page === 1){
            paginationEnd = page + (paginationRange+2);
        }

        let paginationData = [];
        for(let i = paginationStart; i<= paginationEnd; i++){
            if(i > 0 && i<=numberPages){
                paginationData.push(i);
            }
        }

        res.render("search", {
            films:data.Search,
            totalResults:data.totalResults,  
            searchQuery:filmName,
            currentPage:page,
            paginationData:paginationData
        });
    }).catch(error => {
        res.redirect("/error");
    });
});

app.get("/films/:id", function(req, res){
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

app.post("/films/:filmID/reviews", function(req, res){
    Review.create({text:req.body.review}, function(err, newReview){
        Film.findOne({filmID:req.params.filmID}, function(err, foundFilm){
            if(foundFilm){
                foundFilm.reviews.push(newReview._id);
                foundFilm.save((err, film) => {if(err) console.log(err)});
            } else{
                Film.create({filmID: req.params.filmID, reviews:[newReview._id]}, (err, newFilm) => {
                    if(err) console.log(err);
                });
            }
            res.redirect("/films/"+req.params.filmID);
        });
    });
});

app.get("/films/:filmID/reviews/new", function(req, res){
    res.render("reviews/new", {filmID: req.params.filmID});
});

app.delete("/films/:filmID/reviews/:reviewID", function(req, res){
    Film.update({filmID: req.params.filmID} , {$pull:{reviews:req.params.reviewID}}, function(err, numRemoved){
        if(err){
            console.log(err);
        } else{
            Review.findByIdAndRemove(req.params.reviewID, function(err, review){
                if(err) console.log(err);
            });
        }
    });
    res.redirect("/films/"+req.params.filmID);
});

app.get("/error", function(req, res){
    res.render("error");
}); 

app.get("/", function(req, res){
    res.render("home");
});

app.listen(3000, function(){
    console.log("Film App is running");
});

function handleResponseError(response){
    if(!response.ok){
        console.log(response.statusText);
        throw Error(response.statusText);
    }
    return response;
}