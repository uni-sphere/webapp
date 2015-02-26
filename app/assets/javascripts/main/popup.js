var popup = {
	
	show: function(target) {
		$("#background-grey").css({"opacity" : "0.7"}).fadeIn(200);
		$(target).slideDown(400);
	},


	// getMaxElementWidth: function (element){
	//   var maxWidth = 0;
	//   element.each(function(i){
	//   	console.log(typeof $(this))
	//   	console.log($(this).width());
	//     if($(this).width() > maxWidth){
	//       maxWidth = $(this).width();
	//     }
	//   });
	//   console.log(maxWidth);
	//   return maxWidth;
	// },

	

	showWithListFile: function(target){
		$("#background-grey").css({"opacity" : "0.7"}).fadeIn(200);
		$(target).slideDown(400, function(){
			// var top = $(target).find('.wrapper-default').height()/2 - $(target).find('.group-list').height()/2;
			var maxHeight = $(target).find('.wrapper-default').height() - 40;
			// var width = $(target).find('.group-list').width();
			// var maxItemWidth = popup.getMaxElementWidth($(target).find('.list-element')) + 15
			// console.log(maxItemWidth);
			// var width = $('#slide-all-groups').width()/2 + $(target).find('.group-list').width()/2;


			$(target).find('.wrapper-default').fadeIn(1);
			$(target).find('.group-list').css('max-height', maxHeight);
			// $(target).find('.group-list').css('top', top).fadeIn(1);

			// $(target).find('.group-list').css({'max-height': height, 'top':top}).fadeIn(1);
			// $(target).find('.group-list').css('top', top).fadeIn(1);
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
		// $("#all-groups").on('click', function() { popup.show("#slide-all-groups") } );
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

var transferFilePopup = {

	resize: function() {
		var height = $('#transfer-document-wrapper').height()/2 - $('.group-list').height()/2
		$('.group-list').css('top', height)
	},

	init: function(){
		transferFilePopup.resize();

		$(window).resize(function(){
			transferFilePopup.resize();
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
			},
			complete: function(data) { popup.hide("#slide-new-group") }
		});
	},
	
	init: function() {
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

mainPopup = function() {
	transferFilePopup.init();
	group.init();
	transfer.init();
	popup.init();
	
  //  usersSearch.initialize();
 	// $('.typeahead').tokenfield({
 	//   typeahead: [null, {
 	// 		name: 'users',
 	//   	displayKey: 'email',
 	//   	source: usersSearch.ttAdapter()}]
 	// });
	
};

$(document).on('ready page:load', function() {
	mainPopup();
	usersSearch.initialize();
	
	$('#tokenfield')
		.on('tokenfield:createtoken', function (e) {
	    var data = e.attrs.value.split('|')
	    e.attrs.value = data[1] || data[0]
	    e.attrs.label = data[1] ? data[0] + ' (' + data[1] + ')' : data[0]
	    $('.token').unwrap()
	  })
	  .on('tokenfield:createdtoken', function (e) {
	    var re = /\S+@\S+\.\S+/
	    var valid = re.test(e.attrs.value)
	    if (!valid) {
	      $(e.relatedTarget).addClass('invalid fa fa-user-times')
	    } 
	    else{
	    	$(e.relatedTarget).addClass('fa fa-user')
	    }
	    $(".token").wrapAll( "<div class='token-container'/>");
	  })
	  .on('tokenfield:edittoken', function (e) {
	    if (e.attrs.label !== e.attrs.value) {
	      var label = e.attrs.label.split(' (')
	      e.attrs.value = label[0] + '|' + e.attrs.value
	    }
	  })
	  .on('tokenfield:removedtoken', function (e) {
	    // alert('Token removed! Token value was: ' + e.attrs.value)
	  })

	  .tokenfield({
      typeahead: [null, {
        name: 'users',
        displayKey: 'email',
        source: usersSearch.ttAdapter()}]
    });

});
