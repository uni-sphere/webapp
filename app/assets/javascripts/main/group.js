// // users search engine
//
// var users = new Bloodhound({
// 	datumTokenizer: Bloodhound.tokenizers.obj.whitespace('email'),
// 	queryTokenizer: Bloodhound.tokenizers.whitespace,
// 	limit: 4,
// 	remote: {
// 		url: '/user/group/autocomplete?query=%QUERY'
// 	}
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
// 	$('.typeahead').tokenfield({
// 	  typeahead: [null, {
// 			name: 'users',
// 	  	displayKey: 'email',
// 	  	source: users.ttAdapter()}]
// 	});
// });