'use strict';
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json({ strict:true});

var config = require('./config');
var functions = require('./functions')
var final_send = functions.final_send;

router.post('/work_text', jsonParser, function(req,res) {
    var content = req.body;
    console.log("New data fetching!");
    if (content.text) {
        console.log(content.text);
        if(!content.model) {
            console.log("model not found!" + content);
            res.json({errmsg : "model not found"});
            return;
        }
        var url = "";
        var model = content.model;
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
	console.log('model = ' + model, " url = " + url);
        final_send(content.text,url,  options, function(in_res) {
            	try{
			var ret = {
				text : content.text,
				ents : []
			}
			console.log(in_res.body);
			var abc = JSON.parse(in_res.body.toString());
			var n = abc.length;
			for(var i = 0;i < n;i++) {
				ret.ents.push({ start : abc[i][0], end : parseInt(abc[i][1]) + 1, label : abc[i][2]});
		}
                	res.json(ret);
			console.log(ret);
        	} catch(e) {
	                res.json({errmsg : "error inside our internal network, with " + e});
        	}
        })
    } else {
        console.log('"text" not found!\n');
        res.json({errmsg : "text not found"});
    }
});

module.exports = router;
