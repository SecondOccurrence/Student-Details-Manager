// Uses functions from ./js/shared/studentValidation.js

$(document).ready(function() {
	// Hide the response container, as there should not be a server response yet
	$("#image-link").hide();
	$("#submission-response").hide();

	$(`form input[type="submit"]`).click(function (event) {
		event.preventDefault();

		// Check if a gender has been selected. Cannot proceed if not
		if(!$(`input[name="gender"]`).is(":checked")) {
			$(`label[for="gender-other"].error-text`).removeAttr("hidden").text("This field is required.");
			return;
		}
		else {
			$(`label[for="gender"].error-text`).attr("hidden", "true").text("");
		}

		// Retrieve the form's input values
		const values = new FormData($("form")[0]);
        //values.set("photo", values.get("photo").name);

		// Validate input fields before sending request
		const validForm = validate(values.entries());
		if(!validForm) {
			return;
		}

		const url = $("form").attr("action");
		$.ajax({
			type: "POST",
			url: url,
			data: values,
			processData: false,
			contentType: false,
			success: function(response) {
				writeResponse(response);
				$("form").hide();
				$("#submission-response").show();
			},
            error: function(xhr, _status, error) {
                writeError(xhr, error);
                $("form").hide();
                $("#submission-response").show();
            }
		});
	});
});

/**
 * Container function for the form client-side validation.
 * This validates each field in the function, on an error, the error message is displayed on the page through jQuery
 *
 * @param {Object} values - All the values in the form. This should always be 7 values as follows:
 *   Student number, first name, last name, age, gender, degree, photo
 *
 */
function validate(values) {
	let validForm = true;

	// Should never experience this as there are only 8 inputs in this form.
    const formArray = Array.from(values);
	formArray[6][1] = formArray[6][1].name;

	if(formArray.length !== 7) {
		alert("Critical error in form validation.");
		return false;
	}

	// Array of validation functions to be used when iterating through studentValues
	const validationFunctions = [
		validStudentNumber, validName, validName, 
		validAge, validGender, 
		validDegree, validPhoto
	];

	// Loop through the object for each key
    formArray.forEach(([key, value], i) => {
        const validationError = validationFunctions[i](value);
        // If the input is invalid, display the error in the form
        if(validationError !== null) {
            validForm = false;

            const errorMsgContainer = `label[for="${key}"].error-text`;
            const inputContainer = `input[name="${key}"]`;

            $(errorMsgContainer).removeAttr("hidden").text(validationError);
            $(inputContainer).addClass("has-error");
        }
    });

	return validForm;
}

/**
 * Constructs the HTML, given the received data in the HTTP response from student detail creation
 * The page will display the values added to the server on success,
 * If errors have occurred, they will be displayed instead.
 *
 * @param {Object} data - Contains all the values stored by the server, along with error messages. This is 2 objects contained in an object.
 *   This includes: Student number, first name, last name, age, gender, degree, photo - for the stored values
 *   The error message object will contain null values if no errors.
 *   If this object is all null values, then validation is successful
 *
 */
function writeResponse(data) {
	const statusId = "#submit-status span";
	const responseBodyId = "#submit-body";

    // Any HTML constructed in a previous response is removed
	clearOldResponse(statusId, responseBodyId);

	const errors = data.requestErrors;
	const savedData = data.savedData;
	const imagePath = data.imagePath;

	const reqSuccess = checkForErrors(errors);

	const statusText = reqSuccess ? "SUCCESS" : "FAILURE";
	$(statusId).text(statusText);
	$(statusId).addClass(statusText.toLowerCase());

    // Add a new div element for each data value. This should be seven values any time.
	const headings = ["Student Number", "First Name", "Last Name", "Age", "Gender", "Degree", "Photo"];
	Object.keys(savedData).forEach((key, i) => {
        // Returns the error message if an error, or the field value stored if all is good.
		const fieldText = retrieveFieldValue(reqSuccess, key, savedData, errors);
		$(responseBodyId).append(`
			<div id="${key}-response">
			  <h3>${headings[i]}:</h3>
			  <p>${fieldText}</p>
			</div>
		`);
	});

	// An image was sent as request and saved on server
	if(imagePath !== null) {
		const linkId = "#image-link";		

		$(linkId).show();
		$(linkId).attr("href", imagePath);
		$(linkId).attr("target", "_blank");
	}
}

/**
 * Clears an old server response shown to the client.
 *
 * @param {string} statusId - Selector ID for the status header in the response HTML section
 * @param {string} responseBodyId - Selector ID for the status response in the response HTML section
 *
 */
function clearOldResponse(statusId, responseBodyId) {
	$(statusId).text("");
	$(statusId).removeClass();

	$(responseBodyId).html("");
}

/**
 * Checks an object of error values. If any value in the object is not null, this means the server-side validation failed.
 *
 * @param {Object} errors - Object of errors. Keys are named after each field.
 *   The corresponding values show the error message. String if an error on this field has occured, otherwise null.
 *
 */
function checkForErrors(errors) {
	let valid = true;

	for(const key in errors) {
		if(errors[key] !== null) {
			valid = false;
			break;
		}
	}

	return valid
}

/**
 * Takes saved data and error object. Returns one of those values for the respecive key,
 * which depends on if the server has indicated the validaiton has succeeded or failed
 *
 * @param {boolean} reqSuccess - This is used to check if server side validation has succeeded or not.
 *   To be determined before this function call
 *
 * @param {boolean} reqSuccess - This is used to check if server side validation has succeeded or not.
 *   To be determined before this function call
 * @param {string} key - The key to search for both savedData and errors.
 *   Both those objects have the same key values
 * @param {Object} savedData - key-value for each field sent to the server, and send back to the client.
 *   Student number, first name, last name, age, gender, degree, photo
 * @param {Object} errors - key-value for each field's error message. A string if an error has occurred on that field, else null
 *   Student number, first name, last name, age, gender, degree, photo
 * 
 */
function retrieveFieldValue(reqSuccess, key, savedData, errors) {
	let value;

	if(reqSuccess) {
		// Special case: on no photo, value should be not provided
        const photoExists = savedData[key] !== null && savedData[key] !== undefined && savedData[key] !== "";
		if(key === "photo" && !photoExists) {
			value = "Not Provided.";
		}
		else {
			value = savedData[key];
		}
	}
	else {
		// Special case: on no photo, value should be not provided
		if(key === "photo") {
			value = "Not Provided.";
		}
		else {
			value = errors[key];
		}
	}

	return value;
}

/**
 * Constructs the HTML, given the received data in the HTTP response from student detail creation
 * This is called on any crucial errors. This could be file saving errors for example
 *
 * @param {Object} xhr - The Object returned from $.ajax on an error
 * @param {string} error - The type of error. Most commonly 'bad request'
 *
 */
function writeError(xhr, error) {
	const statusId = "#submit-status span";
	const responseBodyId = "#submit-body";

    // Any HTML constructed in a previous response is removed
	clearOldResponse(statusId, responseBodyId);

    const responseText = `
        <p>${error} - ${xhr.status}</p>
        <p>${xhr.responseJSON}</p>
    `;

    $(statusId).text("FAILURE").addClass("failure");
    $(responseBodyId).html(responseText);
}
