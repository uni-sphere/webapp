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

var activeMenu = {
  init: function() {
    $('.lateral-nav-element').hover(
      function(){
        var topPos = $(this).offset().top - 103;
        var hover_bar = $('<div class="active-menu special-active-menu"></div>')
          .css('top', topPos)
          .attr('id', 'special-active-menu-' + $(this).data('space') );
        $('.active-menu').after(hover_bar);
      },
      function() {
        $('.special-active-menu').remove();
      }
    );


    if($('#nav-perso').find('.previous').length != 0){
      var previousTop = $('#nav-perso .previous').offset().top - 103;
    }else{
      var previousTop = "18";
    }
    if($('#nav-perso').find('.active').length != 0){
       var actualTop = $('#nav-perso .active').offset().top - 103;
    }else{
      var actualTop = "18";
    }
   

    $('.active-menu').css('top', previousTop);
    $('.active-menu').animate(
      {
        top: actualTop
      },
      1000,
      'easeInOutQuart'
    );

  }
}




mainLayout = function() {
  popupShow.init();
  activeMenu.init();
};

// $(function () { /* ... */ });

$(document).on('ready page:load', function() {
  mainLayout();
});