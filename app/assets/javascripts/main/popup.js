var autoSubmitExcel = {
  
  init: function() {
    $('#import-excel').on('click', function() {
      $('#pick-excel').click();
    });
    $('#pick-excel').on('change', function() {
      $('#submit-excel').click();
    });
  }
}; 

var transfer = {
	
	target: null,
	
	run: function(url) {
		
		if (docSelection.target.attr('item') == 'file') {
			url = '/user/group/file/transfer'
		} else if (docSelection.target.attr('item') == 'folder') {
			url = '/user/group/folder/transfer'
		} else if (docSelection.target.attr('item') == 'firepad') {
			url = '/user/group/document/firepad/transfer'
		};
		
		$.ajax({
			url: url,
			type:"PUT",
			dataType: 'JSON',
			data: {
				group_id: transfer.target.attr('group_id'),
				item_id: docSelection.target.attr('item_id')
			}
		});
		
		popup.hide("#slide-transfer-document");
	},
	
	resize: function() {
		var height = $('#transfer-document-wrapper').height()/2 - $('.group-list').height()/2
		$('.group-list').css('top', height)
	},
	
	init: function() {
	    
	  transfer.resize();

		$(window).resize(function(){
			transfer.resize();
		})
	    
		$('.list-element-group-transfer').on('click', function() {
			transfer.target = $(this).find('span');
			console.log(transfer.target);
		});
		
		$('#transfer-document-submit').on('click', function() {
			console.log(transfer.target);
			if (transfer.target != null) { 
				transfer.run();
				transfer.target = null;
			}
		})
	}
};

var group = {
	
	create: function() {
		if ($('#new-group-input').val() !== '') {
			console.log('AJAX');
			$.ajax({
				url: '/users/' + $(".user-name").attr("current_user_id") + '/groups?name=' + $('#new-group-input').val(),
				type:"POST",
				dataType: 'JSON',
				complete: function(data) {
					var group = data.responseJSON
					
					popup.hide("#slide-new-group");
					
					$('.sidebar-list-group').append(' \
            <a class="lateral-nav-element current-group-element" href="/user/group/documents?group_id=' + group.id + '&parent_id=100"> \
						<i class="fa fa-group"></i> \
						<!-- <object type="image/svg+xml" data="/assets/group-pic.svg" id="profile-pic"></object> --> \
						<span class="group-name-sidebar" group_id="' + group.id + '">' + group.name + '</span> \
					</a> \
					');
					
					$('.group-list-transfer-document').append(' \
            <div class="list-element"> \
              <i class="fa fa-group"></i> \
              <span class="list-element-name transfer-list" group_id="'+ group.id +'">'+ group.name +'</span> \
            </div> \
					');
					
					$('.group-list-all-groups').append(' \
					<a class="list-element" href="/user/group/documents?group_id='+ group.id +'&parent_id=100"> \
          	<i class="fa fa-group"></i> \
            <span class="list-element-name" group_id="'+ group.id +'"> \
                '+ group.name +' \
            </span> \
					</a> \
					');
				}
			})
		}
	},
	
	rename: function() {
		if ($('#group-config-rename-input').val() != '') {
			$.ajax({
				url: '/user/group/rename',
				type:"PUT",
				dataType: 'JSON',
				data: {
					user_id: $('#tab-perso').attr('current_user_id'),
					group_id: $('#active-group-nav').attr('group_id'),
					name: $('#group-config-rename-input').val()
				},
				complete: function(data) {
          if (data.responseJSON.success == true) {
            $('.group-name-sidebar').each( function() {
              if ( $(this).html() === $('#current-group-title').html() ) {
                $(this).html($('#group-config-rename-input').val())
              }
            })
						
            $('.list-element-name').each( function() {
              if ( $(this).html() === $('#current-group-title').html() ) {
                $(this).html($('#group-config-rename-input').val())
              }
            })
						
            $('#current-group-title').html($('#group-config-rename-input').val());
            popup.hide("#slide-group-config");
          }
        }
			})
		}
	},
	
	init: function() {
		$('#new-group-submit').on('click', group.create);
		$('#group-config-rename-submit').on('click', group.rename);
	}
};

var passwordCheck = {
	
  checkStrength: function(password) {
   var strength = 0
    if (password.length < 6) {
      $('#password-strength').removeClass();
      $('#password-strength').addClass('short');
      $('.strength-text').text('Too short');
      $('.password-notif').fadeOut(400);
      $('#password').removeClass('valid');
      return
    }
    else {
      $('.password-notif').fadeIn(400);
      $('#password').addClass('valid');
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
      if($(this).val()){
        $('#password-strength').fadeIn(400);
        $('.form-container').html(passwordCheck.checkStrength($('#password').val()));
      }
      else{
        $('#password-strength').fadeOut(400);
      }
    })
  }
};

var passwordSimilarity = {
  init: function(){
    $('#password-check').keyup(function(){
      if($(this).val()==$('#password').val() && $('#password').hasClass('valid')){
        $('.password-check-notif-bad').fadeOut(400);
        $('.password-check-notif-ok').fadeIn(400);
      }
      else if($(this).val()){
        $('.password-check-notif-ok').fadeOut(400);
        $('.password-check-notif-bad').fadeIn(400);
      }
      else{
        $('.password-check-notif-bad').fadeOut(400);
      }
    })
  }
};

