'use strict';
var express = require('express');
var router = express.Router();
var formidable = require('formidable');


var fs = require('fs');

var config = require('./config');
var functions = require('./functions')
var final_send = functions.final_send;

router.post('/work_file' , function(req,res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err,fields, files) {
        if (err) {
            res.json({errmsg : "Error in form parsing!"});
            return;
        }
        var path = "";
        if (files['file'])
            path = files['file'].path;
        if(path ==="") {
            res.json({errmsg : "Error in form parsing!"});
            return;
        }
        var model = fields['model'];
        if(!model) {
            console.log("model not found!" + fields);
            res.json({errmsg : "model not found"});
            return;
        }
        var url = "";
        if(model === 'English-General'){
            url = config.urls.EGurl;
        } else if (model === 'Chinese-General') {
            url = config.urls.CGurl;
        } else if (model === 'Chinese-Economics') {
            url = config.urls.CEurl;
        } else {
            console.log("Unknown model : " + model);
            res.json({errmsg : "unknown model"});
            return;
        }
        var options = config.options;

        fs.readFile(path, 'utf-8', function(err,data) {
            if(err) {
                res.json({errmsg : "error when reading!"})
            }
            console.log('model = ' + model, " url = " + url);
            final_send(data,url,  options, function(in_res) {
                try{
                    var ret = {
                        text : data,
                        ents : []
                    }
                    var abc = JSON.parse(in_res.body.toString());
                    var n = abc.length;
                    for(var i = 0;i < n;i++) {
                        ret.ents.push({ start : abc[i][0], end : parseInt(abc[i][1]) + 1, label : abc[i][2]});
                    }
                    res.json(ret);
                    console.log(ret);
                }
                catch(e) {
                        res.json({errmsg : "error inside our internal network with " + e});
                }
            })
        });
    })
});

module.exports = router;


