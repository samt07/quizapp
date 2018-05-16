'use strict';

const passport = require('passport');
const config = require('../config');
const logger = require('../logger');
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const h = require('../helpers');

module.exports = () => {

	passport.serializeUser((user, done) => {
		done(null, user.id); //This is the objectid and not the profile.id from facebook
	});

	passport.deserializeUser((id, done) => {
		h.findById(id)
			.then(user => done(null, user))
			.catch(error => logger.log('error', 'Error when deserializing user: '+ error));
	});

	let authProcessor = (accessToken, refreshToken, profile, done) => {
		//Find a user in the chatcat app's local mongo db instance using profile.ID		
		//If the user is found, return the user data using the done()
		//If the user is not found, then create one using facebook profile.ID and save it in mongo db
		h.findOne(profile.id)
			.then(result => {
				if (result)  {
					done(null, result);
				} else {
					//Create a user and return
					h.createNewUser(profile)
						.then(newChatUser => done(null, newChatUser))
						.catch(error => logger.log('error', 'Error when creating new user: ' + error));
				}
			});
	}

	passport.use(new FacebookStrategy(config.fb, authProcessor));

	passport.use(new TwitterStrategy(config.twitter, authProcessor))
}
