'use strict';

const express = require('express');
const app = express();
const quizApp = require('./app');
const bodyParser = require('body-parser');

//var fs = require('fs');


/*Extract airport codes from json*/

/*
var airportJson = require('./public/data/airportsFull.json');

var airportCodeName = [];

if (!airportJson ==''){


  for (var i=0 ; i < airportJson.length; i++) {
    airportCodeName.push(('"'+airportJson[i].iata + ' ' + airportJson[i].name+'"'));
  }

  airportJson = JSON.stringify(airportJson);
  fs.writeFile('./public/data/airportsCopy.json', airportCodeName);

  }
*/


//Deva


app.set('port', process.env.PORT || 3000);
app.use(express.static('public'));
app.use(express.static('node_modules/babel-standalone'));
app.set('views', './views'); //this is set by ejs engine by default.
//If we have a folder named 'views', we need not have to specify this.
//But if we want to keep our view files some other location, then use this
//to specify that path. Ejs take care of it otherwise.
app.set('view engine', 'ejs'); //express built in property to specify html templating
//engine

app.use(quizApp.session);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended:true
}));


/*Deva
app.use(passport.initialize()); //this is required to plug in passport middleware req, res stream with express app
app.use(passport.session()); //this is to plug in passport with the session middleware and read/write session variables.
Deva*/

app.use(require('morgan')('combined', {
	stream: {
		write: message => {
			//Write to logs
			quizApp.logger.log('info', message);

		}
	}
}))

app.use('/', quizApp.router);

quizApp.ioServer(app).listen(app.get('port'), () => {
	console.log('QuizApp Running on port :', app.get('port'));
})

//The above stmt was like below before we brought in ioServer.
//app.listen(app.get('port'), () => {

//This is because, as we know, app is tied to express which has its own server implementation. That was why we were able to use app.listen directly.
//Now to bring in socket, we need to first create an 'http'	 module server instance for the express 'app' and then bind that to a
//socket.io server instance. Then use that socket.io server instance to listen to the app.get('port').
//chatCat.ioServer refers to the index.js file under app. We could see the above process happening there for ioServer. Also, for more clear
//explanation, look at the lecture 59 last 5 minutes.
