var SignInClick ={
	init: function(){
		$('.sign-in-toggle').click(function(){
			if ($(this).hasClass('active')){
				$('.sign-in-selected').slideUp(400);
				$(this).removeClass('active');
			}
			else{
				$(this).addClass('active');
				$('.sign-in-selected').slideDown(400);
				$('.email').focus();
			}
		});
	}
}

var wrongSignIn ={
	toggleNotif: function(){
		$('.sign-in-button').click(function(){
				$(this).addClass('active');
				$('.sign-in-notification').slideDown(400);
				$('.psswd').val('').focus();
		});
	},
	removeNotif: function(){
		$('.sign-in-input').keypress(function(){
			if ($('.sign-in-button').hasClass('active')){
				$(this).removeClass('active');
				$('.sign-in-notification').slideUp(400);
			}
		});
	},
	init: function(){
		wrongSignIn.toggleNotif();
		wrongSignIn.removeNotif();
	}
}



// --------------------------
// Contact page text hovering -------------------------------
// --------------------------

var contactHover ={
	init: function() {
		$('.icon-hover, .regular-link').click(function(e){
			e.stopPropagation();
		});

		$('.icon-hover').hover(
			function(e) {
				$(this).css('overflow', 'visible');
				$(this).find('.hover-text')
					.show()
					.css('opacity', 0)
					.delay(200)
					.animate(
						{
							paddingTop: '25px',
							opacity: 1
						},
						'fast',
						'linear'
					);
			},
			function(e) {
				var obj = $(this);
				$(this).find('.hover-text')
					.animate(
						{
							paddingTop: '0',
							opacity: 0
						},
						'fast',
						'linear',
						function() {
							$(this).hide();
							$( obj ).css('overflow', 'hidden');
						}
					);
			}
		);
	}
}

// --------------
// Smooth sliding -----------------------------------------------------------------
// --------------

var smoothSliding = {
	init: function() {

		//Cache some variables
		var links = $('.item-nav');
		slide = $('.slide');
		button = $('.button');
		mywindow = $(window);
		htmlbody = $('html,body');

		//Create a function that will be passed a slide number and then will scroll to that slide using jquerys animate. The Jquery
		//easing plugin is also used, so we passed in the easing method of 'easeInOutQuint' which is available throught the plugin.
		function goToByScroll(dataslide) {
			var offset_top = ( dataslide == 1 ) ? '0px' : $('.slide[data-slide="' + dataslide + '"]').offset().top;

			htmlbody.stop(false, false).animate({
				scrollTop: offset_top
			}, 1500, 'easeInOutQuart');
		}

		//When the user clicks on the navigation links, get the data-slide attribute value of the link and pass that variable to the goToByScroll function
		links.click(function (e) {
			e.preventDefault();
			dataslide = $(this).attr('data-slide');
			goToByScroll(dataslide);
		});
	}
}




// ------------
// ARROWS CLICK -----------------------------------------------------
// ------------

var arrowsClick = {
	init: function() {
		var arrows = $('#arrows div');

		arrows.click(function(e) {
			e.preventDefault();

			if ( $(this).hasClass('disabled') )
				return;

			var slide = null;
			var datasheet = $('.nav-middle > .active').data('slide');
			var offset_top = false;
			var offset_left = false;


			switch( $(this).attr('id') ) {
				case 'arrow-up':
					offset_top = ( datasheet - 1 == 1 ) ? '0px' : $('.slide[data-slide="' + (datasheet-1) + '"]').offset().top;
					break;
				case 'arrow-down':
					offset_top = $('.slide[data-slide="' + (datasheet+1) + '"]').offset().top;
					break;
			}

			if ( offset_top != false ) {
				htmlbody.stop(false, false).animate({
					scrollTop: offset_top
				}, 1500, 'easeInOutQuart');
			}

		});
	}
}


// ------------
// NAVBAR HOVER ---------------------------------------------
// ------------

var navbarHover = {
	init: function() {
		$('.item-nav').hover(
			function(e) {
				var icon = $(this).find('.fa');

				var left_pos = icon.offset().left - $('.nav-middle').offset().left;
				var el_width = icon.width() + $(this).find('.text-nav').width() + 5;

				var hover_bar = $('<div class="active-menu special-active-menu"></div>')
					.css('left', left_pos)
					.css('width', el_width)
					.attr('id', 'special-active-menu-' + $(this).data('slide') );

				$('.active-menu').after( hover_bar );
			},
			function(e) {
				$('.special-active-menu').remove();
			}
		);
	}
}

// -------------
// NAVBAR SCROLL----------------------------------------
// -------------

