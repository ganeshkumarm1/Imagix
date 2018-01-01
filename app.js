var express = require('express');
var fs = require('fs');
var logger = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')

var router = require('./routes/route');

const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/images';
mongoose.connect(MONGO_URL, () => {
	console.log('Connected to Mongodb');
});

var app = express();

if(app.get('env') == "production") {
	var accessLogStream = fs.createWriteStream(__dirname + '/logs/' + "logfile.log", {flags: 'a'});
    app.use(logger({stream: accessLogStream}));
}
else {
	app.use(logger('dev'));	
}

app.use('/', router);

app.use('/public', express.static(__dirname + '/public'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


const PORT = process.env.PORT || 1234;

app.listen(PORT, () => {
	console.log(`Server running at port ${PORT}...`);
});


app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

app.use(function(err, req, res, next) {
  	res.locals.message = err.message;
  	res.locals.error = req.app.get('env') === 'development' ? err : {};
  	res.status(err.status || 500);
  	if(err.status.toString() == '404')
  	{
		res.header('Content-Type', 'text/html');
		res.sendFile(path.join(__dirname, '/public/404.html'));
  	}
  	else
  	{
  		res.end(err.status.toString());
  	}
});
