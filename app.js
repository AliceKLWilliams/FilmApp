require("dotenv").config();

let express = require("express");
let methodOverride = require("method-override");
let mongoose = require("mongoose");
let bodyParser = require("body-parser");
let flash = require("connect-flash");

// For Authentication
let passport = require("passport");
let passportLocal = require("passport-local");
let expressSession = require("express-session");

let app = express();
app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// Authentication Setup
app.use(expressSession({
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

//Tables
let Review = require("./models/Review");
let Film = require("./models/Film");
let User = require("./models/User");

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(flash());

app.use((req, res, next) => {
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    res.locals.currentUser = req.user;
    next();
});

const dbName = process.env.DBNAME;
const dbPassword = process.env.DBPASSWORD;
mongoose.connect(`mongodb://${dbName}:${dbPassword}@ds143242.mlab.com:43242/film-app-db`)
.catch(err => console.log("Couldn't connect to database."));

//mongoose.connect(mongodb://localhost/FilmApp);

// Routes
let filmRoutes = require("./routes/films");
let reviewRoutes = require("./routes/reviews");
let authRoutes = require("./routes/authentication");
let userRoutes = require("./routes/user");

app.use("/films", filmRoutes);
app.use("/films/:filmID/reviews", reviewRoutes);
app.use(authRoutes);
app.use(userRoutes);

global.__basedir = __dirname;

// External JS
const FilmAPI = require("./modules/FilmAPI");

app.get("/search", function (req, res) {
    let filmName = req.query.filmName;

    if(filmName){
        let page = (req.query.page) ? parseInt(req.query.page) : 1;

        let pageParams = {};
        pageParams.currentPage = page;
        pageParams.searchQuery = filmName;

        let filmResultsPromise = FilmAPI.SearchFilm(filmName, page);
        filmResultsPromise.then(searchResults => {
            let paginationRange = 2;

            let paginationStart = page - paginationRange;
            let numberPages = Math.ceil(searchResults.totalResults / 10);
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

            pageParams.paginationData = paginationData;
            pageParams.numberPages = numberPages;
            pageParams.searchResults = searchResults;

            let IDs = [];
            searchResults.Search.forEach(film => {
                IDs.push(film.imdbID);
            });
            
            return FilmAPI.GetShortPlots(IDs);
        })
        .then(plots => {
            for(let i = 0; i < pageParams.searchResults.Search.length; i++){
                pageParams.searchResults.Search[i].Plot = plots[i];
            }

            res.render("results", pageParams);
        })
        .catch(error => {
            if(error === "Movie not found!"){
                res.render("results", {searchResults: {}, searchQuery:filmName});
            } else {
                res.render("error");
            }
        });
    } else {
        res.render("results", {searchResults: {}, searchQuery: filmName});
    }
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