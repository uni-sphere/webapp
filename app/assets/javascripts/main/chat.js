

// mainChat = function() {
//   $('.chat-input-text').expanding({
//     update: function() {
//       var height = $(this).height();
//       var heightDisplay = $('.chat-main-panel').height();
//       console.log(height);
//       $('#chat-input-upload').css('height', height + 10);
//       $('.chat-display').css('height', heightDisplay - height - 33 - 30);
//     }
//   });
// };

// resize = function() {
//   $( window ).resize(function() {
//     var heightDisplay = $('.chat-main-panel').height();
//     var height = $('.chat-input-text').height();
//     var width = $('.chat-main-panel').width()
//     $('.chat-display').css('height', heightDisplay - height - 33 - 30);
//     $('.chat-display').css('width', width);
//   });
// };

// var activeChannel = {
//   init: function() {
//     $('.channel-element').hover(
//       function(){
//         var topPos = $(this).offset().top - 92;

//         var hover_caret = $('<div class="active-caret fa fa-caret-right special-active-caret"></div>')
//           .css('top', topPos)
//           .attr('id', 'special-active-caret-' + $(this).data('channel') );
//         $('.active-caret').after(hover_caret);
//       },
//       function() {
//         $('.special-active-caret').remove();
//       }
//     );

//     $('.channel-element').on('click', function() {
//       var topPos = $(this).offset().top - 92;

//       $('.active-caret').stop(false, false).animate(
//         {
//           top: topPos
//         },
//         1000,
//         'easeInOutQuart'
//       );
//     });
//   }
// }




// // var activeChannel = {
// //   init: function() {
// //     $('.channel-element').hover(
// //       function(){
// //         var caret = $('<i class="fa fa-caret-right" id="hover-caret"></i>')
// //         if(!$(this).hasClass('active')){
// //           $(this).prepend(caret);
// //         }
// //       },
// //       function() {
// //         $('#hover-caret').remove();
// //       }
// //     );


// //     $('.channel-element').on('click', function() {
// //       $('.channel-element').removeClass('active');
// //       $(this).addClass('active');
// //       $('.fa-caret-right').remove();
// //       var caret = $('<i class="fa fa-caret-right"></i>')
// //       $(this).prepend(caret);
// //     });
// //   }
// // }



// $(document).on('ready page:load', function() {
//   mainChat();
//   resize();
//   activeChannel.init();
//   var heightDisplay = $('.chat-main-panel').height();
//   var height = $('.chat-input-text').height();
//   var width = $('.chat-main-panel').width()
//   $('.chat-display').css('height', heightDisplay - height - 33 - 30);
//   $('.chat-display').css('width', width);
// });



