"use strict";

const fs = require("node:fs");

/**
 * Searches through the students.csv file given the client request containing a search query.
 * Returns in the HTTP response a JSON object containing the full records of any match found in the file.
 * 
 * @param {Object} request - Client HTTP request object. This will contain a string query to search for inthe student csv file
 * @param {Object} response - Server HTTP response
 *
 */
function reqQuery(request, response) {
	if(request.method !== "POST") {
		return;
	}

	let postData = "";

	request.setEncoding("utf-8");
	request.addListener("data", (dataChunk) => {
		// Accumulate POST data chunks
		postData += dataChunk;
	});
	request.addListener("end", () => {
        let recordMatches = [];

		if(postData !== "") {
			recordMatches = searchStudents(postData);	
		}

		const searchError = recordMatches === null;
		const responseCode = searchError ? 500 : 200;
		response.writeHead(responseCode, {"Content-Type": "application/json"});
		if(searchError) {
            const body = "The server was unable to complete your request. Please try again later.";
			response.write(JSON.stringify(body));
		}
		else {
			response.write(JSON.stringify(recordMatches));
		}
		response.end();
	});
}

/**
 * Searches students.csv file for any partial match given a search query
 * 
 * @param {string} query - Query string to search for
 * @return Returns an array of csv rows that match the query. Can be 0 or more.
 *   Will return null on an error in csv retrieval
 *
 */
function searchStudents(query) {
	const matches = [];

	const csvPath = "./data/students.csv";
	const csvObj = retrieveCSV(csvPath);

	if(!csvObj.valid) {
		return null;
	}

	const csvRows = csvObj.response.split("\n");

	for(const row of csvRows) {
		const record = row.split(",");

		// Ignore the file
		const values = record.slice(0, -1);

		for(const value of values) {
			if(partialMatch(value, query)) {
				matches.push(record);
				// This record is a match, dont compare any more fields in the record
				break;
			}
		}
	}

	return matches;
}

/**
 * Reads a file, given a path, and stores it in a string
 * 
 * @param {string} query - Query string to search for
 *
 */
function retrieveCSV(path) {
	let res;
	let valid = true;

	try {
		res = fs.readFileSync(path, "utf-8");
	}
	catch(error) {
		console.error(error);
		valid = false
	}

	return { "valid": valid, "response": res };
}

/**
 * Performs comparison on two strings and checks if there is a partial match between a field and a string to search through.
 *
 * @param {string} field - The field to search for
 * @param {string} searchString - The string to search
 *
 */
function partialMatch(field, searchString) {
	field = field.toLowerCase();
	searchString = searchString.toLowerCase();

	return field.includes(searchString);
}

module.exports = {
    reqQuery,
}
