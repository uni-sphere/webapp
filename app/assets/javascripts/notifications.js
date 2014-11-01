var notifications = {

	init: function() {
		$('.dropdown').on('click', '.dropdown-toggle',  this.refresh_param);
		$('body').on('click', ':not(.dropdown)', this.refresh_html);  
	},
	
	refresh_html: function() {
		$('.badge').load(window.location.href);
	},
	
	refresh_param: function() {
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