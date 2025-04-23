"use strict";

const fs = require("node:fs");

/**
 * Executes the appropriate request handler for a client request
 * 
 * @param {Object} [o] request - Optional client HTTP request. This is not modified, kept as parameter for consistency
 * @param {Object} response - Server HTTP response object. Response is constructed in this function
 * @param {string} pathname - path that points to the file to access
 *
 */
function reqAsset(_request, response, pathname) {
	pathname = `.${pathname}`;

	const pathExtension = getExtension(pathname);

	// If asset is an image, we cannot use utf-8 encoding
	const encoding = (pathExtension === "svg") ? null : "utf-8";

	fs.readFile(pathname, encoding, (err, data) => {
		let responseCode, responseType, responseBody;

		if(!err) {
			responseCode = 200;
			responseType = getResponseType(pathExtension);
			responseBody = data;
		}
		else {
			responseCode = 404;
			responseType = "text/plain";
			responseBody = "Resource Not Found.";
		}

		response.writeHead(responseCode, {"Content-Type": responseType});
		response.write(responseBody);
		response.end();
	});
}

/**
 * Extracts the extension type of a given file
 * 
 * @param {string} str - The string to extract from
 *
 */
function getExtension(str) {
	const lastDotIndex = str.lastIndexOf(".");
	if(lastDotIndex === -1) {
		return "";
	}

	const extension = str.substring(lastDotIndex + 1);
	return extension;
}
/**
 * Determines the HTTP response type to be assigned in the server response
 * 
 * @param {string} ext - The extension type of the request path
 *
 */
function getResponseType(ext) {
	let type;

	switch(ext) {
	case "html":
		type = "text/html";
		break;
	case "js":
		type = "application/javascript";
		break;
	case "css":
		type = "text/css";
		break;
	case "svg":
		type = "image/svg+xml";
		break;
	default:
		type = "text/plain";
		break;
	}

	return type;
}

module.exports = {
    reqAsset,
};
