const socket = io();

socket.on("message", message => {
	console.log(message);
});

document.getElementById('message-form').addEventListener("submit", (e)=> {
	e.preventDefault();

	const message = e.target.elements.message.value;

	socket.emit("sendMessage", message, (error) => {
		if (error) {
			return console.log(error)
		}
		console.log("Message delivered");
	});
});

document.getElementById("send-location").addEventListener("click", () => {
	if(!navigator.geolocation) {
		return alert("Geolocation is not supported by your browser.");
	}
	
	navigator.geolocation.getCurrentPosition((position) => {

		const message = {
			latitude: position.coords.latitude,
			longitude: position.coords.longitude
		};
		socket.emit("sendLocation", message, () => {
			console.log("Location shared")
		});
	});
})
