$(document).ready(function () {

		var selected_div = null; 
    var selected_event = null;

// Functions
    var update_function = function (event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view) {
					$.ajax({
            url: window.location.href + '/events/' +event._id,
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
        if (selected_div) {   // si il existe un évènement précédement séléctionné
            selected_div.css('border', 'none'); // on supprime sa bordure css de
        }
        selected_div = $(this); // On mémorise la div sur laquelle on a cliqué
        selected_event = event; // on mémorise l'évènement
        $(this).css('opacity', '0.7');
        $(this).css('background-color', '#8600db');
        
    };
 
    function clear_selection(){
        selected_div = null;
        selected_event = null;
    };
    
    var key_up_handler = function(event){
      if (selected_event) { // si il y a une sélection active
         if (event.which == 46 ) { //si a touche est "suppr"
            if (confirm("Are you sure ?")) { // Demande de confirmation
               $.ajax({ //Envoi de la requête de suppression
                  url: window.location.href + '/events/' +selected_event._id, // prb d'url à modifier
                  dataType:'json',
                  type:"DELETE"
               }).done(function(){
                  $("#calendar").fullCalendar("refetchEvents");
                  clear_selection();
               }); //Réaffichage du calendrier qd fini.
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
		    left:   'prev,next',
		    center: '',
		    right:  'agendaWeek,month'
		},
		weekMode: 'liquid',
		eventColor: '#8600db',
		eventBorderColor: 'white',
		dragOpacity: {
    	agenda: 1
			},

//  dynamic
		selectable: true,
		editable: true,
		events: window.location.href,

// callbacks

		//création évenement
    selectHelper:true,
		select: function (start, end, allDay) {
			var title = prompt('Create an event');
				if (title) {
					$.post(window.location.href+'/events.json',
						{ 
							dataType: 'json',
        			event:{
							title:title,
					    start:start,
					    end:end,
					    allDay:allDay,
					   	editable:true,
							adminevent:false,
						}}
					);
				}
			$("#calendar").fullCalendar("refetchEvents");
      $("#calendar").fullCalendar("unselect");  	
			},
    
		// Drag&Drop
		eventDrop: update_function,
						
		// Rezise	
		eventResize: update_function,
		
		// On clik
		eventClick: click_in_event,
		
		//
	})
	$(document.documentElement).bind('keyup',key_up_handler)
});
