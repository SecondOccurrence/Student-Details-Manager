"use strict";

const fs = require("node:fs");

const utils = require("./utils.js");

/**
 * Executes the appropriate request handler for a client request
 * 
 * @param {string} pathname - The full path of the client's request
 * @param {Object} handle - Object containing keys of handles and values of handler function
 * @param {Object} request - Client HTTP request object
 * @param {Object} response - Server HTTP response
 *
 */
function route(pathname, handle, request, response) {
	if(typeof handle[pathname] === "function") {
		handle[pathname](request, response);
	}
	else {
		const assetHandles = Object.keys(handle).slice(5);

		for(const prefix of assetHandles) {
			if(pathname.startsWith(prefix) && typeof handle[prefix] === "function") {
				handle[prefix](request, response, pathname);
				return;
			}
		}

        console.log(`No handler found for: ${pathname}`);

        const responseBody = `
            <h1>Server Response Error Code <span>404</span></h1>
            <p>The requested URL <span>${pathname}</span> was not found on this server.</p>
        `;
        utils.constructResourceError(response, 404, responseBody);
	}
}

module.exports = {
    route,
};
