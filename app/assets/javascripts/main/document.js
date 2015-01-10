
var dragged,
	dropped,
	item,
	url;

var breadcrumb = {
	
	target: null,
	
	renderBreadcrumb: function() {
		// localStorage.clear();
		localStorage['0breadcrumb'] = JSON.stringify({'name': 'root', 'box_id': '0'});
		for( var i = 0 ; i<localStorage.length-1 ; i++ ) {
			var element = JSON.parse(localStorage[i + 'breadcrumb']);
			$('#breadcrumb').append('> <a class="name-document" href="/user/documents?folder=' + element.box_id + '" breadcrumb_id=' + i + '>' + element.name + '</a> ')
		}
	},
	
	fillBreadcrumb: function() {
		console.log('fillBreadcrumb');
		localStorage['lastIndex'] = parseInt(localStorage['lastIndex'])+1 || 1;
		localStorage[localStorage['lastIndex'] + 'breadcrumb'] = JSON.stringify({'name': breadcrumb.target.attr('name'), 'box_id': breadcrumb.target.attr('document_id')});
	},
	
	redirect: function() {
		console.log('redirect');
		localStorage['lastIndex'] = breadcrumb.target.attr('breadcrumb_id');
		for( var i = parseInt(localStorage['lastIndex']) + 1; i<localStorage.length ; i++ ){
			console.log(i);
			localStorage.removeItem(i + 'breadcrumb');
		}
	},
	
	init: function() {
		breadcrumb.renderBreadcrumb();
		$('.dragAndDrop').on('click', function() {
			breadcrumb.target = $(this);
			breadcrumb.fillBreadcrumb()
		});
		
		$('#breadcrumb').children('a').on('click', function() {
			breadcrumb.target = $(this);
			console.log('target:');
			console.log(breadcrumb.target);
			breadcrumb.redirect()
		});
	}
	
};

var selectable = {
	options: {
		autoRefresh: false
	},
	
	init: function() {
		$('.dragAndDrop').selectable(this.options);
	}
	
};

var dragAndDrop = {
	
	dragOptions: {
		appendTo: "tbody",
		// containment: "tbody",
		cursor: "crosshair",
		distance: 10,
		// helper: "clone",
		iframeFix: true,
		opacity: 0.7,
		revert: true,
		scroll: true,
		scrollSensitivity: 100,
		scrollSpeed: 100,
		snap: true,
		snapTolerance: 20,
		zIndex: 100
	},
	
	dropOptions: {
		// accept: "#folder",
		activeClass: "highlighted",
		greedy: true,
		tolerance: "intersect"
	},
	
	// functions
	
	fdragOver: function( event, ui ) {
		$(event.target).children('a').css('background-color',"blue");
	},

	fdragStart: function( event, ui ) {
		dragged = event.target;
		console.log($(dragged).attr("document_id"));
		item = $(event.target).attr("item");
		console.log("dragged set");
		$(event.target).children('a').css('font-weight',"bold");
	},

	fdragStop: function( event, ui ) {
		$(event.target).children('a').css('font-weight',"normal");
	},

	fdrop: function( event, ui ) {
		console.log("dropped set");
		console.log(event.target);
		if (window.location.href.indexOf("group") >= 0) {
			url = 'http://localhost:3000/user/group/' + item + '/move'
		} else {
			url = 'http://localhost:3000/user/' + item + '/move'
		}
		$.ajax({
			url: url,
			dataType:"json",
			type:"PUT",
			data: {
				dragged: $(dragged).attr("document_id"),
				dropped: $(event.target).attr("document_id"),
				group_id: $(dragged).children('a').attr("group_id")
			},
			success: $(dragged).parent().remove()
		});
	},
	
	init: function(url) {
		
  	$('.dragAndDrop').draggable(this.dragOptions);
		$('.dragAndDrop').droppable(this.dropOptions);
		
		$('.dragAndDrop').on("dragover", this.fdragOver );
 		$('.dragAndDrop').on("dragstart", this.fdragStart );
  	$('.dragAndDrop').on("dragstop", this.fdragStop );
		$('.dragAndDrop').on('drop', this.fdrop )
	}
};

