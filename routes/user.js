let express = require("express");
let router = express.Router({mergeParams:true});

let mongoose = require("mongoose");

// Modules for profile picture
let fs = require("fs");
let GridStream = require("gridfs-stream");
let multiparty = require("connect-multiparty")();

// DB Models
let User = require("../models/User");
let Film = require("../models/Film");
let FilmAPI = require("../modules/FilmAPI");

let middleware = require("./middleware");

let db;
let gfs;
mongoose.connection.on('connected', () => {
    db = mongoose.connection.db;  
    let mongoDriver = mongoose.mongo;
    gfs = new GridStream(db, mongoDriver);
    gfs.collection("userimages");
});

router.get("/user/:id", (req, res) =>{
    let foundUser;

    User.findById(req.params.id)
    .then((user) =>{
        let watchedPromise = FilmAPI.GetBasicInfo(user.watched);
        let wantPromise = FilmAPI.GetBasicInfo(user.want);
        foundUser = user;
        return Promise.all([watchedPromise, wantPromise]);
    }).then((films) => {
        res.render("user/show", {
            user:foundUser,
            watched:films[0],
            want:films[1]
        });
    })
    .catch((err) => handleError(err, res));
});

router.get("/user/:id/password", middleware.isCurrentUser, (req, res) => {
    res.render("user/password", {userID:req.params.id});
});

router.post("/user/:id/password", middleware.isCurrentUser, (req, res) => {
    User.findById(req.user._id) // Find current user
    .then(user => {
        // Change password
        user.changePassword(req.body.oldPassword, req.body.newPassword, (err) => {
            if(err){
                req.flash("error", "Incorrect password entered.")
                return res.redirect("/user/"+req.params.id+"/password");
            }
            req.flash("success", "Password changed successfully!");
            res.redirect("/user/"+req.params.id);
        });
    });
});

router.post("/user/:id/photo", multiparty, (req, res) => {
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
    let options = {
        _id:req.params.photoId,
        root:"userimages"
    }
    
    gfs.exist(options, (err, found) => {
        if(found){
            gfs.createReadStream(options).pipe(res);
        } else{
            let defaultPath = __basedir + "/public/pics/placeholder.jpg";
            return res.sendFile(defaultPath);
        }
    });
});

router.delete("/user/watched", (req, res) => {
    let watchedFilms = req.user.watched;
    let findInDB = [];

    watchedFilms.forEach((film) => {
        findInDB.push(Film.find({filmID: film}));
    });

    Promise.all(findInDB)
    .then((foundFilms) => {
        let removeFromStats = [];
        foundFilms[0].forEach((dbFilm) => {
            removeFromStats.push(dbFilm.DecrementWatched());
        });

        return Promise.all(removeFromStats);
    }).then(() => {
        req.user.watched = [];
        return req.user.save();
    }).then(() => {
        req.flash("success", "Cleared watched list.");
        res.redirect("back");
    })
    .catch((err) => {
        return handleError(err, res);
    })
});


router.delete("/user/want", (req, res) => {
    let wantedFilms = req.user.want;
    let findInDB = [];

    wantedFilms.forEach((film) => {
        findInDB.push(Film.find({filmID: film}));
    });

    Promise.all(findInDB)
    .then((foundFilms) => {
        let removeFromStats = [];
        foundFilms[0].forEach((dbFilm) => {
            removeFromStats.push(dbFilm.DecrementWanted());
        });
        return Promise.all(removeFromStats);
    }).then(() => {
        req.user.want = [];
        return req.user.save();
    }).then(() => {
        req.flash("success", "Cleared wanted list.");
        res.redirect("back");
    })
    .catch((err) => {
        return handleError(err, res);
    })
});

function handleError(err, res){
    console.log(err);
    return res.render("error");
}

function writeProfilePic(req, res, user, fileObj) {
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