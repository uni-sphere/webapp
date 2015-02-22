var firepad = {
	
	read: function() {
		$.ajax({
			url: '',
			type:"GET",
			dataType: 'JSON',
			data: {
				id:
			},
			complete: function() {
			}
	},
	
	destroy: function() {
		$.ajax({
			url: '',
			type:"DELETE",
			dataType: 'JSON',
			data: {
				id:
			},
			complete: function() {
			}
	},
	
	rename: function() {
		$.ajax({
			url: '',
			type:"PUT",
			dataType: 'JSON',
			data: {
				name: 
			},
			complete: function() {
			}
	},
	
	create: function() {
		$.ajax({
			url: '',
			type:"POST",
			dataType: 'JSON',
			data: {
				firebase_url: ,
				groupfolder_id: ,
				name: 'New Firepad',
				owner: ,
			},
			complete: function() {
			}
		})
	},
	
	init: function() {
		var firepadRef = new Firebase('https://luminous-heat-5158.firebaseio.com/test');
		var codeMirror = CodeMirror(document.getElementById('firepad'), { lineWrapping: true });
			
		// Create a random ID to use as our user ID (we must give this to firepad and FirepadUserList).
    var userId = Math.floor(Math.random() * 9999999999).toString();
    
		// Create Firepad (with rich text features and our desired userId).
    var firepad = Firepad.fromCodeMirror(firepadRef, codeMirror,
    	{ richTextToolbar: true, richTextShortcuts: true, userId: userId});
      
		// Create FirepadUserList (with our desired userId).
    var firepadUserList = FirepadUserList.fromDiv(firepadRef.child('users'),
    	document.getElementById('userlist'), userId);
    
		// Initialize contents.
    firepad.on('ready', function() {
    	if (firepad.isHistoryEmpty()) {
      	firepad.setText('Start collaborating...');
      }
     });	
	}
	
}
		
$(document).on('ready page:load', function() {
	firepad.init();
});