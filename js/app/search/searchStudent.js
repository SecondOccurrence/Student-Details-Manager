"use strict";

$(document).ready(function() {
	const searchBarId = "#search-query";

    $("#search-results").hide();

	$(searchBarId).keyup(function() {
		// Query is case insensitive
		const query = $(searchBarId).val();
		const url = "/query";

		$.ajax({
			type: "POST",
			url: url,
			data: query,
			success: function(response) {
				writeResponse(response);
			},
            error: function(xhr, _status, error) {
                writeError(xhr, error);
            }
		});
	});
});

// Special event handler for mouseup on the 'view' button on the photo field
$(document).on("mouseup", "#view-image p", function(event) {
    // TODO: ignore any event except left click
	const container = $(this).parent();

	const currentImages = $(container).find("img");
	if(currentImages.length > 0) {
		currentImages.remove();

		// Update link text
		$(this).text("Click to View");
	}
	else {
		const imgSrc = $(this).data("target");

		$(container).append(`
			<img src="${imgSrc}" alt="Photo">
		`);

		// Update link text
		$(this).text("Click to Hide");
	}
});

/**
 * Formats the received search request data into HTML to add to the page
 * The HTML is a table row as part of a table. Containing fields for each corresponding field in the match array
 *
 * @param {Array} data - 2D array of fields of records. These are the matched records of the query.
 *
 */
function writeResponse(data) {
	const errorMsgId = "#msg-container";
    const tableId = "#search-results";
	const tableBodyId = `${tableId} tbody`;

	// No matches found for the query
	if(data.length === 0) {
		$(errorMsgId).text("No Matches Found.").removeAttr("hidden");
		// Hide the table
		$(tableId).hide();
		return;
	}

	// Hide and reset any previous error message
	if($(errorMsgId).attr("hidden") === undefined) {
		$(errorMsgId).text("").attr("hidden", "true");
	}

	// Clear previous response data
	$(tableBodyId).html("");
	$(tableId).show();

	let newRows = "";
    // For each match
	for(const row of data) {
		newRows += "<tr>"
        // For each field
		for(let i = 0; i < 7; i++) {
			const field = row[i] !== "" ? row[i] : "Not Provided";
			newRows += "<td>";

			// Photo field with provided photo
			if(i === 6 && row[i] !== "") {
				newRows += `<div id="view-image"><p data-target="${field}">Click to View</p></div>`;
			}
			else {
				newRows += field;
			}
			newRows += "</td>";
		}
		newRows += "</tr>";
	}

	$(tableBodyId).html(newRows);
}


function writeError(xhr, error) { 
	const tableBodyId = "#search-results tbody";
	const errorMsgId = "#msg-container";

	// Remove any previous query search result
	$(tableBodyId).html("");
	
	// Display the appropriate error message
	$(errorMsgId).text(`${error} - ${xhr.status}. ${xhr.responseJSON}`);
	$(errorMsgId).removeAttr("hidden");
}
