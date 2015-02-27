var popup = {
	
	show: function(target) {
		$("#background-grey").css({"opacity" : "0.7"}).fadeIn(200);
		$(target).slideDown(400);
	},
	
	showWithListFile: function(target){
		$("#background-grey").css({"opacity" : "0.7"}).fadeIn(200);
		$(target).slideDown(400, function(){
			var maxHeight = $(target).find('.slide-body').height() - 40;
			$(target).find('.wrapper-group-list').css('max-height', maxHeight);
			$(target).find('.group-list').css('max-height', maxHeight);

			var top = $(target).find('.slide-body').height()/2 - $(target).find('.wrapper-group-list').height()/2;
			$(target).find('.wrapper-group-list').css('top', top).fadeIn(1);

			if($(target).attr('id') == 'slide-transfer-document'){
				var maxHeight = $(target).find('.slide-body').height() - 40;
				$(target).find('.wrapper-document-to-transfer').css('max-height', maxHeight);
				$(target).find('.document-to-transfer').css('max-height', maxHeight);

				var top = $(target).find('.slide-body').height()/2 - $(target).find('.wrapper-document-to-transfer').height()/2;
				$(target).find('.wrapper-document-to-transfer').css('margin-top', top).fadeIn(1);
				$(target).find('.arrow-wrapper').fadeIn(1);
			}
		});
	},
	
	hide: function(target) {
		$("#background-grey").css({"opacity" : "0.7"}).fadeOut(400);
		$(target).slideUp(200);
	},

	selectGroup: function(){
		$(".list-element").on('click', function() { 
			$('.list-element').removeClass('active');
			$(this).addClass('active');
		} )
	},
	
	init: function() {
		$("#new-group").on('click', function() { popup.show("#slide-new-group") } );
		$("#current-group-config").on('click', function() { popup.show("#slide-group-config") } );
		$("#transfer-file").on('click', function() { 
			$("#transfered-item-name").html(docSelection.target.attr('name'));
			popup.showWithListFile('#slide-transfer-document') 
		});
		$("#all-groups").on('click', function() { popup.showWithListFile('#slide-all-groups') } );

		$("#close-new-group").on('click', function() { popup.hide("#slide-new-group") } );
		$("#close-all-groups").on('click', function() { popup.hide("#slide-all-groups") } );
		$("#close-group-config").on('click', function() { popup.hide("#slide-group-config") } )
		$(".close-transfer-document").on('click', function() { popup.hide("#slide-transfer-document") } )
		
		popup.selectGroup();
	}
};

var transfer = {
	
	target: null,
	
	run: function(url) {
		
		if (docSelection.target.attr('item') == 'file') {
			url = '/user/group/file/transfer'
		} else if (docSelection.target.attr('item') == 'folder') {
			url = '/user/group/folder/transfer'
		} else if (docSelection.target.attr('item') == 'firepad') {
			url = '/user/group/document/firepad/transfer'
		};
		
		$.ajax({
			url: url,
			type:"PUT",
			dataType: 'JSON',
			data: {
				group_id: transfer.target.attr('group_id'),
				item_id: docSelection.target.attr('item_id')
			}
		});
		
		popup.hide("#slide-transfer-document");
	},
	
	resize: function() {
		var height = $('#transfer-document-wrapper').height()/2 - $('.group-list').height()/2
		$('.group-list').css('top', height)
	},
	
	init: function() {
	    
	    transfer.resize();

		$(window).resize(function(){
			transfer.resize();
		})
	    
		$('.list-element').on('click', function() {
			transfer.target = $(this).find('span');
			console.log(transfer.target);
		});
		
		$('#transfer-document-submit').on('click', function() {
			console.log(transfer.target);
			if (transfer.target != null) { 
				transfer.run();
				transfer.target = null;
			}
		})
	}
}

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
	
	rename: function() {
		if ($('#group-config-rename-input').val() != '') {
			$.ajax({
				url: '/user/group/rename',
				type:"PUT",
				dataType: 'JSON',
				data: {
					user_id: $('#tab-perso').attr('current_user_id'),
					group_id: $('#active-group-nav').attr('group_id'),
					name: $('#group-config-rename-input').val()
				},
				complete: function(data) {
					if (data.responseJSON.success == true) {
						$('#current-group-title').html($('#group-config-rename-input').val())
						popup.hide("#slide-group-config");
					}
				}
			})
		}
	},
	
	init: function() {
		$('#new-group-submit').on('click', group.create);
		$('#group-config-rename-submit').on('click', group.rename);
	}
};

mainPopup = function() {
	transfer.init();
	group.init();
	popup.init();
};


$(document).on('ready page:load', function() {
	mainPopup();
});
