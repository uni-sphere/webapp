var firepad = {
	setWidth: function(){
		var width = $('#firepad').height() * 1.41;
		var margin = $('#central-page').width()/2 - width/2;
		var height = $('#firepad').height() - $('.CodeMirror-sizer').offset().top;
		var origStyleContent = jQuery('.CodeMirror-sizer').attr('style');

		$('#firepad').css('width',width);
		$('#firepad').css('margin-left',margin);

		var offset = $('.CodeMirror-sizer').offset()
		var topWrapper =  offset.top - 30;
		var leftWrapper = offset.left - 30;
		var rightWrapper = $('.CodeMirror-sizer').width() + 60;
		

		$('#firepad-wrapper').css('left',leftWrapper);
		$('#firepad-wrapper').css('top',topWrapper);
		$('#firepad-wrapper').css('width',rightWrapper);
	},

	init: function(){
		firepad.setWidth();
		$( window ).resize(function() {
			firepad.setWidth();
		})
	}
};


mainFirepad = function() {
	firepad.init();
};



$(document).on('ready page:load', function() {

	
	if (window.location.href.indexOf("firepad") >= 0) {
		
		// var userId = $('.user-name').attr('current_user_id')
		var userId = Math.floor(Math.random() * 9999999999).toString();
		var firepadRef = new Firebase('https://luminous-heat-5158.firebaseio.com/' + $('#firepad').attr('firepad_ref'));
		// console.log(firepadRef.child('users')); to get methods
		var codeMirror = CodeMirror(document.getElementById('firepad'), { lineWrapping: true });
	  var firepad = Firepad.fromCodeMirror(firepadRef, codeMirror,
	  	{ richTextToolbar: true, richTextShortcuts: true, defaultText: 'Start working in collaboration!', userId: userId});
			
		// var firepadUserList = FirepadUserList.fromDiv(firepadRef.child('users'),
// 			document.getElementById('userlist'), userId);
//
// 		firepad.on('ready', function() {
// 			console.log(firepad.getText());
// 		});

		mainFirepad();

	}
		
});
