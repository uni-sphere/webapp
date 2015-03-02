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
			$("#transfered-item-name").html(docSelection.target.attr('name'));
			popup.showWithListFile('#slide-transfer-document') 
		});
		$("#all-groups").on('click', function() { popup.showWithListFile('#slide-all-groups') } );

		$("#close-slide-signup").on('click', function() { popup.hide("#slide-signup") } );
		$("#close-new-group").on('click', function() { popup.hide("#slide-new-group") } );
		$("#close-all-groups").on('click', function() { popup.hideWithListFile("#slide-all-groups") } );
		$("#close-group-config").on('click', function() { popup.hide("#slide-group-config") } )
		$(".close-transfer-document").on('click', function() { popup.hideWithListFile("#slide-transfer-document") } )
		
		popup.selectGroup();
	}
};

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
	    
		$('.list-element').on('click', function() {
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
								console.log('hello');
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

var signup = {

  showMailSent: function() {
    $('#before-signup-body').hide("slide",{direction: "left"},800);
    $('#before-signup-footer').hide("slide",{direction: "left"},800);
    $('#after-signup-body').show("slide",{direction: "right"},800);
    $('#after-signup-footer').show("slide",{direction: "right"},800);
  },
	
  showSignup: function() {
    $('#after-signup-body').hide("slide",{direction: "right"},800);
    $('#after-signup-footer').hide("slide",{direction: "right"},800);
    $('#before-signup-body').show("slide",{direction: "left"},800);
    $('#before-signup-footer').show("slide",{direction: "left"},800);
    $('#password').val('');
    $('#password-check').val('');
    $('.password-check-notif-bad').fadeOut(1);
    $('#password-strength').fadeOut(1);
  },
	
	send: function() {
		console.log('hello');
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
				},
				complete: function() {
					$('#name-after-signup').html($('#name').val());
					$('#email-after-signup').html($('#email').val());
				}
			}
		});
	},

  changePage: function(tohide, toshow, posIni, posEnd){
    $('#' + tohide + '-body, #'+ tohide + '-footer').hide("slide",{direction: posIni},800);
    $('#' + toshow + '-body, #'+ toshow + '-footer' ).show("slide",{direction: posEnd},800);
  },

  showSignup: function(toshow){
    popup.show("#slide-signup");
    $('#' + toshow + '-body, #'+ toshow + '-footer').fadeIn(1);
  },

	
	init: function(signedUp) {
    $('#signout-toward-signup').on('click', function(){signup.changePage('signup-from-signout','signup-username','left', 'right')});
    $('#toward-confirmation').on('click', function(){signup.changePage('signup-username','email-check','left','right')});
    $('#back-to-signup').on('click', function(){signup.changePage('email-check','signup-username','right','left')});

    $("#signup-button-navbar").on('click', function() { signup.showSignup("signup-username")});

    $('#exit-really').on('click', function() { signout.signout() }); 
	
		signedUp = false;
		
		$.ajax({
			url: '/signedup',
			type:"GET",
			dataType: 'JSON',
			data: {
				user_id: $(".user-name").attr('current_user_id')
			},
			complete: function(data) {
				signedUp = data.responseJSON
			}
		});
		
		if (signedUp == false) {
			$("#input-button-upload").attr('type','');
			$('#deco').off('click');
      $("#deco").on('click', function() { signup.showSignup("signup-from-signout")});
      $("#upload-doc").on('click', function() { signup.showSignup("signup-from-action")});
		}
	}
};

mainPopup = function() {
	signup.init();
	transfer.init();
	group.init();
	popup.init();
	passwordCheck.init();
  passwordSimilarity.init();
  autoSubmitExcel.init();
  signup.init();
};


$(document).on('ready page:load', function() {
	mainPopup();
});



