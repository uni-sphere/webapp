
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
				url = 'http://localhost:3000/user/document/move'
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
	
	init: function() {
		$('#box_document').on('click', function() {
			console.log('readfile');
			$.ajax({
				url: 'http://localhost:3000/user/group/document/read',
				dataType:"json",
				data: {
					box_id: $(this).children().attr("box_id")
				},
				complete: function( data ) {
					var key;
					
					for (key in JSON.parse(data['responseText'])) {
						if (JSON.parse(data['responseText']).hasOwnProperty(key)) {
					  	$('#file-informations').append(JSON.parse(data['responseText'])[key] + "</br>");
					  }
					}
				}
			});
		});
	}
};	

var autoSubmit = {
	
	init: function() {
		$('#file_field').on('change', function() {
			$('#upload_button').click()
		})
	}
}

$(document).ready(function() {
	var url,
		item;
	
	dragAndDrop.init(url);
	preview.init();
	readFile.init();
	autoSubmit.init();
	
});












