
var dragged,
dropped,
item,
url,
selected;

var breadcrumb = {
	
	target: null,
	timeDown: null,
	
	renderBreadcrumb: function() {
		// localStorage.clear();
		localStorage['0breadcrumb'] = JSON.stringify({'name': 'Perso', 'box_id': '0'});
		for( var i = 0 ; i<=localStorage['lastIndex'] ; i++ ) {
			var element = JSON.parse(localStorage[i + 'breadcrumb']);
			$('#breadcrumb').append('> <a class="name-document" href="/user/documents?folder=' + element.box_id + '" breadcrumb_id=' + i + '>' + element.name + '</a> ')
			breadcrumb.fillNumber = 0;
			breadcrumb.popEvent = 0;
			if (docSelection.target != null) { docSelection.remove() };
		}
	},
	
	fillNumber: 0,
	
	fillBreadcrumb: function() {
		breadcrumb.timeDown = new Date().getTime();
		breadcrumb.target.on('mouseup', function() {
			if (new Date().getTime()-breadcrumb.timeDown < 500 && breadcrumb.fillNumber == 0) {
				console.log('fillBreadcrumb');
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
		
		console.log(breadcrumb.popFlag);
		if (breadcrumb.popFlag >= 1 && breadcrumb.popEvent == 0) {
			localStorage.removeItem([localStorage['lastIndex'] + 'breadcrumb']);
			localStorage['lastIndex'] = parseInt(localStorage['lastIndex'])-1;
			breadcrumb.popEvent = 1;
			console.log('BACK');
		} else {
			breadcrumb.popFlag = breadcrumb.popFlag + 1;
			setTimeout(function(){ breadcrumb.popFlag = 0 }, 500);
		}
		
	},
	
	init: function() {
		breadcrumb.renderBreadcrumb();
						 
		$('.dragAndDrop').children('a').on('mousedown', function() {
			breadcrumb.target = $(this).parent('.dragAndDrop');
			console.log(breadcrumb.target);
			if (breadcrumb.target.attr('item') == 'folder') {breadcrumb.fillBreadcrumb()}
		});
		
		$(window).on('popstate', function(e) {
			breadcrumb.backButton();
		});
			
		$('#breadcrumb').children('a').on('click', function() {
			breadcrumb.target = $(this);
			console.log('target:');
			console.log(breadcrumb.target);
			breadcrumb.redirect()
		});
		
		$('.power-off').on('click', function() { localStorage.clear() })
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
		console.log($(event.target));
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

var autoSubmitUpload = {
	
	init: function() {
		$('#upload-doc').on('click', function() {
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
			console.log('with:' + nameWithFormat);
			var nameWithoutFormat = nameWithFormat.slice(0, nameWithFormat.lastIndexOf('.'));
			console.log('without:' + nameWithoutFormat);
			rename.format = nameWithFormat.slice(nameWithFormat.lastIndexOf('.'), nameWithFormat.length);
			console.log('format:' + rename.format);
		}
		
		renameInput.attr("value", nameWithoutFormat);
		renameInput.removeClass('hidden').focus();
		renameInput[0].setSelectionRange(renameInput.val().length * 4, renameInput.val().length * 2);
	},
	
	rename: function() {
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
		(rename.format == null) ? rename.docName.children('.name-document').html(renameInput.val()) : rename.docName.children('.name-document').html(renameInput.val() + rename.format);
		renameInput.attr("value", (rename.format == null) ? renameInput.val() : renameInput.val() + rename.format);
		renameInput.addClass('hidden');
		rename.format = null;
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
				(rename.format == null) ? rename.docName.children('.name-document').html(renameInput.val()) : rename.docName.children('.name-document').html(renameInput.val() + rename.format);
				renameInput.attr("value", (rename.format == null) ? renameInput.val() : renameInput.val() + rename.format);
				renameInput.addClass('hidden');
				rename.format = null;
			};
		})
	}
};

var trash = {
	init: function() {
		$('#delete-doc').on('click', function() {
			console.log('trash ajax');
			Pace.track(function(){$.ajax({
				url: 'http://localhost:3000/user/document/delete',
				type:"DELETE",
				data: {
					folder: docSelection.target.attr('folder'),
					box_id: docSelection.target.attr('document_id'),
					type: docSelection.target.attr('item')
				},
				complete: function(data) {
					if (data.responseJSON == 204) {
						docSelection.target.parent('.box_document').remove();
					}
				}
			});});
		})
	}
};

var download = {
	init: function() {
		$('#download-doc').on('click', function() {
			console.log('download');
			$.ajax({
				url: 'http://localhost:3000/user/file/download',
				type:"GET",
				dataType: 'JSON',
				data: {
					box_id: docSelection.target.attr('document_id'),
				},
				complete: function(data) {
					window.location = data.responseJSON.url
				}
			});
		})
	}
};

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
			// $(this).css("background","#FF9F32");
			// $('.action').css("color","black");
			// $(this).attr("document-selected", "true");
			$(this).addClass("document-selected");

			// $('.action').css("color","grey");

			// $('.action').addClass('.black');
			// setTimeout(function(){ $('.action').css("color","black") }, 500);
		});
	}
};

var shareLink = {
	
	init: function() {
		$('#link-doc').on('click', function() {
			shareLink.positionBottomLink();
			shareLink.createLink();
			shareLink.positionTopLink();
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
	
	createLink: function() {
		console.log('share ajax');
		if (docSelection.target.attr('item') == 'file') {
			$.ajax({
				url: 'http://localhost:3000/user/file/create_shared_link',
				type:"POST",
				data: {
					box_id: docSelection.target.attr('document_id'),
				},
				complete: function(data) {
					if (data.status == 200) {
						console.log(data.responseText);
						$('#link-display').html(data.responseText);
						shareLink.fnSelect('link-display');
					}
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
}

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

var hover = {
	init: function() {

		$('.box_document').mouseover(function() {
			if (!$(this).hasClass("document-selected")){
				$(this).addClass('document-hovered')
			}
			$('#actions-doc').addClass('selected-action')
		})

		$('.box_document').mouseout(function() {
			if (!$(this).hasClass("document-selected")){
				$(this).removeClass('document-hovered')
			}
			if (docSelection.target == null) { $('#actions-doc').removeClass('selected-action') }
		})

		$('#new-doc').hover(
		function(e) {
			// $(this).css('overflow', 'visible');
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
						paddingTop: '20px',
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

		$('.action').mouseover(function() {
			if (docSelection.target != null){
				$(this).addClass('action-hovered')
			}
		})

		$('.action').mouseout(function() {
			if (docSelection.target != null){
				$(this).removeClass('action-hovered')
			}
		})

		// $('#new-doc > .fa-plus').mouseover(function() {
		// 	$('#new-actions').removeClass("hidden");
		// 	$(this).css("margin-top","25px");
		// })
		// $('#new-doc').mouseout(function() {
		// 	$('#new-actions').addClass("hidden");
		// 	$(this).css("margin-top","45px");
		// })
	}
};

mainDocument = function() {
	breadcrumb.init();
	dragAndDrop.init(url);
	docSelection.init();
	preview.init();
	autoSubmitUpload.init();
	rename.init();
	trash.init();
	shareLink.init();
	download.init();
	hover.init();
};

$(document).on('ready page:load', function() {
	mainDocument();
});











