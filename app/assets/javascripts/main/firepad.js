// var firepadDisplay = {
//
// 	init: function() {
// 		console.log('https://luminous-heat-5158.firebaseio.com/' + $('#firepad').attr('firepad_ref'));
// 		var firepadRef = new Firebase('https://luminous-heat-5158.firebaseio.com/' + $('#firepad').attr('firepad_ref'));
// 		var codeMirror = CodeMirror(document.getElementById('firepad'), { lineWrapping: true });
//
// 		// Create a random ID to use as our user ID (we must give this to firepad and FirepadUserList).
//     // var userId = Math.floor(Math.random() * 9999999999).toString();
//
// 		// Create Firepad (with rich text features and our desired userId).
//     var firepad = Firepad.fromCodeMirror(firepadRef, codeMirror,
//     	{ richTextToolbar: true, richTextShortcuts: true, defaultText: 'Hello, World!'});
//
//
//
// 		// Create FirepadUserList (with our desired userId).
//     // var firepadUserList = FirepadUserList.fromDiv(firepadRef.child('users'),
//     // 	document.getElementById('userlist'), userId);
// 	}
//
// }

$(document).on('ready page:load', function() {
	
	if (window.location.href.indexOf("firepad") >= 0) {
		var firepadRef = new Firebase('https://luminous-heat-5158.firebaseio.com/' + $('#firepad').attr('firepad_ref'));
		var codeMirror = CodeMirror(document.getElementById('firepad'), { lineWrapping: true });
	  var firepad = Firepad.fromCodeMirror(firepadRef, codeMirror,
	  	{ richTextToolbar: true, richTextShortcuts: true, defaultText: 'Hello, World!'});
			
				// var firepadUserList = FirepadUserList.fromDiv(firepadRef.child('users'),
			// 		document.getElementById('userlist'));
			
				firepad.on('ready', function() {
				  // console.log(firepad.getText());
				});
	}
		
});