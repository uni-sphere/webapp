var firepad = {
	
	init: function() {
		var firepadRef = new Firebase('https://unisphere/firepads/id');
		var codeMirror = CodeMirror(document.getElementById('firepad'), { lineWrapping: true });
		var firepad = Firepad.fromCodeMirror(firepadRef, codeMirror,
			{ richTextShortcuts: true, richTextToolbar: true, defaultText: 'Start collaborating...' });
	}
	
}
		
$(document).on('ready page:load', function() {
	firepad.init();
});