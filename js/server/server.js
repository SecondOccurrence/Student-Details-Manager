"use strict";

const http = require("node:http");
const url = require("node:url");

/**
 * Function which launches a HTTP server on port 40203
 * 
 * @param {Function} route - Router function
 * @param {Object} handle - Object containing keys of handles and values of handler function
 *
 */
function startServer(route, handle) {
	const portNum = 8080;

	http.createServer((request, response) => {
		const pathname = url.parse(request.url).pathname;
		console.log(`Request for ${pathname} received.`);

		route(pathname, handle, request, response);
	}).listen(portNum);

	console.log(`Server running.. Process ID: ${process.pid}`);
}

module.exports = {
    startServer,
};
