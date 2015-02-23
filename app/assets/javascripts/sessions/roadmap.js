var progress = {
  init: function(progressValue){
    $('.task').each(function(){
      // console.log($(this))
      progressValue = $(this).attr("progress")
      console.log(progressValue)
      $(this).find('.progress').addClass('is-' + progressValue )
    })
    // console.log(tasks)
    
    // $('.progress').addClass('.is-' + progress )
  }
}

roadmap = function() {
  progress.init();
};

$(document).on('ready page:load', function() {
  roadmap();
});

