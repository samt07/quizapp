'use strict';
const router = require('express').Router();
const db = require('../db');
const crypto = require('crypto');
const request = require('request');
const config = require('../config');

//Iterate through the routes object and mount the route
let _registerRoutes = (routes, method) => {
	for (let key in routes){
		if(typeof routes[key] === 'object' && routes[key] !== null	&& !(routes[key] instanceof Array)){
			_registerRoutes(routes[key], key);
		} else {
			//Register the routes
			if(method === 'get'){
				router.get(key, routes[key]);
			} else if (method === 'post'){
				router.post(key, routes[key]);
			} else {
				router.use(routes[key]);
			}
		}
	}
}

let route = routes => {
	_registerRoutes(routes);
	return router;
}

//Find a user based on a key
let findOne = profileID => {
	return db.userModel.findOne({
		'profileId': profileID
	})
}

let createNewUser = profile => {
	return new Promise ((resolve, reject) => {
		let newChatUser = new db.userModel({
			profileId: profile.id,
			fullName: profile.displayName,
			profilePic: profile.photos[0].value || ''
		});

		newChatUser.save(error => {
			if (error){
				reject(error);
			} else {
				resolve(newChatUser);
			}
		});
	});
}

//The ES6 promisified version of findById

let findById = id => {
	return new Promise ((resolve, reject) => {
		db.userModel.findById(id, (error, user) => {
			if (error){
				reject(error);
			}else {
				resolve(user);
			}
		})
	});
}

//Check if the user is authenticated to other routes apart from '/' by checking if he has already logged in or not

let isAuthenticated = (req, res, next) => {
	if (req.isAuthenticated()){
		next();
	} else {
		res.redirect('/');
	}
}

//reCaptcha Verification

let reCaptchaVerify = (g_recaptcha_response, remoteIPAddress) => {

	let reCaptchaStatus = '';
	if(g_recaptcha_response === undefined || g_recaptcha_response === ''|| g_recaptcha_response === null) {
   		 reCaptchaStatus = 1;
   		 return reCaptchaStatus;
   	}	
	var secretKey = config.reCaptcha.secretKey;
	// remoteIPAddress will provide IP address of connected user.
	var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" 
	+ g_recaptcha_response + "&remoteip=" + remoteIPAddress;

	// Hitting GET request to the URL, Google will respond with success or error scenario.
	request (verificationUrl, function(error, response, body) {
		body = JSON.parse(body);
		// Success will be true or false depending upon captcha validation.
	 	if(body.success !== undefined && !body.success) {
			reCaptchaStatus = 2
			return reCaptchaStatus;
		}
		reCaptchaStatus = 0;
		return reCaptchaStatus;
	});
}

//The ES6 promisified version of findById

//#quizapp - save questions when user clicks on submit

let saveQuestions = (questions) => {

	for (var i = 0; i < questions.length; i++){
		
			new db.questionModel({
				questionNumber:questions[i].questionNumber,
				questionType:questions[i].questionType,
				questionText:questions[i].questionText,
				answers:questions[i].answers
			}).save();	
		}

}



let saveTravelDetails = (travelDetails) => {

	var saveStatus = {};
	return new Promise ((resolve, reject) => {

		new db.travelDetailsModel({
		departureCode:travelDetails.departureCode,
		arrivalCode:travelDetails.arrivalCode,
		departureTime: travelDetails.departureTime,
		departureDate: travelDetails.departureDate,
		passengerName:travelDetails.passengerName,
		passengerAge:travelDetails.age,
		passengerGender: travelDetails.gender,
		passengerEmail: travelDetails.email,
		passengerPhone: travelDetails.phone,
		hidePhoneNumber:travelDetails.hidePhoneNumber			
		}).save((error, document) => {
		
			if (error){
		    saveStatus = {
				status: "error",
				savedDocument: ""
			};
			reject(saveStatus);
			} else {
				saveStatus = {
					status: "success",
					savedDocument: document
				};
				resolve(saveStatus);
			}
		});
	});
}

//find if a room already exists

let findRoomByName = (allrooms, room) => {
	let findRoom = allrooms.findIndex((element, index, array) => { //This findIndex is ES6 function which can be used for traversing an array.
		if (element.room === room){
			return true;
		} else {
			return false;
		}
	});

	return findRoom > -1 ? true : false; // As the name says, findIndex return the index value or the position of the found element
										 // from the array. If there is no match, the else block runs and returns false which is 
										 //resolved to -1. If there is a match, the if block runs and returns true and also the indec
										 //number of that element from the array.
}
//A function that generates a unique roomID

let randomHex = () => {
	return crypto.randomBytes(24).toString('hex');
}

let findRoomByID = (allrooms, roomID) => {
	return allrooms.find((element, index, array) => {
		if (element.roomID === roomID) {		     
			return true;							
		} else {
			return false;
		}
	});
}

//Add a user to the chat room


module.exports = {
	route, 
	findOne,
	createNewUser,
	findById,
	isAuthenticated,
	findRoomByName,
	randomHex,
	findRoomByID,
	saveTravelDetails,
	reCaptchaVerify,
	saveQuestions
}