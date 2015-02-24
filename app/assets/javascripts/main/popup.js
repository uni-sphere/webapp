var popup = {
	
	show: function(target) {
		$("#background-grey").css({"opacity" : "0.7"}).fadeIn(200);
		$(target).slideDown(400);
	},
	
	hide: function(target) {
		$("#background-grey").css({"opacity" : "0.7"}).fadeOut(400);
		$(target).slideUp(200);
	},
	
	init: function() {
		$("#new-group").on('click', function() { popup.show("#slide-new-group") } );
		$("#all-groups").on('click', function() { popup.show("#slide-all-groups") } );
		$("#current-group-config").on('click', function() { popup.show("#slide-group-config") } );
		
		$("#close-new-group").on('click', function() { popup.hide("#slide-new-group") } );
		$("#close-all-groups").on('click', function() { popup.hide("#slide-all-groups") } );
		$("#close-group-config").on('click', function() { popup.hide("#slide-group-config") } )
	}
};

var group = {
	
	create: function() {
		if ($('#new-group-input').val() !== '') {
			console.log('AJAX');
			$.ajax({
				url: '/users/' + $(".user-name").attr("current_user_id") + '/groups?name=' + $('#new-group-input').val(),
				type:"POST",
				dataType: 'JSON',
				complete: function(data) {
					var group = data.responseJSON
					
					popup.hide("#slide-new-group");
					
					$('#all-groups').before(' \
					<a class="lateral-nav-element" href="/user/group/documents?group_id=' + group.id + '&parent_id=100"> \
						<i class="fa fa-group"></i> \
						<!-- <object type="image/svg+xml" data="/assets/group-pic.svg" id="profile-pic"></object> --> \
						<span class="group-name-sidebar" group_id="' + group.id + '">' + group.name + '</span> \
					</a> \
					');
				}
			})
		}
	},
	
	init: function() {
		$('#new-group-submit').on('click', group.create)
	}
};

var usersSearch = new Bloodhound({
	datumTokenizer: Bloodhound.tokenizers.obj.whitespace('email'),
	queryTokenizer: Bloodhound.tokenizers.whitespace,
	limit: 4,
	remote: {
		url: '/user/group/autocomplete?query=%QUERY'
	}
});

mainPopup = function() {

	group.init();
	
  usersSearch.initialize();
	$('.typeahead').tokenfield({
	  typeahead: [null, {
			name: 'users',
	  	displayKey: 'email',
	  	source: usersSearch.ttAdapter()}]
	});
	
	popup.init();
	
};

$(document).on('ready page:load', function() {
	mainPopup();
});
