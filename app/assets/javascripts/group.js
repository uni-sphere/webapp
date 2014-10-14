
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

// users search engine

	var users = new Bloodhound({
	  datumTokenizer: Bloodhound.tokenizers.obj.whitespace('email'),
	  queryTokenizer: Bloodhound.tokenizers.whitespace,
	  limit: 5,
	  remote: {
	    url: '../groups/:id/autocomplete?query=%QUERY',
	  }
		
	});

$(document).ready(function() {
	tasks.init();
	$('#examplePadBasic').pad({'padId':'test'});
	users.initialize();
	$('.typeahead').tokenfield({
	  typeahead: (null, {
			name: 'users',
	  	displayKey: 'email',
	  	source: users.ttAdapter()})
	});

});



