'use strict';
const config = require('../config');
const Mongoose = require('mongoose').connect(config.dbURI);
const logger = require('../logger');

//Log an error if the connection fails

Mongoose.connection.on('error', error => {
	logger.log('error', 'MongoDB connection error: ' + error);
});

//Create a schema that defines a user structure

const quizAppUser = new Mongoose.Schema({
	profileId: String,
	fullName: String,
	profilePic: String
});

//Create a user model for this schema

let userModel = Mongoose.model('quizAppUser', quizAppUser);

//Create a schema and model for storing questions

const question = new Mongoose.Schema({
			questionNumber:Number,
			questionType:String,
			questionText:String,
			answerChoices:Number,
			answers:[{
				answer:String,
				correctAnswer:String
			}]
		});

let questionModel = Mongoose.model('question', question);

module.exports = {
	Mongoose,
	userModel,
	questionModel
}