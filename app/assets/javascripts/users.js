$(document).ready(function(){
  $('[data-toggle=offcanvas]').click(function() {
    $(this).toggleClass('text-center ');
    $(this).find('i').toggleClass('fa-chevron-right fa-chevron-left');
    $('.row-offcanvas').toggleClass('active');
    $('#sidebar-main-wrapper').toggleClass('hidden-small').toggleClass('visible-small');
    $('#sidebar-small').toggleClass('visible-small').toggleClass('hidden-small');
    $('#navbar').toggleClass('top-fixed').toggleClass('top-relative');
  });
});
