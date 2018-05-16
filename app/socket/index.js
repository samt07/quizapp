'use strict';

const h = require('../helpers');

module.exports = (io, app) => {
	let allrooms = app.locals.chatrooms;


	io.of('/roomslist').on('connection', socket => {
		socket.on('getChatrooms', () => {
			socket.emit('chatRoomsList', JSON.stringify(allrooms));
		});

		socket.on('createNewRoom', newRoomInput => {
			//check to see if the room  with that namee already exists or not
			//If not then create a room and add it to the array and braodcast the same to all the users logged in
			if(!h.findRoomByName(allrooms, newRoomInput)) {
				//Create a new room and broadcast it to all users online
				allrooms.push({
					room: newRoomInput,
					roomID: h.randomHex(),
					users: []
				});

				//Emit an updated rooms list to the user who created this new room
				socket.emit('chatRoomsList', JSON.stringify(allrooms));
				//Emit this to all the other users as well
				socket.broadcast.emit('chatRoomsList', JSON.stringify(allrooms));

			}

		});
	});

	io.of('/chatter').on('connection', socket => {
		socket.on('join', data => {
			let usersList = h.addUserToRoom(allrooms, data, socket);
			//Update the list of active users as shown on the chatroom page
			socket.broadcast.to(data.roomID).emit('updateUsersList', JSON.stringify(usersList.users));//this line sends or dispatches an event to 
																									//all sockets connected to a particular
																									//room (data.roomroomID). So that 
																									//everyone else on that room would know that
																									//a new user has just joined.
			socket.emit('updateUsersList', JSON.stringify(usersList.users)); //The above stmt emits to all the other active users on the room
																			// But not to the user who actually initiated this event
																			//This stmt will do that.
			
		});
		//When a user (socket) exits a chatroom

		socket.on('disconnect', () => {
			//find the room, to which the socket is connected to and purge the user from the allrooms users' array and once
			//again emit the updateUsersList to refresh the active usersList section on the chatroom page.
			let room = h.removeUserFromRoom(allrooms, socket);

			socket.broadcast.to(room.roomID).emit('updateUsersList', JSON.stringify(room.users));

				//Note we are calling socket.emit again to update the active users back to the user who wishes to log out. Obviously
				//it is not required to do.				
		});
		//When a new chat message
		socket.on('newMessage', data => {
			socket.to(data.roomID).emit('inMessage', JSON.stringify(data));
		});
	});
}