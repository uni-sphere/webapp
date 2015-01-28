// var opts = {
//     context: $('li')
//     , cloneClass: 'faketextarea'
// };
// $('textarea').on('keydown', function(event) {
//     if (event.keyCode == 13)
//         if (!event.shiftKey) $('#testForm').submit();
// });

// $('#testForm').on('submit', function() {
//     document.write("Test Form submitted!");
// });



// var popupShow = {
//   init: function() {
//     $('#more-groups').on('click', function() {
//       console.log('hello');
//        $("#background-grey").css({"opacity" : "0.7"}).fadeIn(200);
//       // $('#slide-more-groups').show( "slide", 200 );
//       $('#slide-more-groups').slideDown(400);
//     });
//   }
// }

mainChat = function() {
  $('.chat-input-text').expanding({
    update: function() {
      var height = $(this).height();
      var heightDisplay = $('.chat-main-panel').height();
      console.log(height);
      $('#chat-input-upload').css('height', height + 10);
      $('.chat-display').css('height', heightDisplay - height - 33);
      
      // $(this).css('padding-bottom', 2);
    }
  });
};

$(document).on('ready page:load', function() {
  mainChat();
  var heightDisplay = $('.chat-main-panel').height();
  var height = $('.chat-input-text').height();
  $('.chat-display').css('height', heightDisplay - height - 33);
});



