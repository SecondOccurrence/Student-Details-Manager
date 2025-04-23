"use strict";

const fs = require("node:fs");

/*
 * Constructs a HTTP response, used for a custom error HTTP response.
 * This uses the ./html/server_response/start.html, ./html/server_response/end.html templates
 * Between the two is the custom Body for the response.
 *
 * This is used for critical errors, like 404, and server processing issues.
 *
 * @param {Object} responseObj - The HTTP response object
 * @param {number} responseCode - The HTTP response code associated with this response
 * @param {string} customBody - The custom body that will be placed between start.html and end.html.
 *
 */
function constructResourceError(responseObj, responseCode, customBody) {
    let body = fs.readFileSync("./html/server_response/start.html", "utf-8");
    body += customBody;
    body += fs.readFileSync("./html/server_response/end.html", "utf-8");

    responseObj.writeHead(responseCode, {"Content-Type": "text/html"});
    responseObj.write(body);
    responseObj.end();
}

module.exports = {
    constructResourceError,
};
