var activeMenu = {
	
	previousTop: "18",
	actualTop: "18",
	
	setHighlighted: function() {
		var topPos = $(this).offset().top - $('.lateral-nav').first().offset().top;
		var hover_bar = $('<div class="active-menu special-active-menu"></div>')
		.css('top', topPos)
		.attr('id', 'special-active-menu-' + $(this).data('space') );
		$('.active-menu').after(hover_bar);
	},
	
	setFixedPosition: function() {
		var left = $('.lateral-nav').first().offset().left + 7;
		$('.active-menu').css('left', left );

		if ($('.lateral-nav').find('.previous').length != 0){
			activeMenu.previousTop = $('.lateral-nav .previous').offset().top - $('.lateral-nav').first().offset().top
		};

		if ($('.lateral-nav').find('.active').length != 0){
			activeMenu.actualTop = $('.lateral-nav .active').offset().top - $('.lateral-nav').first().offset().top;
		}
	},
	
	removeHighlighted: function() {
		$('.special-active-menu').remove();
	},
	
	setMovingLine: function() {
		$('.active-menu').css('top', activeMenu.previousTop);
		$('.active-menu').animate(
			{
				top: activeMenu.actualTop
			},
			1000,
			'easeInOutQuart'
		);
	},
	
	init: function() {
		$('#active-group-nav > .lateral-nav-element')
			.hover(activeMenu.setHighlighted)
			.mouseout(activeMenu.removeHighlighted);
			
		activeMenu.setFixedPosition();
		activeMenu.setMovingLine();
	}

		// init: function() {
// 			$('.lateral-nav-element').hover(
// 				function(){
// 					var topPos = $(this).offset().top - 103;
// 					var hover_bar = $('<div class="active-menu special-active-menu"></div>')
// 					.css('top', topPos)
// 					.attr('id', 'special-active-menu-' + $(this).data('space') );
// 					$('.active-menu').after(hover_bar);
// 				},
// 				function() {
// 					$('.special-active-menu').remove();
// 				}
// 			);
//
//
// 			if ($('#nav-perso').find('.previous').length != 0){
// 				var previousTop = $('#nav-perso .previous').offset().top - 103;
// 			} else{
// 				var previousTop = "18";
// 			};
//
// 			if ($('#nav-perso').find('.active').length != 0){
// 				var actualTop = $('#nav-perso .active').offset().top - 103;
// 			} else{
// 				var actualTop = "18";
// 			};
//
//
// 			$('.active-menu').css('top', previousTop);
// 			$('.active-menu').animate(
// 				{
// 					top: actualTop
// 				},
// 				1000,
// 				'easeInOutQuart'
// 			);
//
// 		}
}

mainLayout = function() {
	activeMenu.init();

	$("#signup-button-navbar").on('click', function() { 
		console.log('oppp');
		popup.show("#slide-signup");
	});
};


$(document).on('ready page:load', function() {
	mainLayout();
});

