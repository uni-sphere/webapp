$(document).ready(function(){
  $('[data-toggle=offcanvas]').click(function() {
    // $(this).toggleClass('text-center ');
    $('#chevron').find('i').toggleClass('fa-chevron-left').toggleClass('fa-chevron-right');
    $('.row-offcanvas').toggleClass('active');
    $('#tabs-small').toggleClass('hidden-small').toggleClass('visible-small');
    $('#tabs-small-toggle').toggleClass('hidden-small').toggleClass('visible-small');
    $('#group-choice-small').toggleClass('hidden-small').toggleClass('visible-small');
    $('#tabs-perso-groups').toggleClass('hidden-small').toggleClass('visible-small');
    $('#sidebar-small').toggleClass('visible-small').toggleClass('hidden-small');
    $('#navbar').toggleClass('top-fixed').toggleClass('top-relative');
    $('#main-page').toggleClass('slide-left');
    $('#sidebar').toggleClass('sidebar-fixed');

  });

  $(window).resize(function() {
    if($(window).width() >= 768) {
      $('.row-offcanvas').removeClass('active');
      $('#chevron').find('i').removeClass('fa-chevron-left').addClass('fa-chevron-right');
      $('#navbar').addClass('top-fixed').removeClass('top-relative');
      $('#tabs-small').addClass('hidden-small').removeClass('visible-small');
      $('#tabs-perso-groups').addClass('hidden-small').removeClass('visible-small');
      $('#sidebar-small').addClass('visible-small').removeClass('hidden-small');
      $('#tabs-small').addClass('visible-xs').addClass('hidden-small').removeClass('visible-small');
      $('#tabs-small-toggle').addClass('visible-xs').addClass('visible-small').removeClass('hidden-small');
      $('#group-choice-small').removeClass('hidden-small').addClass('visible-small');
      $('#main-page').removeClass('slide-left');
      $('#sidebar').addClass('sidebar-fixed');
    } else{
      $('#tabs-small').removeClass('visible-xs');
      $('#tabs-small-toggle').removeClass('visible-xs');
    } 

  }).resize();

  // $('#list-groups').on('click', 'li', function(event) {
  //   $('#active-group').removeClass('hidden');
  // });

  // $('.groups-tab-link').click(function() {
  //   console.log('ti');
  //   $('#active-group').addClass('hidden');
  // });

});
