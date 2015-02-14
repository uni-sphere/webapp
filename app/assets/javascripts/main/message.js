var message = {
	display: function(owner, time, content) {
		$('.new-message').append(
			'<div class="message"> \
			<object type="image/svg+xml" class="message-pic"></object> \
			<div class="message-info"> \
			<span class="message-sender">'+ owner +'</span> \
			<span class="message-time">'+ jQuery.timeago(time) +'</span> \
			</div> \
			<div class="message-content">'+ content +'</div> \
			</div>');
	}
};

var faye = {
	
	currentChannel: $('.channel-element').first().attr('channel'),
	subscription: null,
	client: null,
	
	selectChannel: function() {
		$('.channel-element').on('click', function() {
			faye.currentChannel = $(this).attr('channel');
			$('.chat-display').attr('chat_id', $(this).attr('chat'));
			// console.log(faye.currentChannel);
			// console.log('AJAX');
			$.ajax({
				url: '/user/group/chats',
				dataType:"JSON",
				type:"GET",
				data: {
					channel: faye.currentChannel,
					group_id: $('#active-group-nav').attr('group_id'),
				},
				complete: function(data, messages, vari) {
					faye.subscription.cancel();
					faye.subscribe();
					
					messages = JSON.parse(data.responseText)['messages'];
					
					$('.messages').html('');
					
					for( var i = 1 ; i<=data.responseText.length ; i++ ) {
						if (typeof messages[i.toString()] != 'undefined') {
							$('.messages').append('\
								<div class="message"> \
 								<object type="image/svg+xml" class="message-pic"></object> \
 								<div class="message-info"> \
 								<span class="message-sender">'+ messages[i.toString()]['owner'] +'</span> \
 								<span class="message-time">'+ messages[i.toString()]['time'] +'</span> \
 								</div> \
 								<div class="message-content">'+ messages[i.toString()]['content'] +'</div> \
 								</div> \
								')
						}
					}
				}
			});
		})
	},
	
	subscribe: function() {
		faye.subscription = faye.client.subscribe('/' + faye.currentChannel, function(data) {
			message.display(data.owner, data.time, data.content);
		});
	},
	
	publish: function() {
		faye.client.publish('/' + faye.currentChannel, {
			owner: $('.user-name').attr('current_user_name'),
			time: Date.now(),
			content: $('.chat-input-text').val()
			},
			{attempts: 1});
	},
	
	ajax: function() {
		console.log('AJAX');
		console.log($('.chat-display').attr('chat_id'));
		$.ajax({
			url: '/user/group/chat/message/create',
			dataType:"json",
			type:"POST",
			data: {
				groupchat_id: $('.chat-display').attr('chat_id'),
				group_id: $('#active-group-nav').attr('group_id'),
				content: $('.chat-input-text').val(),
				owner_id: $('.user-name').attr('current_user_id')
			}
		});
	},
	
	listenSubmit: function() {
		$('.chat-input-text').on('keyup', function(event) {
			if (event.keyCode == $.ui.keyCode.ENTER && !event.shiftKey) {
				// send to faye server
				faye.publish();
				// send to message controller
				faye.ajax();
				
				$('.chat-input-text').val('');
			}
		});
	},
	
	online: function() {
		faye.client.on('transport:up', function() {
		  // the client is online
			console.log('ONLINE');
			faye.listenSubmit();
		});
	},
	
	offline: function() {
		faye.client.on('transport:down', function() {
		  // the client is offline
			console.log('OFFLINE');
			$('.chat-input').css('opacity','0.7')
			$('.chat-input-text').off('keyup');
		});
	},
	
	init: function(client) {
		client = new Faye.Client('http://localhost:9292/faye', {timeout: 120, retry: 5});
		faye.client = client;
		faye.subscribe();
		faye.online();
		faye.offline();
		faye.selectChannel();
	}
}

var channel = {
	
	ajax: function() {
		console.log('AJAX');
		$.ajax({
			url: '/user/group/chat/chat/create',
			dataType:"json",
			type:"POST",
			data: {
				group_id: $('#active-group-nav').attr('group_id'),
				name: $('.channel_creation').val()
			}
		});
	},
	
	init: function() {
		$('.channel_creation').on('keyup', function(event) {
			if (event.keyCode == $.ui.keyCode.ENTER) {
				console.log('CREATE');
				channel.ajax();
				$('.channel_creation').val('');
			}
		});
	}
}

$(document).on('ready page:load', function() {
	faye.init();
	channel.init();
});

$(document).on('page:before-unload', function() {
	if (subscription != null) {subscription.cancel()};
});