var popup = {
  
  show: function(target) {
    $("#background-grey").css({"opacity" : "0.7"}).fadeIn(200);
    $(target).slideDown(400, function(){
      $(target).find('.slide-body').fadeIn(1);
    });
  },
  
  showWithListFile: function(target){
    $("#background-grey").css({"opacity" : "0.7"}).fadeIn(200);
    $(target).slideDown(400, function(){
      popup.verticalAlign(target,'.wrapper-group-list','.group-list');
      if($(target).attr('id') == 'slide-transfer-document'){
        popup.verticalAlign(target,'.wrapper-document-to-transfer','.document-to-transfer');
        $(target).find('.arrow-wrapper').fadeIn(1);
      }
    });
  },
  
  verticalAlign: function(target, wrapper, div){
    var maxHeight = $(target).find('.slide-body').height() - 40;
    $(target).find(wrapper).css('max-height', maxHeight);
    $(target).find(div).css('max-height', maxHeight);

    var top = $(target).find('.slide-body').height()/2 - $(target).find(wrapper).height()/2;
    $(target).find(wrapper).css('top', top).fadeIn(1);
  },

  hideWithListFile: function(target){
    $("#background-grey").css({"opacity" : "0.7"}).fadeOut(400);
    $(target).slideUp(200);
    $(target).find('.wrapper-group-list').css('top', top).fadeOut(1);
    if($(target).attr('id') == 'slide-transfer-document'){
      $(target).find('.wrapper-document-to-transfer').css('top', top).fadeOut(1);
      $(target).find('.arrow-wrapper').fadeOut(1);
    }
  },

  hide: function(target) {
    $("#background-grey").css({"opacity" : "0.7"}).fadeOut(400);
    $(target).slideUp(200);
    $(target).find('.slide-body').fadeOut(1);
  },

  selectGroup: function(){
    $(".list-element").on('click', function() { 
      $('.list-element').removeClass('active');
      $(this).addClass('active');
    } )
  },
  
  init: function() {
    $("#new-group").on('click', function() { popup.show("#slide-new-group") } );
    $("#current-group-config").on('click', function() { popup.show("#slide-group-config") } );
    $("#transfer-file").on('click', function() {
			if (docSelection.target != null && docSelection.target.attr('item') != 'folder') {
	      $("#transfered-item-name").html(docSelection.target.attr('name'));
	      popup.showWithListFile('#slide-transfer-document') 
			}
    });
    $("#all-groups").on('click', function() { popup.showWithListFile('#slide-all-groups') } );

    $("#close-slide-signup").on('click', function() { 
      $("#slide-signup").find('.fadeout-div').fadeOut(1);
      popup.hide("#slide-signup");
    });

    $("#close-new-group").on('click', function() { popup.hide("#slide-new-group") } );
    $("#close-all-groups").on('click', function() { popup.hideWithListFile("#slide-all-groups") } );
    $("#close-group-config").on('click', function() { popup.hide("#slide-group-config") } )
    $(".close-transfer-document").on('click', function() { popup.hideWithListFile("#slide-transfer-document") } )
    
    popup.selectGroup();
  }
};

var signup = {

	send: function() {
		console.log('ajax');
		$.ajax({
			url: '/user/update',
			type:"PUT",
			dataType: 'JSON',
			data: {
				id: $('#tab-perso').attr('current_user_id'),
				user: {
					name: $('#name').val(),
					email: $('#email').val(),
					password: $('#password').val(),
					password_confirmation: $('#password-check').val()
				}
			},
			complete: function() {
				$('#name-after-signup').html($('#name').val());
				$('#email-after-signup').html($('#email').val());
				$('#prompt-signup').html('Your account is not validated yet! &nbsp &nbsp Check your mails');
				signedUp.signedUp = true;
				signedUp.listen();
			}
		})
	},

  changePage: function(tohide, toshow, posIni, posEnd){
    $('#' + tohide + '-body, #'+ tohide + '-footer').hide("slide",{direction: posIni},800);
    $('#' + toshow + '-body, #'+ toshow + '-footer' ).show("slide",{direction: posEnd},800);
  },

  showSignup: function(toshow){
    popup.show("#slide-signup");
    $('#' + toshow + '-body, #'+ toshow + '-footer').fadeIn(1);
  },
	
	init: function() {
    $('#signout-toward-signup').on('click', function(){signup.changePage('signup-from-signout','signup-username','left', 'right')});
    $('#action-toward-signup').on('click', function(){signup.changePage('signup-from-action','signup-username','left', 'right')});
    $('#toward-confirmation').on('click', function(){signup.changePage('signup-username','email-check','left','right')});
    $('#back-to-signup').on('click', function(){ signup.changePage('email-check','signup-username','right','left')});

    $("#signup-button-navbar").on('click', function() { signup.showSignup("signup-username")});
		$("#toward-confirmation").on('click', function() { signup.send() });
    $('#exit-really').on('click', function() { signout.signout() }); 
		
	}
};

var signedUp = {
	
	signedUp: true,
	
	check: function() {
		$.ajax({
			url: '/signedup',
			type:"GET",
			dataType: 'JSON',
			data: {
				user_id: $(".user-name").attr('current_user_id')
			},
			complete: function(data) {
				signedUp.signedUp = data.responseJSON;
				signedUp.listen();
			}
		});
	},
	
	listen: function() {
		if (signedUp.signedUp == true) {
			$("#deco").off('click');
			$("#input-button-upload").attr('type','file');
			$("#deco").on('click', function() { signout.signout() });
		} else {
			$("#upload-doc").off('click');
			$("#deco").off('click');
			$("#input-button-upload").attr('type','');
	    $("#upload-doc").on('click', function() { signup.showSignup("signup-from-action")});
			$("#deco").on('click', function() { signup.showSignup("signup-from-signout")});
		}
	},
	
	init: function() {
		signedUp.check();
	}
	
};

mainPopup = function() {
  signup.init();
	signedUp.init();
	transfer.init();
	group.init();
	popup.init();
	passwordCheck.init();
  passwordSimilarity.init();
  autoSubmitExcel.init();
};

$(document).on('ready page:load', function() {
	mainPopup();
});



