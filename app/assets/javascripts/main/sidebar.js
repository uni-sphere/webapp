var folder = {
	init: function() {
		if (typeof localStorage['lastIndex'] != 'undefined') {
			var id = JSON.parse(localStorage[localStorage['lastIndex'] + 'breadcrumb']).box_id;
			$('#perso-folder').html( '<a href="/user/documents?folder=' + id + '" ><i class="fa fa-folder-open"></i>Folder </a>')
		}
	}
}

mainSidebar = function() {
	folder.init();
};

$(document).on('ready page:load', function() {
	mainSidebar();
});