var folder = {
	init: function() {
		if (typeof localStorage['lastIndex'] != 'undefined') {
			var id = JSON.parse(localStorage[localStorage['lastIndex'] + 'breadcrumb']).box_id;
			$('#perso-folder').html( '<a href="/user/documents?folder=' + id + '" ><i class="fa fa-folder-open"></i>Folder </a>')
		}
	}
}

var groupRedirection = {
	target: null,
	
	storeGroup: function() {
		// localStorage['lastGroupViewed'] = '/user/group/documents?group_id='+groupRedirection.target.attr("group_id")+'&parent_id=100'
	},
	
	redirect: function() {
		window.location = localStorage['lastGroupViewed']
	},
	
	init: function() {
		$('#tab-group').on('click', groupRedirection.redirect())
		$('.group-name-sidebar').on('click', function() {
			console.log('hello group');
			groupRedirection.target = $(this);
			groupRedirection.storeGroup()
		})
	}
}

mainSidebar = function() {
	folder.init();
	// groupRedirection.init();
};

$(document).on('ready page:load', function() {
	mainSidebar();
});