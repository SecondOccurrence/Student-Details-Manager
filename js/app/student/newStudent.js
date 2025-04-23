"use strict";

$(document).ready(function() {
	formBehaviour();

	responseBehaviour();
});

function formBehaviour() {
	const photoChooserId = "#photo";
	const photoChooserButtonId = "#choose-photo";
	const photoChosenDivId = "#chosen-photo"

	formPhotoChooserBehaviour(photoChooserId, photoChooserButtonId, photoChosenDivId);
	formRadioBehaviour();

	inputErrorBehaviour();
}

function responseBehaviour() {
	const responseContainerId = "#submission-response";

	$(`${responseContainerId} > #nav > .button`).each(function() {
		$(this).mouseup(function() {
			const target = $(this).data("target");
			window.location.href = `/${target}`;
		});
	});
}

function formPhotoChooserBehaviour(photoChooser, photoChooserButton, photoChosenDiv) {

	$(photoChosenDiv).css("visibility", "hidden");

	$(photoChooser).change(function() {
		// Set the chosen photo container to the input[type=file]'s value
		$(`${photoChosenDiv} p`).text(this.files[0].name);
		$(photoChosenDiv).css("visibility", "visible");
		$(photoChooserButton).attr("disabled", "true").addClass("input-disabled");
	});

	$(`${photoChosenDiv} > img`).mouseup(function() {
		$(photoChosenDiv).css("visibility", "hidden");
		$(`${photoChosenDiv} p`).text("No file selected.");
		// Reset the input[type=photo]'s value
		$(photoChooser).val("");

		$(photoChooserButton).removeAttr("disabled").removeClass("input-disabled");
	});
}

function formRadioBehaviour() {
	$(`input[name="gender"]`).on("change", function() {
		const otherGenderRadioId = "#gender-other";
		const otherGenderLabelId = "#gender-other-label";
		const otherGenderInputId = "#other";

		// Enable/Disable Other Gender text input field if "Other" radio button is Selected/Deselected
		if($(otherGenderRadioId).prop("checked")) {
			$(otherGenderLabelId).removeAttr("disabled").removeClass("input-disabled");
			$(otherGenderInputId).removeAttr("disabled").removeClass("input-disabled");
		}
		else {
			$(otherGenderLabelId).attr("disabled", "true").addClass("input-disabled");
			$(otherGenderInputId).attr("disabled", "true").addClass("input-disabled").val("");
		}
	});
}

function inputErrorBehaviour() {
	// Reset any errors that might have been shown on a previous submission
	$("input").on("input", function() {
		if($(this).attr("class") === "has-error") {
			const id = $(this).attr("id");
			const relevantErrorMsg = `label[for=${id}].error-text`;

			$(this).removeClass("has-error");
			$(relevantErrorMsg).attr("hidden", "true");
		}
	});
}
