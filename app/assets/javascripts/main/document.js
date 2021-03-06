var breadcrumb = {
	
	target: null,
	timeDown: null,
	
	renderBreadcrumb: function() {
		// localStorage.clear();
		localStorage['0breadcrumb'] = JSON.stringify({'name': 'Perso', 'box_id': '0'});
		for( var i = 0 ; i<=localStorage['lastIndex'] ; i++ ) {
			var element = JSON.parse(localStorage[i + 'breadcrumb']);
			$('#breadcrumb').append('<a class="breadcrumb-redirection name-document" href="/user/documents?folder=' + element.box_id + '" breadcrumb_id=' + i + '>' + element.name + '</a> <span class="breadcrumb-separator">></span>')
			breadcrumb.fillNumber = 0;
			breadcrumb.popEvent = 0;
			if (docSelection.target != null) { docSelection.remove() };
		}
	},
	
	fillNumber: 0,
	
	fillBreadcrumbPerso: function() {
		breadcrumb.timeDown = new Date().getTime();
		breadcrumb.target.on('mouseup', function() {
			if (new Date().getTime()-breadcrumb.timeDown < 500 && breadcrumb.fillNumber == 0) {
				localStorage['lastIndex'] = parseInt(localStorage['lastIndex'])+1 || 1;
				localStorage[localStorage['lastIndex'] + 'breadcrumb'] = JSON.stringify({'name': breadcrumb.target.attr('name'), 'box_id': breadcrumb.target.attr('document_id')});
				breadcrumb.fillNumber = 1;
			}
		})
	},

	redirect: function() {
		console.log('redirect');
		localStorage['lastIndex'] = breadcrumb.target.attr('breadcrumb_id');
		for( var i = parseInt(localStorage['lastIndex']) + 1; i<3*localStorage.length ; i++ ){
			console.log(i);
			if (typeof localStorage[i + 'breadcrumb'] != 'undefined') {
				localStorage.removeItem(i + 'breadcrumb');
			}
		}
	},
	
	popFlag: 0,
	popEvent: 0,
	popped: ('state' in window.history && window.history.state !== null),
	initialURL: location.href,
	
	backButton: function() {
		var initialPop = !breadcrumb.popped && location.href == breadcrumb.initialURL;
		breadcrumb.popped = true;
		if (initialPop) return;
		if (breadcrumb.popFlag >= 1 && breadcrumb.popEvent == 0) {
			localStorage.removeItem([localStorage['lastIndex'] + 'breadcrumb']);
			localStorage['lastIndex'] = parseInt(localStorage['lastIndex'])-1;
			breadcrumb.popEvent = 1;
		} else {
			breadcrumb.popFlag = breadcrumb.popFlag + 1;
			setTimeout(function(){ breadcrumb.popFlag = 0 }, 500);
		}
		
	},
	
	perso: function() {
		breadcrumb.renderBreadcrumb();
						 
		$('.dragAndDrop').children('a').on('mousedown', function() {
			breadcrumb.target = $(this).parent('.dragAndDrop');
			if (breadcrumb.target.attr('item') == 'folder') {breadcrumb.fillBreadcrumbPerso()}
		});
		
		$(window).on('popstate', function(e) {
			breadcrumb.backButton();
		});
			
		$('#breadcrumb').children('a').on('click', function() {
			breadcrumb.target = $(this);
			breadcrumb.redirect()
		});
		
		$('.breadcrumb-redirection').on('click', function() {
			if (docSelection.target != null) { $( '#loader' ).removeClass("hidden"); }
		});
		
		$('.power-off').on('click', function() { localStorage.clear() })
	},
	
	group: function() {
		$('.go-folder').on('mousedown', function() {
			if ($(this).parent().parent('.dragAndDrop').attr('item') == 'folder') {
				localStorage['groupBreadcrumb'] = JSON.stringify({'name': $(this).parent().parent('.dragAndDrop').attr('name'), 'id': $(this).parent().parent('.dragAndDrop').attr('item_id')})
			}
		});
		
		if ($('#breadcrumb').children("a").length > 0) {
			var element = JSON.parse(localStorage['groupBreadcrumb']);
			$('#breadcrumb').append('<a class="breadcrumb-redirection name-document" href="/user/group/documents?folder_id=' + element.id + '&group_id=' + $('#breadcrumb').attr('group_id') + '">' + element.name + '</a>' )
		} else {
			$('#breadcrumb').append('<a class="breadcrumb-redirection name-document">' + $('#breadcrumb').attr('group_name') + '</a>' )
		}
		if (docSelection.target != null) { docSelection.remove() };
	},

	init: function() {
		setLocation(breadcrumb);
	}
};

