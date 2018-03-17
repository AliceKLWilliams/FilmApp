let express = require("express");
let app = express();

let fetch = require("node-fetch");

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/styles"));

app.get("/search", function(req,res){
    let filmName = req.query.filmName;
    let page = (req.query.page) ? parseInt(req.query.page) : 1;
    
    fetch("http://www.omdbapi.com/?apikey=5f9b92a2&s="+filmName+"&page="+page+"&type=movie")
    .then(response => response.json())
    .then(data => {
        res.render("search", {
            films:data.Search,
            totalResults:data.totalResults,  
            filmName:filmName
        });
    });
});

app.get("/", function(req, res){
    res.render("home");
});

app.listen(3000, function(){
    console.log("Film App is running");
});