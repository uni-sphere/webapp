// box file picker

var options = {
	clientId: "hscdzqs2qj9alkm1nc4t5pzqc8e8acyj",
	linkType: "direct",
	multiselect: "true"
};

var boxSelect = new BoxSelect(options);

// Register a success callback handler
boxSelect.success(function(response) {
	var user_id = $('.current_user').attr("name");
	boxSelect.closePopup();
	$.ajax({
		url: '/user/documents/import',
		dataType:"json",
		type:"POST",
		data:{
			user_id: user_id,
			box_name: response[0].name,
			box_id: response[0].id
		}
	});
});

// Register a cancel callback handler
boxSelect.cancel(function() {
	boxSelect.closePopup();
});


// Opens up the file picker window
// Could use it to trigger a launch of the popup from your own button
// NOTE: Should be triggered on a user action

$(document).ready(function() {
	$( ".box_import" ).click( function() {
		var boxSelect = new BoxSelect(options);
		boxSelect.launchPopup();
	});
});
