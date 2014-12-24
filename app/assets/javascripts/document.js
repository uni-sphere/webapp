
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
	
	init: function(url) {
		
  	$('.dragAndDrop').draggable(this.dragOptions);
		$('.dragAndDrop').droppable(this.dropOptions);
		
		$('.dragAndDrop').on("dragover", function( event, ui ) {
		   $(event.target).children('a').css('background-color',"blue");
		 });
		
 		$('.dragAndDrop').on("dragstart", function( event, ui ) {
			dragged = event.target;
			console.log($(dragged).attr("document_id"));
			item = $(event.target).attr("item");
			console.log("dragged set");
 		  $(event.target).children('a').css('font-weight',"bold");
 		 });
		
  	$('.dragAndDrop').on("dragstop", function( event, ui ) {
  		$(event.target).children('a').css('font-weight',"normal");
  	});
		 
		$('.dragAndDrop').on('drop', function( event, ui ) {
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
		})
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


var autoSubmitRename = {
	
	init: function() {
		var renameInput;
		$('.file-rename').on('click', function() {
			renameInput = $(this).parent().children('span').children('input');
			renameInput.removeClass('hidden').focus();
			renameInput[0].setSelectionRange(renameInput.val().length * 2, renameInput.val().length * 2);
		});
		$('#input-rename-file').on('blur', function() {
			$.ajax({
				url: 'http://localhost:3000/user/file/rename',
				dataType:"json",
				type:"PUT",
				data: {
					name: renameInput.val(),
					box_id: $(this).parent().attr('document_id'),
					type: $(this).parent().attr('id')
				},
				success: function() {
					renameInput.addClass('hidden');
				}
			});

			
		});
	}
};

$(document).ready(function() {
	var url,
		item;
	
	dragAndDrop.init(url);
	preview.init();
	// readFile.init();
	autoSubmitUpload.init();
	autoSubmitRename.init();
	
});












