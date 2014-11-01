var notifications = {

	init: function() {
		$('.dropdown-toggle').data('open', false);
		$('.dropdown').on('click', '.dropdown-toggle',  this.refresh_param);
		$('main').on('click', this.refresh_notif);  
	},
	
	refresh_notif: function() {
    // if($('.dropdown-toggle').data('open', true)) {
    // 	$('.dropdown-toggle').data('open', false);
			$('#notifications').load("http://localhost:3000/users #notifications");
    // }
	},      
	
	refresh_param: function() {
		// $('.dropdown-toggle').data('open', true);
		var notification_view = new Date().getTime()/1000;
		var user_id = $('.current_user').attr("name");	
		$.ajax({
			url: 'http://localhost:3000/users/' + user_id + '/viewparams',
			dataType:"json",
			type:"PUT",
			data:{
				notification_view: notification_view
			}
			});		
	}
}

$(document).ready(function() {
	notifications.init();
});