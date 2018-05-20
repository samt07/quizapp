'use strict';

if (process.env.NODE_ENV === 'production'){
	//Offer prod stage environment settings
	//to set REDIURL

	/*Deva
	let redisURI = require('url').parse(process.env.REDIS_URL);
	let redisPassword = redisURI.auth.split(':')[1];
	Deva*/

	module.exports = {
		host: process.env.host || "",
		dbURI: process.env.dbURI,
		sessionSecret: process.env.sessionSecret,
		fb: {
			clientID: process.env.fbClientID,
			clientSecret: process.env.fbClientSecret,
			callbackURL: process.env.host + "/auth/facebook/callback",
			profileFields: ['id', 'displayName', 'photos'],
			enableProof: true
		},
		twitter: {
			consumerKey: process.env.twConsumerKey,
			consumerSecret: process.env.twConsumerSecret,
			callbackURL: process.env.host + "/auth/twitter/callback",
			profileFields: ['id', 'displayName', 'photos']
		}
		/*Deva,
		redis: {
			host: redisURI.host,
			port: redisURI.port,
			password: redisPassword
		},
		reCaptcha: {
			secretKey: secretKey
		}
		Deva*/
	}
} else {
	//Offer dev stage env settings
	module.exports = require('./development.json');
}
