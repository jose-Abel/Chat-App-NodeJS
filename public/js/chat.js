const socket = io();

socket.on("message", message => {
	console.log(message);
});

document.getElementById('message-form').addEventListener("submit", (e)=> {
	e.preventDefault();

	const message = document.querySelector('input').value;

	socket.emit("sendMessage", message);
});