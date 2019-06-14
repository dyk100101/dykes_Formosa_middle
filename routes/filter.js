'use strict';
var express = require('express');
var router = express.Router();

router.all('*',function (req, res, next) {
    let url = req.path.toLowerCase();
    console.log("An access at " + req.originalUrl);
    if (url === "/login") {
        if(req.session && req.session.Logged == true) {
	        console.log("Logged user " + req.session.username + " accessed :" + url);
            res.status(200);
            res.render('error', {title:"Welcome " + req.session.username + "."});
        }
        else{
            console.log("Someone is trying to log in.");
            next();
        }
    } else if(req.session && req.session.Logged) {
        next();
    } else {
        res.status(500);
        res.render('error', {
            message: "Please Log in first.",
            error: {}
        });
    }
})


module.exports = router;
