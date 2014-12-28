var notifications = {

	init: function() {
		$('.dropdown-toggle').data('open', false);
		$('.dropdown').on('click', '.dropdown-toggle', this.refresh_param); 
	},
	
	refresh_notif: function() {
		console.log('REFRESH NOTIF');
			$('#notifications').load("http://localhost:3000/users #notifications");
    // }
	},      
	
	refresh_param: function() {
		console.log('REFRESH PARAM');
		var notification_view = new Date().getTime()/1000;
		var user_id = $('.current_user').attr("name");	
		$.ajax({
			url: 'http://localhost:3000/users/' + user_id + '/viewparams',
			dataType:"json",
			type:"PUT",
			data: {
				notification_view: notification_view
			}
		});		
		$('main').on('click', notifications.refresh_notif() );
	}
}

$(document).ready(function() {
	notifications.init();
});