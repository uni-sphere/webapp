var folder = {
	init: function() {
		if (localStorage['lastIndex']) {
			var id = JSON.parse(localStorage[localStorage['lastIndex'] + 'breadcrumb']).box_id;
			$('#perso-folder').html( '<a href="/user/documents?folder=' + id + '" ><i class="fa fa-folder-open"></i>Folder </a>')
		}
	}
};

var groupRedirection = {
	target: null,
	
	redirect: function() {
		console.log('redirect group');
		if (typeof localStorage['lastGroupViewed'] != 'undefined') {window.location = localStorage['lastGroupViewed']} 
	},
	
	storeGroup: function() {
		localStorage['lastGroupViewed'] = '/user/group/documents?group_id=' + groupRedirection.target.attr("group_id") + '&parent_id=100'
	},
	
	deleteStorage: function() {
		localStorage.clear();
	},
	
	init: function() {
		$('.deco').on('click', groupRedirection.deleteStorage);
		$('#tab-group').on('click', groupRedirection.redirect);
		$('.group-name-sidebar').on('click', function() {
			localStorage.removeItem('lastGroupViewed');
			groupRedirection.target = $(this);
			groupRedirection.storeGroup()
		})
	}
};

var firepad = {
	setWidth: function(){
		var width = $('#firepad').height() * 1.41;
		var margin = $('#central-page').width()/2 - width/2;
		// console.log(margin);
		$('#firepad').css('width',width);
		$('#firepad').css('margin-left',margin);
	},
	init: function(){
		firepad.setWidth();
		$( window ).resize(function() {
			firepad.setWidth();
		}
	}
};

mainSidebar = function() {
	folder.init();
	groupRedirection.init();
	firepad.setWidth();
};

$(document).on('ready page:load', function() {
	mainSidebar();
});