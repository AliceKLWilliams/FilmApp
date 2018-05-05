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
            res.render("/error");
        });
    })
    .catch((err) =>{
        res.redirect("/error");
    });
});

router.post("/user/:id/photo", multiparty, (req, res) => {
    let db = mongoose.connection.db;
    let mongoDriver = mongoose.mongo;
    let gfs = new GridStream(db, mongoDriver);
    gfs.collection("userimages");


    User.findById(req.user._id)
    .then((user) => {
        gfs.exist({
            _id:user.profilePic,
            root:"userimages"
        }, (err, found) => {
            if(found) {
                if(err) return handleError(err, res);
                gfs.remove({
                    _id:user.profilePic,
                    root:"userimages"
                }, (err, gridStore) => {
                        if(err) return handleError(err, res);
                        writeProfilePic(req, res, user, req.files.photo);
                    });
            } else {
                writeProfilePic(req, res, user, req.files.photo);
            }
        });
    });
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

function handleError(err, res){
    console.log(err);
    return res.render("/error");
}

function writeProfilePic(req, res, user, fileObj) {
    let db = mongoose.connection.db;
    let mongoDriver = mongoose.mongo;
    let gfs = new GridStream(db, mongoDriver);
    gfs.collection("userimages");


    let options = {
        filename: fileObj.name,
        mode: "w",
        content_type: fileObj.mimetype,
        metadata:req.body,
        root: "userimages"
    }

    let writeStream = gfs.createWriteStream(options);
    fs.createReadStream(fileObj.path).pipe(writeStream);

    writeStream.on("close", (file) => {
        user.profilePic = file._id;
        user.save((err, user) => {
            if(err) return handleError(err, res);

            fs.unlink(fileObj.path, (err) => {
                if(err) return handleError(err, res);
                return res.redirect("/user/"+req.params.id);
            });
        });
    });
}

module.exports = router;