var signout = {
	
	signout: function() {
		$.ajax({
			url: '/signout',
			type:"DELETE",
			dataType: 'JSON',
			complete: function(data) {
				window.location = data.responseJSON.url
			}
		});
	},
	
	init: function() {
		$("#deco").on('click', function() { signout.signout() } );
	}
};

mainSignout = function() {
	signout.init();
};


$(document).on('ready page:load', function() {
	mainSignout();
});