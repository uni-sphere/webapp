var group = {
	
	create: function() {
		if ($('new-group-input').val() !== '') {
			$.ajax({
				url: '/users/' + $(".user-name").attr("current_user_id") + '/groups?name=' + $('#new-group-input').val(),
				type:"POST",
				dataType: 'JSON',
				// data: {
// 					name: $('#new-group-input').val()
// 				}
			})
		}
	},
	
	init: function() {
		$('#new-group-submit').on('click', group.create)
	}
}

$(document).on('ready page:load', function() {
	group.init()
})
// users search engine



// // average for evaluation
//
//     function get_average_evaluation() {
//         $.get( window.location.href + "/average.json", function( data ) {
//           $( ".average_evaluation" ).html( data );
//         });
//     }
//
// // average for classes
//
//     function get_average_course(balise) {
//         var course_id = balise.closest('tr').attr("name");
//         $.get( window.location.href + "/" + course_id + "/average.json", function( data ) {
//             balise.closest('td').siblings('.average_course').html( data );
//         });
//     }

var users = new Bloodhound({
	datumTokenizer: Bloodhound.tokenizers.obj.whitespace('email'),
	queryTokenizer: Bloodhound.tokenizers.whitespace,
	limit: 4,
	remote: {
		url: '/user/group/autocomplete?query=%QUERY'
	}
});

// $(document).on('ready page:load', function() {
    // $(".best_in_place").best_in_place();
    // $(".best_in_place").bind("ajax:success", function () {
//         $(this).closest('tr').effect('highlight');
//         get_average_evaluation();
//         get_average_course($(this));
//     });
		
// 	group.init();

//   users.initialize();
// 	$('.typeahead').tokenfield({
// 	  typeahead: [null, {
// 			name: 'users',
// 	  	displayKey: 'email',
// 	  	source: users.ttAdapter()}]
// 	});
// });


// var engine = new Bloodhound({
//   local: [{value: 'red'}, {value: 'blue'}, {value: 'green'} , {value: 'yellow'}, {value: 'violet'}, {value: 'brown'}, {value: 'purple'}, {value: 'black'}, {value: 'white'}],
//   datumTokenizer: function(d) {
//     return Bloodhound.tokenizers.whitespace(d.value);
//   },
//   queryTokenizer: Bloodhound.tokenizers.whitespace
// });

// $(document).on('ready page:load', function() {
// 	engine.initialize();

// 	$('.typeahead').tokenfield({
//   	typeahead: [null, { source: engine.ttAdapter() }]
// 	});

// });

$(document).on('ready page:load', function() {
	$('#tokenfield')
		.on('tokenfield:createtoken', function (e) {
	    var data = e.attrs.value.split('|')
	    e.attrs.value = data[1] || data[0]
	    e.attrs.label = data[1] ? data[0] + ' (' + data[1] + ')' : data[0]
	  })
	  .on('tokenfield:createdtoken', function (e) {
	    var re = /\S+@\S+\.\S+/
	    var valid = re.test(e.attrs.value)
	    if (!valid) {
	      $(e.relatedTarget).addClass('invalid fa fa-user-times')
	    }
	    else{
	    	$(e.relatedTarget).addClass('fa fa-user')
	    }
	  })
	  .on('tokenfield:edittoken', function (e) {
	    if (e.attrs.label !== e.attrs.value) {
	      var label = e.attrs.label.split(' (')
	      e.attrs.value = label[0] + '|' + e.attrs.value
	    }
	  })
	  .on('tokenfield:removedtoken', function (e) {
	    alert('Token removed! Token value was: ' + e.attrs.value)
	  })

	  // .on('tokenfield:createdtoken', function (e) {
	  //   $(e.relatedTarget).addClass('fa fa-user')
	  // })


	  .tokenfield()

});

