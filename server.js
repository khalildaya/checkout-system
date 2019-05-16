"use strict";

require("dotenv").load();
const http = require("http");
const localPort = 3000;
const port = process.env.PORT || localPort;

createServer();

function createServer() {
	const app = require("./app");
	const server = http.createServer(app);
	server.listen(port, () => {
		console.log(`Server listening on port ${port} process id ${process.pid}`);
	});
}