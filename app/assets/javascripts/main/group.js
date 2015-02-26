// // users search engine
//
// var users = new Bloodhound({
//  datumTokenizer: Bloodhound.tokenizers.obj.whitespace('email'),
//  queryTokenizer: Bloodhound.tokenizers.whitespace,
//  limit: 4,
//  remote: {
//    url: '/user/group/autocomplete?query=%QUERY'
//  }
//
// });
//
// // // average for evaluation
// //
// //     function get_average_evaluation() {
// //         $.get( window.location.href + "/average.json", function( data ) {
// //           $( ".average_evaluation" ).html( data );
// //         });
// //     }
// //
// // // average for classes
// //
// //     function get_average_course(balise) {
// //         var course_id = balise.closest('tr').attr("name");
// //         $.get( window.location.href + "/" + course_id + "/average.json", function( data ) {
// //             balise.closest('td').siblings('.average_course').html( data );
// //         });
// //     }
//
// $(document).on('ready page:load', function() {
//     // $(".best_in_place").best_in_place();
//     // $(".best_in_place").bind("ajax:success", function () {
// //         $(this).closest('tr').effect('highlight');
// //         get_average_evaluation();
// //         get_average_course($(this));
// //     });
//
//
//
//   users.initialize();
//  $('.typeahead').tokenfield({
//    typeahead: [null, {
//      name: 'users',
//      displayKey: 'email',
//      source: users.ttAdapter()}]
//  });
// });






// ---------------
// OLD BLOODHOUND
// -----------------



// var users = new Bloodhound({
// 	datumTokenizer: Bloodhound.tokenizers.obj.whitespace('email'),
// 	queryTokenizer: Bloodhound.tokenizers.whitespace,
// 	limit: 4,
// 	remote: {
// 		url: '/user/group/autocomplete?query=%QUERY'
// 	}
// });

// $(document).on('ready page:load', function() {


//   users.initialize();
// 	$('.typeahead').tokenfield({
// 	  typeahead: [null, {
// 			name: 'users',
// 	  	displayKey: 'email',
// 	  	source: users.ttAdapter()}]
// 	});
// });

// ---------
// EXAMPLE
// -----------



// $(document).on('ready page:load', function() {
// 	engine.initialize();

// 	$('.typeahead').tokenfield({
//   	typeahead: [null, { source: engine.ttAdapter() }]
// 	});

// });

// ----------
// BETTER ONE
// ----------

$(document).on('ready page:load', function() {

  var engine = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('email'),
    queryTokenizer: 
      Bloodhound.tokenizers.whitespace,
      limit: 4,
      remote: {
        url: '/user/group/autocomplete?query=%QUERY'
      }
  });

  engine.initialize();

	$('#tokenfield')
		.on('tokenfield:createtoken', function (e) {
	    var data = e.attrs.value.split('|')
	    e.attrs.value = data[1] || data[0]
	    e.attrs.label = data[1] ? data[0] + ' (' + data[1] + ')' : data[0]
	    $('.token').unwrap()
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
	    $(".token").wrapAll( "<div class='token-container'/>");
	  })

	  .on('tokenfield:edittoken', function (e) {
	    if (e.attrs.label !== e.attrs.value) {
	      var label = e.attrs.label.split(' (')
	      e.attrs.value = label[0] + '|' + e.attrs.value
	    }
	  })

	  .on('tokenfield:removedtoken', function (e) {
	    // alert('Token removed! Token value was: ' + e.attrs.value)
	  })

    .tokenfield({
      typeahead: [null, {
        name: 'users',
        displayKey: 'email',
        source: engine.ttAdapter()}]
    });

    // $(".token-input").wrapAll( "<div class='group-config-add-user'/>");
    // $(".group-config-add-user").prepend("<div class='group-config-title'>Add users</div>");

});

