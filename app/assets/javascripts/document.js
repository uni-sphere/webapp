
var dragged_file,
	dropped_folder;

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
	
	init: function() {
  	$('.dragAndDrop').draggable(this.dragOptions);
		$('.dragAndDrop').droppable(this.dropOptions);
		
		$('.dragAndDrop').on("dragover", function( event, ui ) {
		   $(event.target).children('a').css('background-color',"blue");
		 });
		
 		$('.dragAndDrop').on("dragstart", function( event, ui ) {
			dragged_file = event.target;
			console.log("dragged set");
 		  $(event.target).children('a').css('font-weight',"bold");
 		 });
		
  	$('.dragAndDrop').on("dragstop", function( event, ui ) {
  		$(event.target).children('a').css('font-weight',"normal");
  	});
		 
		$('.dragAndDrop').on('drop', function( event, ui ) {
			console.log("dropped set");			
			console.log(event.target);
			
			$.ajax({
				url: 'http://localhost:3000/user/document/move',
				dataType:"json",
				type:"PUT",
				data: {
					dragged_file: $(dragged_file).children('a').attr("name"),
					dropped_folder: $(event.target).children('a').attr("name")
				},
				success: $(dragged_file).parent().remove()
			});
		})
	}
}

$(document).ready(function() {
	
	dragAndDrop.init();
	
});












