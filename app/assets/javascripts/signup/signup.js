var passwordCheck ={
  checkStrength: function(password){
   var strength = 0
    if (password.length < 6) {
      $('#password-strength').removeClass()
      $('#password-strength').addClass('short')
      $('.strength-text').text('Too short')
      $('.password-notif').fadeOut(400)
      return
    }
    else{
      $('.password-notif').fadeIn(400);
    }
    if (password.length > 7) strength += 1

    // If password contains both lower and uppercase characters, increase strength value.
    if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) strength += 1
    
    // If it has numbers and characters, increase strength value.
    if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/)) strength += 1
    
    // If it has one special character, increase strength value.
    if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/)) strength += 1
    
    // If it has two special characters, increase strength value.
    if (password.match(/(.*[!,%,&,@,#,$,^,*,?,_,~].*[!,%,&,@,#,$,^,*,?,_,~])/)) strength += 1
    
    // Calculated strength value, we can return messages
    // If value is less than 2
    if (strength < 2) {
      $('#password-strength').removeClass()
      $('#password-strength').addClass('weak')
      $('.strength-text').text('Weak')
    } else if (strength == 2) {
      $('#password-strength').removeClass()
      $('#password-strength').addClass('good')
      $('.strength-text').text('Good')
    } else {
      $('#password-strength').removeClass()
      $('#password-strength').addClass('strong')
      $('.strength-text').text('Strong')
    }
  },
  init: function(){
    $('#password').keyup(function() {
      $('#password-strength').fadeIn(400);
      $('.form-container').html(passwordCheck.checkStrength($('#password').val()));
    })
  }
}


var passwordSimilarity={
  init: function(){
    $('#password-check').keyup(function(){
      if($(this).text()==$('#password').text()){
        console.log($(this).text())
        // $('.password-check-notif-bad').fadeOut(400)
        $('.password-check-notif-ok').fadeIn(400)
      }
      else{
        $('.password-check-notif-ok').fadeOut(400)
        // $('.password-check-notif-bad').fadeIn(400)
      }
    })
  }
}

mainLayout = function() {
  passwordCheck.init()
  passwordSimilarity.init()
};

$(document).on('ready page:load', function() {
  mainLayout();
});