var navbarScroll = {

	enableArrows: function( dataslide ) {
		$('#arrows div').addClass('disabled');
		if ( dataslide != 1 ) {
			$('#arrow-up').removeClass('disabled');
		}
		if ( dataslide != 3 ) {
			$('#arrow-down').removeClass('disabled');
		}
	},

	menuFocus: function(element, i) {
		if ( $(element).hasClass('active') ) {
			if ( i == 3 ) {
				if ( $('.navbar').hasClass('inv') == false )
					return;
			} else {
				return;
			}
		}

		navbarScroll.enableArrows( i );

		if ( i == 1 || i == 3 )
			$('.navbar').removeClass('inv');
		else
			$('.navbar').addClass('inv');

		$('.item-nav').removeClass('active');
		$(element).addClass('active');

		var icon = $(element).find('.fa');

		var left_pos = icon.offset().left - $('.nav-middle').offset().left;
		var el_width = icon.width() + $(element).find('.text-nav').width() + 5;

		$('.active-menu').stop(false, false).animate(
			{
				left: left_pos,
				width: el_width
			},
			1500,
			'easeInOutQuart'
		);
	},

	init: function() {
		var pause = 10;
    $(document).scroll(function(e) {
      delay(function() {

        var tops = [];

        $('.story').each(function(index, element) {
          tops.push( $(element).offset().top - 200 );
        });

        var scroll_top = $(this).scrollTop();

        var lis = $('.item-nav');
        
        // console.log(tops);
        // console.log(lis);

        for ( var i=tops.length-1; i>=0; i-- ) {
          if ( scroll_top >= tops[i] ) {
            navbarScroll.menuFocus( lis[i], i+1 );
            break;
          }
        }
      },
      pause);
    });
    $(document).scroll();
	}
}





// -------------------
// Fonction definition
// -------------------

var delay = (function(){
	var timer = 0;
	return function(callback, ms){
		clearTimeout (timer);
		timer = setTimeout(callback, ms);
	};
})();






mainLayout = function() {
	navbarHover.init();
	navbarScroll.init();
	arrowsClick.init();
	smoothSliding.init();
	contactHover.init();
	SignInClick.init();
	// wrongSignIn.init();
};

$(document).on('ready page:load', function() {
	mainLayout();

// function UIProgressButton( el, options ) {
// 	this.el = el;
// 	this.options = extend( {}, this.options );
// 	extend( this.options, options );
// 	this._init();
// }

// UIProgressButton.prototype._init = function() {
// 	this.button = this.el.querySelector( 'button' );
// 	this.progressEl = new SVGEl( this.el.querySelector( 'svg.progress-circle' ) );
// 	this.successEl = new SVGEl( this.el.querySelector( 'svg.checkmark' ) );
// 	this.errorEl = new SVGEl( this.el.querySelector( 'svg.cross' ) );
// 	// init events
// 	this._initEvents();
// 	// enable button
// 	this._enable();
// }

// function SVGEl( el ) {
// 	this.el = el;
// 	// the path elements
// 	this.paths = [].slice.call( this.el.querySelectorAll( 'path' ) );
// 	// we will save both paths and its lengths in arrays
// 	this.pathsArr = new Array();
// 	this.lengthsArr = new Array();
// 	this._init();
// }

// SVGEl.prototype._init = function() {
// 	var self = this;
// 	this.paths.forEach( function( path, i ) {
// 		self.pathsArr[i] = path;
// 		path.style.strokeDasharray = self.lengthsArr[i] = path.getTotalLength();
// 	} );
// 	// undraw stroke
// 	this.draw(0);
// }

// // val in [0,1] : 0 - no stroke is visible, 1 - stroke is visible
// SVGEl.prototype.draw = function( val ) {
// 	for( var i = 0, len = this.pathsArr.length; i < len; ++i ){
// 		this.pathsArr[ i ].style.strokeDashoffset = this.lengthsArr[ i ] * ( 1 - val );
// 	}
// }

// UIProgressButton.prototype._initEvents = function() {
// 	var self = this;
// 	this.button.addEventListener( 'click', function() { self._submit(); } );
// }

// UIProgressButton.prototype._submit = function() {
// 	classie.addClass( this.el, 'loading' );
	
// 	var self = this,
// 		onEndBtnTransitionFn = function( ev ) {
// 			if( support.transitions ) {
// 				this.removeEventListener( transEndEventName, onEndBtnTransitionFn );
// 			}
			
// 			this.setAttribute( 'disabled', '' );

// 			if( typeof self.options.callback === 'function' ) {
// 				self.options.callback( self );
// 			}
// 			else {
// 				self.setProgress(1);
// 				self.stop();
// 			}
// 		};

// 	if( support.transitions ) {
// 		this.button.addEventListener( transEndEventName, onEndBtnTransitionFn );
// 	}
// 	else {
// 		onEndBtnTransitionFn();
// 	}
// }

// UIProgressButton.prototype.stop = function( status ) {
// 	var self = this,
// 		endLoading = function() {
// 			self.progressEl.draw(0);
			
// 			if( typeof status === 'number' ) {
// 				var statusClass = status >= 0 ? 'success' : 'error',
// 					statusEl = status >=0 ? self.successEl : self.errorEl;

// 				statusEl.draw( 1 );
// 				// add respective class to the element
// 				classie.addClass( self.el, statusClass );
// 				// after options.statusTime remove status and undraw the respective stroke and enable the button
// 				setTimeout( function() {
// 					classie.remove( self.el, statusClass );
// 					statusEl.draw(0);
// 					self._enable();
// 				}, self.options.statusTime );
// 			}
// 			else {
// 				self._enable();
// 			}

// 			classie.removeClass( self.el, 'loading' );
// 		};

// 	// give it a little time (ideally the same like the transition time) so that the last progress increment animation is still visible.
// 	setTimeout( endLoading, 300 );
// }

});

