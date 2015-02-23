var group = {
	
	create: function() {
		if ($('new-group-input').val() !== '') {
			$.ajax({
				url: '/users/#{$(".user-name").attr("current_user_id")}/groups',
				type:"POST",
				dataType: 'JSON',
				data: {
					name: $('new-group-input').val()
				}
			})
		}
	},
	
	init: function() {
		$('#new-group-submit').on('click', group.create)
	}
}

$(document).on('ready page:load', function() {
	
})