var dragAndDrop = {
	drop: null,
	drag: null,
	item: null,
	
	dragOptions: {
		// appendTo: "tbody",
		// containment: "tbody",
		cursor: "pointer",
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

	fdragStart: function( event, ui ) {
		dragAndDrop.drag = $(event.target);
		dragAndDrop.item = $(event.target).attr("item");
		$(event.target).children('a').css('font-weight',"bold");
	},

	fdragStop: function( event, ui ) {
		dragAndDrop.drag.children('a').css('font-weight',"normal");
	},
	
	fdrop: function( event, ui ) {
		dragAndDrop.drop = $(event.target);
		setLocation(dragAndDrop);
	},
	
	move: function(moveUrl, moveData) {
		$.ajax({
			url: moveUrl,
			dataType:"json",
			type:"PUT",
			data: moveData,
			success: dragAndDrop.drag.parent().remove()
		});
	},
	
	perso: function() {
		url = '/user/' + dragAndDrop.item + '/move';
		data = {
			dragged: dragAndDrop.drag.attr("document_id"),
			dropped: dragAndDrop.drop.attr("document_id")
		}
		dragAndDrop.move(url, data);
	},
	
	group: function() {
		if (dragAndDrop.drag.attr("item") == 'file') {
			url = '/user/group/' + dragAndDrop.item + '/move';
			data = {
				dragged: dragAndDrop.drag.attr("item_id"),
				dropped: dragAndDrop.drop.attr("item_id"),
			}
		} else if (dragAndDrop.drag.attr("item") ==  'firepad') {
			console.log(dragAndDrop.drag);
			url = '/user/group/document/firepad/move';
			data = {
				dragged: dragAndDrop.drag.attr("item_id"),
				dropped: dragAndDrop.drop.attr("item_id"),
			}
		}
		
		dragAndDrop.move(url, data);
	},
	
	init: function(url) {
		
		$('.dragAndDrop').draggable(this.dragOptions);
		$('.dragAndDrop').droppable(this.dropOptions);
		
		$('.dragAndDrop').on("dragover", this.fdragOver );
		$('.dragAndDrop').on("dragstart", this.fdragStart );
		$('.dragAndDrop').on("dragstop", this.fdragStop );
		$('.dragAndDrop').on('drop', this.fdrop )
	}
}; // OK

var autoSubmitUpload = {
	
	init: function() {
		$('#upload-doc').on('click', function() {
			$('#input-button-upload').click();
			if (docSelection.target != null && docSelection.target.attr('item') == 'file'  ) { $( '#loader' ).removeClass("hidden"); }
		});
		$('#input-button-upload').on('change', function() {
			$('#submit-button-upload').click();
		});
	}
}; // OK

var rename = {
	
	renameInput: null,
	docName: null,
	docType: null,
	format: null,
	target: null,
	
	showInput: function() {
			
		rename.docType = $(this).parent().parent().children('span').attr('item');
		rename.docName = $(this).parent().parent().children('span').children('a');
		renameInput = $(this).parent().parent().children('span').children('input');
		
		if (rename.docType == 'file') {
			var nameWithFormat = renameInput.attr("value");
			var nameWithoutFormat = nameWithFormat.slice(0, nameWithFormat.lastIndexOf('.'));
			rename.format = nameWithFormat.slice(nameWithFormat.lastIndexOf('.'), nameWithFormat.length);
			console.log('format:');
			console.log('with:' + nameWithFormat);
			console.log('without:' + nameWithoutFormat);
			console.log('format:' + rename.format);
			console.log('=====');
		}
		
		renameInput.attr("value", nameWithoutFormat);
		renameInput.removeClass('hidden').focus();
		renameInput[0].setSelectionRange(renameInput.val().length * 4, renameInput.val().length * 2);
		
	},
	
	ajaxSuccess: function() {
		console.log('enter test:');
		console.log(rename.format);
		console.log('=====');
		(rename.format == null) ? rename.docName.children('.name-document').html(renameInput.val()) : rename.docName.children('.name-document').html(renameInput.val() + rename.format);
		renameInput.attr("value", (rename.format == null) ? renameInput.val() : renameInput.val() + rename.format);
		renameInput.addClass('hidden');
		rename.format = null;
	},
	
	perso: function(url, data) {
		url = '/user/' + rename.docType + '/rename';
		data = {
			name: (rename.format == null) ? renameInput.val() : renameInput.val() + rename.format,
			box_id: rename.target.parent().attr('document_id'),
			type: rename.docType
		};
		
		rename.rename(url, data);
	},
	
	group: function(url, data) {
		if (rename.docType == 'folder' || rename.docType == 'file') {
			url = '/user/group/' + rename.docType + '/rename';
			data = {
				name: (rename.format == null) ? renameInput.val() : renameInput.val() + rename.format,
				item_id: rename.target.parent().attr('item_id')
			}
		} else if (docSelection.target.attr('item') == 'firepad') {
			url = '/user/group/document/firepad/rename';
			data = {
				firepad_id: docSelection.target.attr('item_id'),
				name: renameInput.val()
			}
		}
		rename.rename(url, data);
	},
	
	rename: function(renameUrl, renameData) {
		console.log('rename:');
		console.log(renameData);
		console.log('=====');
		$.ajax({
			url: renameUrl,
			type:"PUT",
			data: renameData
		});
		rename.ajaxSuccess();
	},
	
	enterFlag: false,
	
	init: function() {
		$('.document-rename').on('click', this.showInput );
		$('.input-rename-document').on('blur', function() {
			rename.target = $(this);
			if (rename.enterFlag == false) { setLocation(rename) };
			rename.enterFlag = true;
			setTimeout(function(){ rename.enterFlag = false }, 300);
		});
		$('.input-rename-document').on('keyup', function(event) {
			if (event.keyCode == $.ui.keyCode.ENTER) {
				rename.target = $(this);
				$(this).blur();
				setLocation(rename);
				rename.enterFlag = true;
				setTimeout(function(){ rename.enterFlag = false }, 300);
			};
		})
	}
}; // OK

var trash = {
	
	group: function(url, params) {
		if (docSelection.target.attr('item') == 'file') {
			url = '/user/group/document/file/delete';
			params = { file_id: docSelection.target.attr('item_id') }
		} else if (docSelection.target.attr('item') == 'folder') {
			url = '/user/group/document/folder/delete';
			params = { folder_id: docSelection.target.attr('item_id') }
		} else if (docSelection.target.attr('item') == 'firepad') {
			url = '/user/group/document/firepad/destroy';
			params = { firepad_id: docSelection.target.attr('item_id') }
		};
		trash.trash(url, params);
	},
	
	perso: function() {
		trash.trash('/user/document/delete', { folder: docSelection.target.attr('folder'), box_id: docSelection.target.attr('document_id'), type: docSelection.target.attr('item')});
	},
	
	trash: function(trashUrl, data) {
		$.ajax({
			url: trashUrl,
			type:"DELETE",
			data: data,
			complete: function(data) {
				docSelection.target.parent('.box_document').remove();
				$( '#loader' ).addClass("hidden");
				docSelection.target = null;
			}
		});
	},
		 
	init: function() {
		$('#delete-doc').on('click', function() {
			if (docSelection.target != null) { $( '#loader' ).removeClass("hidden"); }
			setLocation(trash);
		})
	}
}; // OK

var download = {
	
	group: function() {
		if (docSelection.target.attr('item') == 'file') {
			download.download('/user/group/document/download')
		}
		if (docSelection.target.attr('item') == 'firepad') {
			// download.download('/user/group/document/download')
		}
	},	
	
	perso: function() {
		download.download('/user/file/download')
	},	
	
	download: function(dlUrl) {
		$.ajax({
			url: dlUrl,
			type:"GET",
			dataType: 'JSON',
			data: {
				box_id: docSelection.target.attr('document_id'),
			},
			complete: function(data) {
				window.location = data.responseJSON.url;
				$( '#loader' ).addClass("hidden");
			}
		});
	},
	
	init: function() {
		$('#download-doc').on('click', function() {
			if (docSelection.target != null && docSelection.target.attr('item') == 'file' ) { $( '#loader' ).removeClass("hidden"); }
			console.log('download');
			setLocation(download);
		})
	}
}; // OK

var docSelection = {
	target: null,
	
	remove: function() {
		docSelection.target.parent().removeClass("document-selected");
		docSelection.target = null;
	},

	init: function() {
		$('.box_document').on('click', function() {
			if (docSelection.target != null) {
				docSelection.remove();
				$('#link-display').html('');
			};
			docSelection.target = $(this).children('.dragAndDrop');
			console.log(docSelection.target);
			$(this).addClass("document-selected").removeClass("document-hovered");
		});
		
		$('.go-file').on('click', function() {
			if (docSelection.target != null) { $( '#loader' ).removeClass("hidden"); }
		})
	}
}; // OK

var shareLink = {
	
	init: function() {
		$('#link-doc').on('click', function() {
			setLocation(shareLink);
		});
	},
	
	fnDeSelect: function() {
		if (document.selection) {
			document.selection.empty();
		}
		else if (window.getSelection) {
			window.getSelection().removeAllRanges();
		}
	},
	
	fnSelect: function(objId) {
		shareLink.fnDeSelect();
		if (document.selection)
		{
			var range = document.body.createTextRange();
			range.moveToElementText(document.getElementById(objId));
			range.select();
		}
		else if (window.getSelection)
		{
			var range = document.createRange();
			range.selectNode(document.getElementById(objId));
			window.getSelection().addRange(range);
		}
	},
	
	perso: function() {
		shareLink.createLink('/user/file/create_shared_link')
	},
	
	group: function() {
		if (docSelection.target.attr('item') == 'file') {
			shareLink.createLink('/user/group/file/create_shared_link')
		}
		if (docSelection.target.attr('item') == 'firepad') {
			$('#link-display').html('Not available');
			shareLink.fnSelect('link-display');
		}
	},
	
	createLink: function(shareUrl) {
		console.log('share ajax');
		if (docSelection.target.attr('item') == 'file') {
			if (docSelection.target != null) { $( '#loader' ).removeClass("hidden"); }
			$.ajax({
				url: shareUrl,
				type:"POST",
				data: {
					box_id: docSelection.target.attr('document_id'),
				},
				complete: function(data) {
					$('#link-display').html(data.responseText);
					shareLink.fnSelect('link-display');
					$( '#loader' ).addClass("hidden");
				}
			});
		}
	},
	
	positionBottomLink: function() {
		$('#link-display')
		.animate(
			{
				paddingTop: '20px',
				opacity: 0
			},
			'fast',
			'linear'
		);
		$(this).hide();
	},
	
	positionTopLink: function() {
		$('#link-display')
		.show()
		.css('opacity', 0)
		.delay(200)
		.animate(
			{
				paddingTop: '0px',
				opacity: 1
			},
			'fast',
			'linear'
		);
	}
} // OK

var hover = {
	init: function() {

		$('.box_document').mouseover(function() {
			if (!$(this).hasClass("document-selected")){
				$(this).addClass('document-hovered')
			}
			$('#actions-selected-doc').addClass('action-possible');
		})

		$('.box_document').mouseout(function() {
			if (!$(this).hasClass("document-selected")){
				$(this).removeClass('document-hovered')
			}
			if (docSelection.target == null) { $('#actions-selected-doc').removeClass('action-possible') }
		})

		$('#new-doc').hover(
			function(e) {
				$(this).find('#new-actions')
				.show()
				.css('opacity', 0)
				.delay(200)
				.animate(
					{
						paddingTop: '0px',
						opacity: 1
					},
					'fast',
					'linear'
				);
			},
			function(e) {
				var obj = $(this);
				$(this).find('#new-actions')
				.animate(
					{
						paddingTop: '12px',
						opacity: 0
					},
					'fast',
					'linear',
					function() {
						$(this).hide();
						// $( obj ).css('overflow', 'hidden');
					}
				);
			}
		);

		$('#actions-selected-doc .action .fa').mouseover(function() {
			if (docSelection.target != null){
				$(this).addClass('action-hovered')
			}
		})

		$('#actions-creation .action .fa').mouseover(function() {
			$(this).addClass('action-hovered')
		})

		$('.action .fa').mouseout(function() {
				$(this).removeClass('action-hovered')
		})
	}
}; // OK
	
var folderRedirection = {
	init: function() {
		$('.go-folder').on('click', function(e) {
			if (docSelection.target != null) { docSelection.remove() };
			if (docSelection.target != null) { $( '#loader' ).removeClass("hidden"); }
		})
	}
}; // OK

var firepadList = {

	create: function() {
		$.ajax({
			url: '/user/group/document/firepad/create',
			type:"POST",
			dataType: 'JSON',
			data: {
				groupfolder_id: $('#breadcrumb').attr('folder_id'),
				group_id: $('#breadcrumb').attr('group_id')
			}, 
			complete: function(data) {
				window.location = '/user/group/document/firepad/read?firepad_id=' + data.responseJSON.id + '&group_id=' + $('#breadcrumb').attr('group_id')
			}
		})
	},
	
	init: function() {
		$('#create-firepad').on('click', function() {
			firepadList.create()
		})
		
	}

};


setLocation = function(target) {
	if (window.location.href.indexOf("group") >= 0) {
		target.group();
	} else {
		target.perso();
	}
};

mainSimpleDocument = function() {
	folderRedirection.init();
	breadcrumb.init();
	dragAndDrop.init();
	docSelection.init();
	autoSubmitUpload.init();
	rename.init();
	trash.init();
	shareLink.init();
	download.init();
	hover.init();
	firepadList.init();
	
	$(window).on('popstate', function() {
		$( '#loader' ).addClass("hidden");
	})
};

$(document).on('ready page:load', function() {
	mainSimpleDocument();
});

$(document).on('before-unload', function() {
	$( '#loader' ).addClass("hidden");
});










