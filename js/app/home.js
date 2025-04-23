"use strict";

// Main Page

$(document).ready(function() {
	$(".option").mousedown(function() {
		$(this).addClass("button-active");
	});

	$(".option").mouseup(function() {
		$(this).removeClass("button-active");

        // Redirect to appropriate page
		const target = $(this).data("target");
		window.location.href = `/${target}`;
	});
});
