'use strict';

const config = require('./config');

/*Deva
const redis = require('redis').createClient;
const adapter = require('socket.io-redis');

//social authentication logic
require('./auth')();
Deva*/

//Create an IO server instance
let ioServer = app => {
/*Deva
	app.locals.chatrooms = [];
Deva*/
	const server = require('http').Server(app);

/*Deva
	const io = require('socket.io')(server);
	io.set('transports', ['websocket']);
Deva*/

/*Deva
	let pubClient = redis(config.redis.port,config.redis.host, {//This is for sending or publishing data through Redis
		auth_pass: config.redis.password
	});

	let subClient = redis(config.redis.port, config.redis.host, {//this is for subscribing or getting data through Redis
		return_buffers: true,
		auth_pass: config.redis.password
	});

	//Include this adapter to the socket
	io.adapter(adapter({
		pubClient,
		subClient
	}));

Deva*/

/*Deva
	io.use((socket, next) => {
		require('./session')(socket.request, {}, next);
	})
	require('./socket')(io, app);
Deva*/

	return server;
}

module.exports = {
	router: require('./routes')(), //The flow will be like this. 
								  // This stmt will invoke module.exports code under routes' index.js. In routes' index.js
								  // module.exports has been defined as a fucntion which doesnt take any arguments. Thats why
								  //we are just calling here ('./routes')() like this.
								  //Inside that function, we are calling h.route where h is the helper module index.js reference
								  //and route is the function exposed there to the outside world under module.exports.
	session: require('./session'),
	ioServer,
	logger: require('./logger')
}