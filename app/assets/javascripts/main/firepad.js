$(document).on('ready page:load', function() {
	
	if (window.location.href.indexOf("firepad") >= 0) {
		
		var userId = $('.user-name').attr('current_user_id')
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
	}
		
});
