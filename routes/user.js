let express = require("express");
let router = express.Router({mergeParams:true});

let mongoose = require("mongoose");

let fs = require("fs");
let GridStream = require("gridfs-stream");

let User = require("../models/User");
let FilmAPI = require("../modules/FilmAPI");

let multiparty = require("connect-multiparty")();

require("dotenv").config();
let apikey = process.env.APIKEY;

router.get("/user/:id", (req, res) =>{
    User.findById(req.params.id)
    .then((user) =>{
        let Search = new FilmAPI(apikey);
        let watchedPromise = Search.GetBasicInfo(user.watched);
        let wantPromise = Search.GetBasicInfo(user.want);
        
        Promise.all([watchedPromise, wantPromise]).then((films) =>{
            res.render("user/show", {
                user:user,
                watched:films[0],
                want:films[1]
            });
        })
        .catch(err =>{
            req.flash("error", err);
            res.render("/error");
        });
    })
    .catch((err) =>{
        req.flash("error", err);
        res.render("/error");
    });
});

router.post("/user/:id/photo", multiparty, (req, res) => {
    let db = mongoose.connection.db;
    let mongoDriver = mongoose.mongo;
    let gfs = new GridStream(db, mongoDriver);
    gfs.collection("userimages");

    let writeStream = gfs.createWriteStream({
        filename: req.files.photo.name,
        mode: "w",
        content_type: req.files.photo.mimetype,
        metadata:req.body,
        root: "userimages"
    });

    fs.createReadStream(req.files.photo.path).pipe(writeStream);

    writeStream.on("close", (file) => {
        User.findById(req.params.id)
        .then((user) => {
            user.profilePic = file._id;
            user.save((err, user) => {
                if(err){
                    req.flash("error", err);
                    return res.render("/error");
                }
            });
        }).catch((err) => {
            req.flash("error", err);
            res.render("/error");
        });
    });

    fs.unlink(req.files.photo.path, (err) => {
        if(err){
            req.flash("error", err);
            res.render("/error");
        }
    });

    res.redirect("/user/"+req.params.id);
});

router.get("/user/:id/photo/:photoId", (req, res) => {
    let db = mongoose.connection.db;
    let mongoDriver = mongoose.mongo;
    let gfs = new GridStream(db, mongoDriver);
    gfs.collection("userimages");

    let options = {
        _id:req.params.photoId,
        root:"userimages"
    }
    
    gfs.exist(options, (err, found) => {
        if(found){
            gfs.createReadStream(options).pipe(res);
        } else{
            let defaultPath = __basedir + "/public/pics/placeholder.jpg";
            res.sendFile(defaultPath);
        }
    });
});

module.exports = router;