"use strict";

const fs = require("node:fs");
/**
 * Retrieves the student details form HTML page
 * 
 * @param {Object} [o] request - Client HTTP request object
 * @param {Object} response - Server HTTP response
 *
 */
function reqStudent(_request, response) {
	const filePath = "./html/student.html";

	fs.readFile(filePath, "utf-8", (err, data) => {
		let responseCode, responseType, responseBody;

		if(!err) {
			responseCode = 200;
			responseType = "text/html";
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
};

module.exports = {
    reqStudent,
};
