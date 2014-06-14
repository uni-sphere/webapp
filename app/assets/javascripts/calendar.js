$(document).ready(function () {
	$('#calendar').fullCalendar({

// static
		weekends: false,
		defaultView:'agendaWeek',
		minTime: '08:00:00',
		maxTime: '18:00:00',
		slotEventOverlap: true,
		allDaySlot: false,
		header: {
		    left:   'prev,next',
		    center: '',
		    right:  'agendaWeek,month'
		},
		weekMode: 'liquid',
		

//  dynamic
		selectable: true,
		editable:true,
		events: window.location.href,

// callbacks
		selectHelper:true,
		select: function (start, end, allDay) {
			var title = prompt('Create an event');
				if (title) {
					$.post(window.location.href+'/events.json',
						{ event:{
							title:title,
					    		start:start,
					    		end:end,
					    		allDay:allDay,
					   		editable:true,
							adminevent:false,
						}}
					);
				}
				calendar.fullCalendar('unselect');
			    	calendar.fullCalendar('refetchEvents') ;
			},

		// Drag&Drop
		eventDrop:function (event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view) {
		    $.ajax({
		        url:'user/' + user._id + '/calendar/' + calendar_id + '/events/' + event._id, // prb d'url en dur à modifier
		        dataType:'json',
		        type:"PUT",
		        data:{
		            event:{// re-use event's data
		                title:event.title,
		                start:event.start,
		                end:event.end,
		                allDay:event.allDay
		            }
		        }
		    });
		},

		// Rezise
		eventResize:function (event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view) {
		    $.ajax({
		        url:'user/' + user._id + '/calendar/' + calendar_id + '/events/' + event._id,
		        dataType:'json',
		        type:"PUT",
		        data:{
		            event:{// re-use event's data
		                title:event.title,
		                start:event.start,
		                end:event.end,
		                allDay:event.allDay
		            }
		        }
		    });
		}
		
//
	})
});
