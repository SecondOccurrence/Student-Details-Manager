"use strict";

const formidable = require("formidable");
const fs = require("node:fs");

const validation = require("../../shared/studentValidation.js");

/**
 * Reads an image from the server, found in the ./data/photos directory, and displays it via HTTP
 *
 * @param {Object} [o] request - The client HTTP request. This is not modified or read.
 *   left optional for consistency purposes
 * @param {Object} response - The constructed HTTP response, containing the image
 * 
 */
function reqUpload(request, response) {
	if(request.method != "POST") {
		return;
	}

	const form = new formidable.IncomingForm({ 
        // These options allow the photo to be optional
        allowEmptyFiles: true,
        minFileSize: 0,
    });
	form.parse(request, (error, field, file) => {
        if(error) {
            const error = "There was a problem processing your form. Please try again.";
		    response.writeHead(400, {"Content-Type": "application/json" });
            response.write(JSON.stringify(error));
            response.end();
            return;
        }

		const formData = {
			"number": field.studentnum ? field.studentnum[0] : null,
			"fname": field.fname ? field.fname[0] : null,
			"lname": field.lname ? field.lname[0] : null,
			"age": field.age ? field.age[0] : null,
			"gender": field.gender ? field.gender[0] : null,
			"degree": field.degree ? field.degree[0] : null,
			"photo": file.photo ? file.photo[0].originalFilename : null
		};

		// Independent of formData as its returned in response. Client does not need to know this path
		const photoPath = file.photo ? file.photo[0].filepath : null;
		
		// Validate the incoming form values
		const validReqData = validateData(formData);
		let imagePath = null;

		// Assuming no errors with file saving, validation errors will be sent in the response
		let requestErrors = validReqData.errors;

		let criticalError = false;
		if(validReqData.valid === true) {
			// Save data to the server (details in csv, photo uploaded if any)
			const saveResponse = saveData(formData, photoPath);
            criticalError = saveResponse.criticalError;
            
            if(saveResponse.errors !== null) {
				requestErrors = saveResponse.errors;
			}
			imagePath = saveResponse.imagePath;
		}

        const responseCode = criticalError ? 500 : 200;
        response.writeHead(responseCode, {"Content-Type": "application/json" });
        if(criticalError) {
            const body = "The server was unable to complete your request. Please try again later.";
            response.write(JSON.stringify(body));
        }
        else {
            response.write(JSON.stringify({
                savedData: formData,
                requestErrors: requestErrors,
                imagePath: imagePath
            }));
        }
		response.end();
	});
}

/**
 * Performs validation on a form's data. Specifically:
 *   Student Number, First & Last name validation,
 *   Age, gender validation,
 *   Degree and Photo validation
 *
 * @param {Object} incomingData - Object containing the forms information in the form of strings
 * 
 */
function validateData(incomingData) {
	const inputNames = ["number", "fname", "lname", "age", "gender", "degree", "photo"];
	const validationFunctions = [
		validation.validStudentNumber,
		validation.validName, validation.validName,
		validation.validAge,
		validation.validGender,
		validation.validDegree,
		validation.validPhoto
	];

	let completelyValid = true;
	const validationErrors = {};

	inputNames.forEach((name, i) => {
		const potentialError = validationFunctions[i](incomingData[name]);
		if(potentialError !== null) {
			completelyValid = false;
		}

		validationErrors[name] = potentialError;
	});
	
	return {"valid": completelyValid, "errors": validationErrors};
}

/**
 * Takes form data, as an object, and saves it to the students.csv file.
 *   If a photo has been provided in the form data object, the file will be saved at ./data/photos/{student number}
 *
 * @param {Object} formData - Object containing student information in the format of:
 *   Student number, first name, last name, age, gender, degree, photo. All as strings. All validated.
 * @param {string} photoPath - The temporary path of the file to be saved.
 * 
 */
function saveData(formData, photoPath) {
	let saveErrors = null;
	let imagePath = null;
	let criticalError = false;

	// If a photo is provided, save it first
    const photoExists = formData.photo !== null && formData.photo !== undefined && formData.photo !== "";
	if(photoExists) {
		const fileName = formData.number;
		const fileExtension = formData.photo.split(".").pop();
		const newPath = `./data/photos/${fileName}.${fileExtension}`;

		const res = savePhoto(photoPath, newPath);
		if(res !== null) {
            console.log(`ERROR: Could not save photo at path: ${newPath}`);
			// This is a critical error. This takes precedence over a valid request
			saveErrors = res;
			criticalError = true;
		}
		else {
			imagePath = `/show/${fileName}.${fileExtension}`;
			formData.photo = imagePath;
		}
	}

	if(!criticalError) {
		const success = saveDetails(formData);
        if(!success) {
            console.log("ERROR: Could not save details to students.csv");
            criticalError = true;
        }
	}

	return { "criticalError": criticalError, "errors": saveErrors, "imagePath": imagePath };
}

/**
 * Saves a file to a path on the server. The old path to the file (temp path) is removed after the save is successful
 *
 * @param {string} filePath - The path to the file to save on the server.
 *   In this case, this is the temporary file.
 * @param {string} newPath - The path on the server that the image is saved to
 * 
 */
function savePhoto(filePath, newPath) {
	let errorMsg = null;

	try {
		fs.copyFileSync(filePath, newPath);
	}
	catch(_error) {
		errorMsg = "There was an unexpected error when saving the photo.";
	}
		
	fs.rmSync(filePath);
	return errorMsg;
}

/**
 * Saves a student detail object to the students.csv file, each field is comma separated
 *
 * @param {Object} details - The student detail object. Formatted as:
 *   Student number, first name, last name, age, gender, degree, photo (optional)
 * @return true on a successful save, false on an error
 * 
 */
function saveDetails(details) {
	const csvFilePath = "./data/students.csv";

	let valid = true;
	let csvRecord = Object.values(details).toString();
	csvRecord += "\n";
	try {
		fs.appendFileSync(csvFilePath, csvRecord);
	}
	catch(err) {
		console.error(err);

		valid = false;
	}

	return valid;
}

module.exports = {
    reqUpload,
};
