"use strict";

const fs = require("node:fs");

const utils = require("../utils.js");

/**
 * Reads an image from the server, found in the ./data/photos directory, and displays it via HTTP
 *
 * @param {Object} [o] request - The client HTTP request. This is not modified or read.
 *   left optional for consistency purposes
 * @param {Object} response - The constructed HTTP response, containing the image
 * @param {string} pathname - Contains the path on the server to the image to show
 * 
 */
function reqShow(_request, response, pathname) {
	const fileName = decodeURIComponent(pathname).slice(6);
	const filePath = `./data/photos/${fileName}`;

	const readStream = fs.createReadStream(filePath);
	readStream.on("open", () => {
		response.writeHead(200, {"Content-Type": "image/png"});
		readStream.pipe(response);
	});
	readStream.on("error", () => {
		const responseBody = `
            <h1>Server Response Error Code <span>404</span></h1>
            <p>The requested photo <span>${fileName}</span> was not found on this server.</p>
        `;
		utils.constructResourceError(response, 404, responseBody);
	});
}

module.exports = {
    reqShow,
};
