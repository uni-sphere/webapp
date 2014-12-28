
var dragged,
	dropped,
	item,
	url;

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

var readFile = {
	
	// init: function() {
	// 	$('#box_document').on('click', function() {
	// 		console.log('readfile');
	// 		$.ajax({
	// 			url: 'http://localhost:3000/user/group/document/read',
	// 			dataType:"json",
	// 			data: {
	// 				box_id: $(this).children().attr("box_id")
	// 			},
	// 			complete: function( data ) {
	// 				var key;
					
	// 				for (key in JSON.parse(data['responseText'])) {
	// 					if (JSON.parse(data['responseText']).hasOwnProperty(key)) {
	// 				  	$('#file-informations').append(JSON.parse(data['responseText'])[key] + "</br>");
	// 				  }
	// 				}
	// 			}
	// 		});
	// 	});
	// }
};	

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
	
	rename: function() {
		console.log($(this));
		console.log('ajax');
		$.ajax({
			url: 'http://localhost:3000/user/' + docType + '/rename',
			type:"PUT",
			data: {
				name: renameInput.val(),
				box_id: $(this).parent().attr('document_id'),
				type: $(this).parent().attr('id')
			}
		});
			
		docName.html(renameInput.val());
		renameInput.addClass('hidden');
			
	},
	
	showInput: function() {
		docName = $(this).parent().children('span').children('a');
		docType = $(this).parent().children('span').attr('item');
		renameInput = $(this).parent().children('span').children('input');
		renameInput.removeClass('hidden').focus();
		renameInput[0].setSelectionRange(renameInput.val().length * 2, renameInput.val().length * 2);
		console.log(renameInput)
	},
	
	init: function() {
		$('.document-rename').on('click', this.showInput );
		$('.input-rename-document').on('blur', this.rename );
		$('.input-rename-document').on('keyup', function(event) {
			if (event.keyCode == $.ui.keyCode.ENTER) {
				console.log($(this));
				$.ajax({
					url: 'http://localhost:3000/user/' + docType + '/rename',
					type:"PUT",
					data: {
						name: renameInput.val(),
						box_id: $(this).parent().attr('document_id'),
						type: $(this).parent().attr('id')
					}
				});
			
				docName.html(renameInput.val());
				renameInput.addClass('hidden');
				;
			};
		})
	}
};

var arianeWire = {
	init: function() {
		$.ajax({
			url: 'http://localhost:3000/user/document/arianewire',
			type:"GET",
			data: {
				box_id: $('#breadcrumb').attr('folder_id')
			},
			complete: function(data) {
				console.log(data[0]);
			}
		});
	}
};

motherFunction = function() {
	dragAndDrop.init(url);
	preview.init();
	// readFile.init();
	autoSubmitUpload.init();
	rename.init();
};

$(document).ready(function() {
	motherFunction();
});

$(document).on('page:load', function() {
	motherFunction;
});

$(document).on('page:before-change', function() {
	arianeWire.init();
})











