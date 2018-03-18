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

        let paginationRange = 2;

        let paginationStart = page - paginationRange;
        let numberPages = Math.ceil(data.totalResults/10);
        if(page === numberPages){
            paginationStart = page - (paginationRange+1);
        } else if(page === 1){
            paginationStart = page;
        }

        let paginationEnd = page+paginationRange;
        if(page === numberPages){
            paginationEnd = page;
        } else if(page === 1){
            paginationEnd = page + (paginationRange+1);
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