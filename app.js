let express = require("express");
let app = express();

let fetch = require("node-fetch");

require("dotenv").config();

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/styles"));

let apikey = process.env.APIKEY;

app.get("/search", function(req,res){
    let filmName = req.query.filmName;
    let page = (req.query.page) ? parseInt(req.query.page) : 1;

    fetch("http://www.omdbapi.com/?apikey="+apikey+"&s="+filmName+"&page="+page+"&type=movie")
    .then(handleResponseError)
    .then(response => response.json())
    .then(data => {
        res.render("search", {
            films:data.Search,
            totalResults:data.totalResults,  
            filmName:filmName
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
    .then(data => {
        res.render("films/show", {
            data:data
        });
    }).catch(error => {
        res.redirect("/error");
    });
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