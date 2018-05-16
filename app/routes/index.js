'use strict';
const h = require('../helpers'); //this means that we will be able to call all the code (functions, object, whatever) that is there
								// inside module.exports in helpers' index.js
const config = require('../config');



module.exports = () => {
	let routes = {
		'get':{
			'/': (req, res, next) => {
				/*Deva res.render('login'); Deva*/
				res.render('quizMain');
			}
		},
		'post':{
			'/showQuiz': (req, res, next) => {
				//Find a chat room with the given id
				//Render it only if the id is found
				let questions = JSON.parse(req.body.questions);
				if (questions === undefined) {
					logger.log('error', 'No question object!');
					return next();
				}else {
					h.saveQuestions(questions);
					res.render('showQuiz', {
						questions: JSON.stringify(questions)
					});					
				}
				
			}
		},
		'NA': (req, res, next) => {
			res.status(404).sendFile(process.cwd() + '/views/404.htm');
		}
	}

	return h.route(routes); //we are able to call route function inside h (helper) because its exposed to the outside world via module.exports
							//and it takes an argument as well

}	
