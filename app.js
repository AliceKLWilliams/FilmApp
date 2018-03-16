let express = require("express");
let app = express();

app.get("/", function(req, res){
    res.send("Welcome to my Film App!");
});

app.listen(3000, function(){
    console.log("Film App is running");
});