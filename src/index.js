const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');
const { generateMessage, generateLocationMessage } = require("./utils/messages");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const publicDirectory = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

app.use(express.static(publicDirectory));

io.on("connection", (socket) => {
	console.log("New Websocket connection");

	socket.emit("message", generateMessage("Welcome"));

	socket.broadcast.emit("message", generateMessage("A new user has joined"));

	socket.on("sendMessage", (newMessage, callback) => {
		const filter = new Filter();

		if (filter.isProfane(newMessage)) {
			return callback('Profanity is not allowed!');
		}

		io.emit("message", generateMessage(newMessage));
		callback();
	});

	socket.on("sendLocation", (coords, callback) => {
		io.emit("locationMessage", generateLocationMessage(`https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`));
		callback();
	});

	// 

	socket.on("disconnect", () => {
		io.emit("message", generateMessage("A user has left!"));
	});
});

server.listen(port, () => {
	console.log('Server is up on port ' + port)
});