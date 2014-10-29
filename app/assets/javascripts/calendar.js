

$(document).ready(function () {
//
	var selected_div = null;
  var selected_event = null;

// Functions
	var edit_pop_up = function(data){
		$('#event-dlg').html(data).dialog({
			height:400,
      width: 410,
      resizable: true,
			title: '',
      modal:true,
      buttons: {
				'submit': function(){
					$('#event_form').submit()
					setTimeout(function(){
						$('#calendar').fullCalendar('unselect');
						$('#calendar').fullCalendar('refetchEvents');
						}, 90);
					$(this).dialog('close');
               }
            },
      open: function() {
				$(document.documentElement).unbind('keyup',key_up_handler);
				$("#event-dlg").keypress(function(e) {
					if (e.which == $.ui.keyCode.ENTER) {
						e.preventDefault();
						$(this).parent().find("button:eq(0)").trigger("click");
					}
				});
			},
      close: function( event, ui ) {
				$("#event-dlg").unbind("keypress");
				$(document.documentElement).bind('keyup',key_up_handler);
				$('#calendar').fullCalendar('unselect');
			}
		});
	};

	var update_function = function (event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view) {
		$.ajax({
			url: window.location.href + '/events/' + event._id,
			dataType:"json",
			type:"PUT",
			data:{
				event: {
					title:event.title,
					start:event.start,
					end:event.end,
					allDay:event.allDay,
					editable:true,
					adminevent:false,
				}}
			});
		};

  var click_in_event = function(event, jsEvent, view) {
		clear_selection();
		if (selected_div) {
			selected_div.css('border', 'none');
		}
		selected_div = $(this);
		selected_event = event;
		$(this).css('opacity', '0.7');
		$(this).css('background-color', '#8600db');
	};

  function clear_selection() {
		selected_div = null;
		selected_event = null;
  };

	var key_up_handler = function(event){
		if (selected_event) {
			if (event.which == 8 ) {
				if (confirm("Are you sure ?")) {
					$.ajax({
						url: window.location.href + '/events/' + selected_event._id,
						dataType:'json',
            type:"DELETE"
					}).done(function(){
						$("#calendar").fullCalendar("refetchEvents");
            clear_selection();
					});
				}
			}
		}
	};

	$('#calendar').fullCalendar({

// static
		weekends: false,
		defaultView:'agendaWeek',
		minTime: '08:00:00',
		maxTime: '18:00:00',
		slotEventOverlap: true,
		allDaySlot: false,
		header: {
			left:   '',
		  center: 'prev,next',
		  right:  ''
		},
		weekMode: 'liquid',
		eventColor: '$violet',

		eventBorderColor: 'white',
		dragOpacity: {
    	agenda: 1
			},

//  dynamic
		selectable: true,
		editable: true,
		events: window.location.href + '/events.json',

// callbacks

		//création évenement
		   selectHelper:true,

		// select: function (start, end, allDay) {
		// 	var title = prompt('Create an event');
		// 		if (title) {
		// 			$.post(window.location.href + '/events.json',
		// 				{
		// 					dataType: 'json',
		//         			event:{
		// 					title:title,
		// 			    start:start,
		// 			    end:end,
		// 			    allDay:allDay,
		// 			   	editable:true,
		// 					adminevent:false,
		// 				}}
		// 			);
		// 		}
		// 	$("#calendar").fullCalendar("refetchEvents");
		//  $("#calendar").fullCalendar("unselect");
		// 	},
		
		select:function (start, end, allDay) {
			$.ajax({
				url: window.location.href + '/events/new.js',
		    dataType:'html',
		    type:"GET",
		    data: { start: start, end: end },
		    success: edit_pop_up,
		    error: function(xhRequest, ErrorText, thrownError) {
					alert("Error... " + ErrorText + "        " + thrownError);
				}
			});
		},

		// Drag&Drop
		eventDrop: update_function,

		// Rezise
		eventResize: update_function,

		// On clik
		eventClick: click_in_event,

		// Dialog box
		eventRender: function(event, element) {
			element.bind('dblclick', function() {
				$.ajax({
					url: window.location.href + '/events/' + event._id + '/edit.js',
					dataType:"html",
					type:"GET",
					success: edit_pop_up,
					error: function(xhRequest, ErrorText, thrownError) {
						alert("Error... " + ErrorText + "        " + thrownError);
					}
				});
			});
		}
	})
	$(document.documentElement).bind('keyup',key_up_handler)
});

