'use strict';
var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

var db_connect_str = 'mongodb://localhost:27017/Formosa';

var try_login = function (db, username, password, callback) {
    var dbo = db.db('Formosa');

    var collection = dbo.collection('Users');

    var data = { "username": username, "password": password }

    collection.find(data).toArray(function (err, result) {
        if (err) {
            console.log("MongoDB Error : " + err);
            return;
        }
        callback(result);
    })
}


//GET, with username & password
router.post('/login', function (req, res) {
    var username = req.query.username;
    var password = req.query.password;
    MongoClient.connect(db_connect_str, {useNewUrlParser: true} , function(err, db) {
        if (err) {
            console.log("DB Connection Error! " + err);
            res.status(500);
            res.render('error', {
                message: "DB Connection Error! " + err,
                error: {}
            });
        }
        try_login(db, username, password, function (result) {
            if (result.length >= 1) {
                // Found
                var secure_id = result[0]['_id'];
                req.session.Logged = true;
                req.session.username = username;
                console.log(username + " Log in successfully!");
                res.status(200);
                res.render('index', { title: "Welcome, " + username });
            } else {
                res.status(500);
                res.render('error', {
                    message: "Failed to log in.",
                    error: {}
                });
            }
        })
    })
});

module.exports = router;

