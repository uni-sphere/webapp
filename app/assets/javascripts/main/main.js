var popupShow = {
  init: function() {
    $('#more-groups').on('click', function() {
      console.log('hello');
       $("#background-grey").css({"opacity" : "0.7"}).fadeIn(200);
      // $('#slide-more-groups').show( "slide", 200 );
      $('#slide-more-groups').slideDown(400);
    });
  }
}

mainLayout = function() {
  popupShow.init();
};

$(document).on('ready page:load', function() {
  mainLayout();
});