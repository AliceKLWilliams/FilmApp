let express = require("express");
let methodOverride = require("method-override");
let mongoose = require("mongoose");
let bodyParser = require("body-parser");

let app = express();

app.set("view engine", "ejs");

app.use(express.static(__dirname + "/styles"));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


mongoose.connect("mongodb://localhost/FilmApp");

require("dotenv").config();
let apikey = process.env.APIKEY;

//Tables
let Review = require("./models/Review");
let Film = require("./models/Film");

// Routes
let filmRoutes = require("./routes/films");
let reviewRoutes = require("./routes/reviews");

app.use("/films", filmRoutes);
app.use("/films/:filmID/reviews", reviewRoutes);

// External JS
let FilmAPI = require("./js/FilmAPI");

app.get("/search", function (req, res) {
    let filmName = req.query.filmName;
    let page = (req.query.page) ? parseInt(req.query.page) : 1;

    let API = new FilmAPI(apikey);

    let filmResultsPromise = API.SearchFilm(filmName, page);
    
    filmResultsPromise.then(function (filmResults) {

       let paginationRange = 2;

        let paginationStart = page - paginationRange;
        let numberPages = Math.ceil(filmResults.totalResults / 10);
        if (page === numberPages) {
            paginationStart = page - (paginationRange + 2);
        } else if (page === 1) {
            paginationStart = page;
        }

        let paginationEnd = page + paginationRange;
        if (page === numberPages) {
            paginationEnd = page;
        } else if (page === 1) {
            paginationEnd = page + (paginationRange + 2);
        }

        let paginationData = [];
        for (let i = paginationStart; i <= paginationEnd; i++) {
            if (i > 0 && i <= numberPages) {
                paginationData.push(i);
            }
        }

        let IDs = [];
        filmResults.Search.forEach(film => {
            IDs.push(film.imdbID);
        });

        let plotPromise = API.GetShortPlots(IDs);
        plotPromise.then(function(plots){
            res.render("search", {
                films: filmResults.Search,
                totalResults: filmResults.totalResults,
                searchQuery: filmName,
                currentPage: page,
                paginationData: paginationData,
                filmPlots:plots
            });
        });
           

    }, function (err) {
        throw Error(err.statusText);
    }).catch(error => {
        console.log(error);
        res.redirect("/error");
    });
});

app.get("/error", function (req, res) {
    res.render("error");
});

app.get("/", function (req, res) {
    res.render("home");
});

app.listen(3000, function () {
    console.log("Film App is running");
});