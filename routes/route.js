var express = require('express');
var mongoose = require('mongoose');
var fs = require('fs');
var Image = require('../models/imageSchema');
var router = express.Router();
var path = require('path');
var multipart = require('connect-multiparty')();		

router.get('/', function(req, res) {
	res.header('Content-Type', 'text/html');
	res.sendFile(path.join(__dirname, '../public/index.html'));
});

router.route('/about').get(function(req, res) {
	res.header('Content-Type', 'text/html');
	res.sendFile(path.join(__dirname, '../public/about.html'));
});

router.get('/image/:id', function(req, res) {
	var id = req.params.id;
	var image = Image;
	image.findOne({_id: id}, function(err, result) {
		if(err)
		{
			res.header('Content-Type', 'text/html');
			res.status(404).sendFile(path.join(__dirname, '../public/404.html'));	
		}
		else
		{
			res.header('Content-Type', result.img.contentType);
			res.status(200).send(new Buffer(result.img.data, 'base64'));
		}
	});
});

router.post('/upload', multipart, function(req, res) {
	var image = new Image;
	image.img.data = fs.readFileSync(req.files.image.path);
	image.img.contentType = req.files.image.headers['content-type'];
	image.save(function(err, data) {
		if(err)
		{
			res.header('Content-Type', 'text/plain');
			res.status(500).end('Internal Server Error');	
		}
		res.header('Content-Type', 'application/json');
		res.status(200).json({id: data._id});
	});
});

module.exports = router;