var preview = {
	
	init: function() {
		$('.groupdoc').on('click', function() {
			$.ajax({
				url: 'http://localhost:3000/user/group/document/show',
				dataType:"json",
				type:"GET",
				data: {
					box_id: $(this).attr("box_id")
				}
			});
		});
	}
};

var readGroupFile = {
	
	init: function() {
		$('.box_document').on('click', function() {
			console.log('readfile');
			$.ajax({
				url: 'http://localhost:3000/user/group/document/read',
				dataType:"json",
				data: {
					box_id: $(this).children().attr("box_id")
				},
				complete: function( data ) {
					var key;
					var response = JSON.parse(data['responseText']);
					alert(JSON.stringify(response));
					for (key in response) {
						if (response.hasOwnProperty(key)) {
					  	$('#file-informations').append(JSON.parse(data['responseText'])[key] + "</br>");
					  }
					}
				}
			});
		});
	}
};

var readPersoFile = {
	
	init: function() {
		$('.box_document').on('click', function() {
			if ($(this).children('span').children('a').attr('item') == 'folder') {
				var file = JSON.parse($(this).children('span').children('a').attr('file'));
				$('#createdAt').html(jQuery.timeago(file['created_at']));
				$('#modifiedAt').html(jQuery.timeago(file['modified_at']));
				$('#fileSize').html(file['size'] + ' Ko');
			}
		})
	}
}

var autoSubmitUpload = {
	
	init: function() {
		$('#button-upload').on('click', function() {
			$('#input-button-upload').click();
		});
		$('#input-button-upload').on('change', function() {
			$('#submit-button-upload').click();
		});
	}
};

var rename = {
	
	renameInput: null,
	docName: null,
	docType: null,
	format: null,
	
	showInput: function() {
			
		rename.docType = $(this).parent().children('span').attr('item');
		rename.docName = $(this).parent().children('span').children('a');
		renameInput = $(this).parent().children('span').children('input');
		
		if (rename.docType == 'file') {
			var nameWithFormat = renameInput.attr("value");
			var nameWithoutFormat = nameWithFormat.slice(0, nameWithFormat.lastIndexOf('.'));
			rename.format = nameWithFormat.slice(nameWithFormat.lastIndexOf('.'), nameWithFormat.length);
		}
		
		renameInput.attr("value", nameWithoutFormat);
		renameInput.removeClass('hidden').focus();
		renameInput[0].setSelectionRange(renameInput.val().length * 2, renameInput.val().length * 2);
	},
	
	rename: function() {
		console.log($(this));
		console.log('ajax');
		$.ajax({
			url: 'http://localhost:3000/user/' + rename.docType + '/rename',
			type:"PUT",
			data: {
				name: (rename.format == null) ? renameInput.val() : renameInput.val() + rename.format,
				box_id: $(this).parent().attr('document_id'),
				type: rename.docType
			}
		});
		
		(rename.format == null) ? rename.docName.html(renameInput.val()) : rename.docName.html(renameInput.val() + rename.format);
		renameInput.addClass('hidden');
			
	},
	
	init: function() {
		$('.document-rename').on('click', this.showInput );
		$('.input-rename-document').on('blur', this.rename );
		$('.input-rename-document').on('keyup', function(event) {
			if (event.keyCode == $.ui.keyCode.ENTER) {
				console.log($(this));
				$.ajax({
					url: 'http://localhost:3000/user/' + rename.docType + '/rename',
					type:"PUT",
					data: {
						name: (rename.format == null) ? renameInput.val() : renameInput.val() + rename.format,
						box_id: $(this).parent().attr('document_id'),
						type: rename.docType
					}
				});
			
				(rename.format == null) ? rename.docName.html(renameInput.val()) : rename.docName.html(renameInput.val() + rename.format);
				renameInput.addClass('hidden');
				;
			};
		})
	}
};

main = function() {
	breadcrumb.init();
	
	// selectable.init();
	
	dragAndDrop.init(url);
	preview.init();
	
	// readGroupFile.init();
	readPersoFile.init();
	
	autoSubmitUpload.init();
	rename.init();
};

$(document).on('ready page:load', function() {
	main();
});











