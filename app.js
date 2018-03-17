let express = require("express");
let app = express();

let fetch = require("node-fetch");

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/styles"));

app.get("/search", function(req,res){
    let filmName = req.query.filmName;
    
    fetch("http://www.omdbapi.com/?apikey=5f9b92a2&s="+filmName)
    .then(response => response.json())
    .then(data => {
        console.log(data.Search.slice(0,10));
        res.render("search", {films:data.Search.slice(0,10)});
    });
});

app.get("/", function(req, res){
    res.render("home");
});

app.listen(3000, function(){
    console.log("Film App is running");
});