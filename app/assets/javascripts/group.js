
 	function clear_selection() {
			$('.highlighted').removeClass('highlighted');
	}
		
	var tasks = {
	
	init: function() {
		$('.tasks').on('click', 'td',  this.select);  
		$('.tasks').on('dblclick', 'td', this.suppr);
	},
	
	select: function() {
  	clear_selection();
  	$(this).addClass('highlighted');
  },
	
 	dblclick: function() {
		$.ajax({
		    url:"user_group_path",
		 		type: "PUT",
				dataType: "json",
		 		success: function(data) {
		       return data;
		    }
		});
 	}, 
 	
 	suppr: function() {
			var task_id = $(this).attr("name");
			$.ajax({
		 		url:window.location.href + '/tasks/' + task_id,
		 		type: "DELETE",
		 		dataType: "json"
			});
			location.reload(); 
  	},

};

$(document).ready(function() {
	tasks.init();
});



