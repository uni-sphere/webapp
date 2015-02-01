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
      $('.chat-display').css('height', heightDisplay - height - 33 - 30);
      
      // $(this).css('padding-bottom', 2);
    }
  });
};

resize = function() {
  $( window ).resize(function() {
    console.log("plop");
    var heightDisplay = $('.chat-main-panel').height();
    var height = $('.chat-input-text').height();
    var width = $('.chat-main-panel').width()
    $('.chat-display').css('height', heightDisplay - height - 33 - 30);
    $('.chat-display').css('width', width);
  });
};

// hover = function() {
//   $('.channel-element').mouseover(function() {
//       $(this).addClass('channel-highligthen')
//     })

//     $('.box_document').mouseout(function() {
//       if (!$(this).hasClass("document-selected")){
//         $(this).removeClass('document-hovered')
//       }
//       if (docSelection.target == null) { $('#actions-doc').removeClass('selected-action') }
//     })
// }

$(document).on('ready page:load', function() {
  mainChat();
  resize();
  var heightDisplay = $('.chat-main-panel').height();
  var height = $('.chat-input-text').height();
  var width = $('.chat-main-panel').width()
  $('.chat-display').css('height', heightDisplay - height - 33 - 30);
  $('.chat-display').css('width', width);
});



