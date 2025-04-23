"use strict";

const fs = require("node:fs");

/**
 * Retrieves the home page for the user
 *
 * @param {Object} [o] request - The client HTTP request. This is not modified or read.
 *   left optional for consistency purposes
 * @param {Object} response - The constructed HTTP response, containing the home page in HTML
 * 
 */
function reqStart(_request, response) {
	const homePagePath = "./html/index.html";

	fs.readFile(homePagePath, "utf-8", (err, data) => {
		let responseCode, responseType, responseBody;

		if(!err) {
			responseCode = 200;
			responseType = "text/html"
			responseBody = data;
		}
		else {
			console.error(err);
			responseCode = 404;
			responseType = "text/plain";
			responseBody = "Resource Not Found.";
		}

		response.writeHead(responseCode, {"Content-Type": responseType});
		response.write(responseBody);
		response.end();
	});
}

module.exports = {
    reqStart,
};
