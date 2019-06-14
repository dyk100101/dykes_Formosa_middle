'use strict';
var express = require('express');
var multer = require('multer');


var router = express.Router();

var storage = multer.diskStorage( {
    destination: function(req, file, cb) {
        cb(null, './uploads');
    },
    filename  :function (req,file,cb) {
        var fileFormat = (file.originalname).split('.');
        cb(null, file.fieldname + '-' + Date.now() + '.' + fileFormat[fileFormat.length - 1]);
    }
});

var fileFilter = function(req,file,cb) {
    cb(null, true);
}

var upload = multer( {
    storage : storage,
    fileFilter : fileFilter,
    limits : {
	fileSize : 400
    }
});

var up = upload.single('file');

router.post('/work_file',up, function(req,res,next) {
	console.log("Head of upload");
	next();
})

module.exports = router;
