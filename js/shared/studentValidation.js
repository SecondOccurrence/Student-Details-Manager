"use strict";

/**
 * Validates a provided student number. A valid student number is one that:
 * 1. Only Digits 0-9
 * 2. 8 digits long
 *
 * @param {number} number - The number to validate
 * @returns {string} - error message on error. null on success
 * 
 */
function validStudentNumber(number) {
	let errorMsg = null;

	const numberExists = number !== "" && number !== undefined && number !== null;
	if(!numberExists) {
		errorMsg = "This field is required.";
	}
	else if(number.match(/^[0-9]+$/) === null) {
		errorMsg = "Number must be all digits.";
	}
	else if(number.length !== 8) {
		errorMsg = "Number must be 8 digits long.";
	}

	return errorMsg;
}

/**
 * Validates a provided name. A valid name is one that:
 * 1. Contains characters A-Z, a-z, apostraphes, singular spaces
 * 2. Can also contain dashes, but no consective, none at the start or end.
 *
 * @param {string} str - The name to validate
 * @returns {string} - error message on error. null on success
 *
 */
function validName(str) {
	const maxLength = 32;

	let errorMsg = null;

	const nameRegex = /^(?![- ])(?!.*--)[A-Za-z-' ]+(?<!- )$/;

	const strExists = str !== "" && str !== undefined && str !== null;
	if(!strExists) {
		errorMsg = "This field is required.";
	}
	else if(str.match(nameRegex) === null) {
		errorMsg = "Name must only contains characters from a-z, A-Z. (Can include a '-' enclosed in those characters).";
	}
	else if(str.length > maxLength) {
		errorMsg = "Name can only contain a maximum of 32 letter.";
	}

	return errorMsg;
}

/**
 * Validates a provided age. A valid age is one that:
 * 1. Contains only digits
 * 2. Is within range 11-125. As we are adding details for humans studying at university
 *
 * @param {string} str - The age to validate
 * @returns {string} - error message on error. null on success
 *
 */
function validAge(str) {
	let errorMsg = null;

	const strExists = str !== "" && str !== undefined && str !== null;
	if(!strExists) {
		errorMsg = "This field is required.";
	}
	else if(str.match(/^[0-9]+$/) === null) {
		errorMsg = "Age must only contain digits."
	}
	else if(Number(str) > 125) {
		errorMsg = "This age is too old for a human."
	}
	else if(Number(str) < 10) {
		errorMsg = "This age might be too young for a University Student..";
	}

	return errorMsg;
}

/**
 * Validates a provided gender. A valid gender is one that:
 * 1. Contains characters A-Z, a-z
 * 2. Can contain dashes. No consecutive dashes. None at the start or end
 *
 * @param {string} str - The gender to validate
 * @returns {string} - error message on error. null on success
 *
 */
function validGender(gender) {
	let errorMsg = null;

	// Regex:
	//	(?!-) - No dash at the start
	//	(?!.*--) - Consecutive dashes cant be found
	//	(?<!-) - No dash at the end
	const dashRegex = /^(?!-)(?!.*--)[A-Za-z-]+(?<!-)$/;
	const letterRegex = /^[A-Za-z-]+$/;

	const genderExists = gender !== "" && gender !== undefined && gender !== null;
	if(!genderExists) {
		errorMsg = "Please fill out this field.";
	}
	else if(gender.match(dashRegex) === null) {
		// Display a different error message if the input includes numbers or special characters
		if(gender.match(letterRegex) === null) {
			errorMsg = "This field must only contains characters from a-z, A-Z. (Can include a '-' enclosed in those characters).";
		}
		else {
			errorMsg = "Sorry, dashes (-) can't be at the start or end, and can't be found together.";
		}
	}

	return errorMsg;
}

/**
 * Validates a provided degree. A valid degree is one that:
 * 1. Contains character A-Z, a-z, single whitespaces
 *
 * @param {string} degree - The degree to validate
 * @returns {string} - error message on error. null on success
 *
 */
function validDegree(degree) {
	let errorMsg = null;

	const degreeExists = degree !== "" && degree != undefined && degree !== null;
	if(!degreeExists) {
		errorMsg = "This field is required.";	
	}
	else if(degree.match(/^[a-zA-z\ ]+$/) === null) {
		errorMsg = "Degree cannot contain special characters or numbers.";
	}

	return errorMsg;
}

/**
 * Validates a provided photo path. A valid photo path is one that:
 * 2. contains the 'png', 'jpg', 'jpeg' extension types at the end of the string.
 *
 * @param {string} photoPath - The photo path to validate
 * @returns {string} - error message on error. null on success
 *
 */
function validPhoto(photoPath) {
	let errorMsg = "Photo can only be in format '.png', '.jpg', '.jpeg'.";

	// Photo isn't provided. As it is optional, skip validation
	if(photoPath === "" || photoPath === undefined || photoPath === null) {
		errorMsg = null;
		return errorMsg;
	}

	const validExtensions = ["png", "jpg", "jpeg"];

	const fileExtension = photoPath.split(".").pop();
	for(const validExtension of validExtensions) {
		if(fileExtension === validExtension) {
			errorMsg = null;
			break;
		}
	}

	return errorMsg;
}

// This file is used by both client and the server, we only want to export functions if on the server, as 'module' does not exist on the client.
if(typeof module !== "undefined") {
    module.exports = {
        validStudentNumber,
        validName,
        validAge,
        validGender,
        validDegree,
        validPhoto,
    };
}
