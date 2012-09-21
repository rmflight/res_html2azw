

com.nature.Popups = {
	_children: {},
	_open: [],
	
	add: function(popup) {
		if (!(popup.id in this._children)) {
 			this._children[popup.id] = popup;
		}
	},
	remove: function(popup) {
		if (popup.id in this._children) {
			delete this._children[popup.id];
		}
	},
	redraw: function(ev, trigger) {
		var n = this._open.length;
		while (n--) {
			var child = this._children[this._open[n]];
			if (ev == 'close' && child.parent == trigger) {
				child.close();
			} else {
				child.pos();
			}
		}
	},
	onOpen: function(ev, popup) {
		this._open.push(popup.id);
	},
	onClose: function(ev, popup) {
		var n = this._open.length;
		while (n--) {
			if (popup.id == this._open[n]) {
				this._open.splice(n, 1);
				break;
			}
		}
	},
	onResize: function() {
		this.redraw('resize');
	}
};
com.nature.Popups.collapsableParents = ['div.section', 'div.figure-preview'];
$(window).resize(function() {
	com.nature.Popups.onResize();
});

// manages a group of popups
// if single is true only one popup in the group may be expanded at any time
com.nature.PopupGroup = function(single) {
	var children = {};
	var open = [];
	
	// register com.nature.Popup objects in the group
	this.add = function(popup) {
		if (!(popup.id in children)) {
			children[popup.id] = popup;
		}
	};
	// remove them again
	this.remove = function(popup) {
		if (popup.id in children) {
			delete children[popup.id];
		}
	};
	
	this.get = function(popup) {
		var id = (typeof popup == 'string') ? popup : popup.id;
		if (id in children) {
			return children[id];
		}
		return null;
	};
	
	// each popup can broadcast an open event, 
	// this event handler responds to that event to update the group state
	this.onOpen = function(ev, popup) {
		// check if there's already a popup open that needs to be closed
		//alert(popup.uniqueId + ' ' + open.join('\n'));
		if (single && open.length) {
			children[open.pop()].close();
		}
		open.push(popup.id);
	};
	// update state when a popup broadcasts a close event
	this.onClose = function(ev, popup) {
		var n = open.length;
		while (n--) {
			if (popup.id == open[n]) {
				open.splice(n, 1);
				break;
			}
		}
	};
	this.toString = function() {
		return '[object com.nature.PopupGroup]';
	};
};

com.nature.Popup = (function($) {	
	var popupCounter = 0;
	var Popup = function($base, $content, options) {
		var defaults = {
			hasArrow: true,
			hasTitle: true,
			hasCloseButton: true,
			position: 'above',
			title: $base.html(),
			event: 'click',
			hasMask: false
		};
		// merge in any options
		options = $.extend(defaults, options);
		for (var prop in options) {
			this['_' + prop] = options[prop];
		}
		
		if (this._id) {
			this.id = this._id;
		} else {
			this.id = 'popup-' + $content.attr('id') + '-' + ++popupCounter;
		}
		this.isOpen = false;
		this.parent = null;
				
		this._$base = $base;
		this._$content = $content;
		this._$popup = null;
	};
	Popup.cache = {};
	Popup.prototype = {
		init: function(dontAddEvents) {
			var $trigger = this._$base;
			var captureEnterKey = false;
			
			if ($trigger.is('a')) {
				if (!$trigger.attr('href')) {
					$trigger.attr('href', 'javascript:;');
				}
			} else {
				if (!$trigger.attr('tabindex')) {
					$trigger.attr('tabindex', '0');
				}
				captureEnterKey = true;
			}
			
			if (!dontAddEvents) {
				var self = this;
				if (this._event === 'mouseover' || this._event === 'mouseenter') {
					var hovered = false;
					var timeout = null;
				
					$trigger.hitch('mouseenter', function(e) {
						hovered = true;
						if (timeout !== null) {
							clearTimeout(timeout);
						}
						this.open(e);
					}, this).hitch('mouseleave', function(e) {
						hovered = false;
						timeout = setTimeout(function() {
							if (!hovered) {
								self.close(e);
							}
						}, 200);
					}, this);
				} else if (this._event === 'click' && captureEnterKey) {
					$trigger.hitch(this._event, this.toggle, this);
					$trigger.bind('keydown', function(e) {
						if (e.keyCode == 27) {
							self.toggle(e);
						}
					});
				} else {					
					$trigger.hitch(this._event, this.toggle, this);
				}
			}
		},
		build: function() {
			if (typeof com.nature.Popup.cache[this.id] != 'undefined') {
				this._$popup = $('#' + this.id);
				return;
			}
			com.nature.Popup.cache[this.id] = true;
			
			this.parent = this._$base.closest(com.nature.Popups.collapsableParents.join(',')).attr('id');
			com.nature.Popups.add(this);

			var cls = 'box popup ' + this._$content.attr('class');
			var html = '<div id="' + this.id + '" class="' + cls + '">';
			
			// add in the top wrapper div if needed
			if (this._hasTitle || this._hasCloseButton) {
				html += '<div class="title-bar cleared">';
				if (this._hasTitle) {
					// if we want a title, but nothing is specified fall back to the html content of the link
					html += '<h2>' + this._title + '</h2>';
				}
				if (this._hasCloseButton) {
					html += '<button class="close">close</button>';
				}
				html += '</div>';
			}
			
			// add the arrow if needed
			if (this._hasArrow) {
				html += '<div class="arrow arrow-' + ({above: 'bottom', below: 'top'}[this._position] || 'bottom') + '"></div>';
			}	

			// add in the actual content
			html += '<div class="popup-content">';
			html += this._$content.html();
			html += '</div>';
			html += '</div>';

			// [AIP-238] if we have to grey out the background for a modal
			if(this._hasMask) { 
			html += '<div class="mask"></div>';
			$('.mask').hitch('click', this.close, this);

			};

			$('body').append(html);
			this._$popup = $('#' + this.id);
			
			if (!com.nature.Css.isImplemented('boxShadow')) {
				this._$popup.addClass('popup-highlight');
			}
			this._$popup.find('button').hitch('click', this.toggle, this);
			if(this._hasMask) { 
				$('.mask').hitch('click', this.close, this);
			};
			if (typeof this.notify != 'undefined') {
				this.notify('build');
			}
		},
		toggle: function(e) {
			if (this.isOpen) {
				return this.close(e);
			}
			return this.open(e);
		},
		open: function(e) {			
			this.build();
			this.isOpen = true;

		
			this._$popup.addClass('popup-shown').css({display: 'block'});

			
			this.pos(e);
			
			//Fix for IE6 rendering bug which displays select boxes always on-top
			if ($('body').hasClass('ie6')) {
				var collidedElements = this._$popup.collidesWith('select');
				if (collidedElements.length > 0) {
					$.each(collidedElements, function() {
						$(this).css({'visibility': 'hidden'});
					});
				}
			}
			
			com.nature.Popups.onOpen('open', this);
			
			if (typeof this.notify != 'undefined') {
				this.notify('open');
			}
			if (this._hasCloseButton) {
				this._$popup.find('button.close').focus();
			}
			return false;
		},
		close: function() {
			var self = this;
			
			this._$popup.fadeOut('fast', function() {
				$(this).removeClass('popup-shown');
				self.isOpen = false;
			});
			if(this._hasMask) { 
				$('.mask').css('display', 'none')
			}

			com.nature.Popups.onClose('close', this);
			
			//Redisplay any hidden <select> elements for IE6
			if ($('body').hasClass('ie6')) {
				$('select').css({'visibility': 'visible'});
			}
			
			if (typeof this.notify != 'undefined') {
				this.notify('close');
			}
			return false;
		},
		pos: function(e) {
			var offset = this._$base.offset();
			var baseWidth = this._$base.outerWidth();

			
			// calculate how far left to position the arrow (it should be aligned to the centre of the base element)			
			var arrowX = Math.min(Math.max(0, (baseWidth / 2) - 25), this._$popup.outerWidth() - 50);
			
			var wrapped = false, diff = 0, overrun = 0;
			// check to see if the element wraps onto more than one line, if so we'll use mouse position
			if (e && this._$base.css('display') === 'inline' && this._$base.height() > parseInt(this._$base.css('lineHeight'), 10)) {
				offset.top = e.pageY - 5;
				offset.left = e.pageX - 25;
				arrowX = 0;
				wrapped = true;
			}
			
			if (this._hasArrow && (diff = baseWidth - this._$popup.find('div.arrow').outerWidth() / 1.5) < 0) {
				offset.left += diff;
			}
			
			overrun = offset.left + this._$popup.outerWidth() - $(window).width() + 20;
			if (overrun > 0) {
				offset.left -= overrun;
				arrowX += overrun;
			}
			
			var abovePopupY = offset.top - (this._$popup.height() + ((this._hasArrow) ? 32 : 0));
			var belowPopupY = offset.top + ((!wrapped) ? this._$base.outerHeight() : 2);
			if (this._hasArrow) {
				belowPopupY += 14;
			}
			var popupY = (this._position == 'above') ? abovePopupY : belowPopupY;

			// try to keep vertically within the viewport
			if (this._position == 'above' && popupY < $(document).scrollTop()) {
				this._$popup.find('div.arrow-bottom').removeClass('arrow-bottom').addClass('arrow-top');
				popupY = belowPopupY;
			} else if (this._position == 'above') {
				this._$popup.find('div.arrow-top').removeClass('arrow-top').addClass('arrow-bottom');
			}
			
			if (this._position == 'below' && (popupY + this._$popup.height()) > ($(document).scrollTop() + $(window).height())) {
				this._$popup.find('div.arrow-top').removeClass('arrow-top').addClass('arrow-bottom');
				popupY = abovePopupY;
			} else if (this._position == 'below') {
				this._$popup.find('div.arrow-bottom').removeClass('arrow-bottom').addClass('arrow-top');
			}

			if(this._hasMask) { 
        		var maskHeight = $(document).height();
        		var maskWidth = $(window).width();
        		$('.mask').css({'width':maskWidth,'height':maskHeight, 'display': 'block'});
     		}

			if(this._position == 'modal' ) {
        		var dialogTop  = ($(window).height() - this._$popup.height())/2 + $(window).scrollTop();  
    			var dialogLeft = ($(window).width() - this._$popup.width())/2;
				this._$popup.css({
					top: dialogTop,
					left: dialogLeft
				});
				
			} else {

				this._$popup.css({
					top: popupY + 'px',
					left: offset.left + 'px'
				});
			}
			

			this._$popup.find('div.arrow').css({
				left: arrowX + 'px'
			});
		},
		/* a bunch of accessor methods */
		title: function(title) {
			if (typeof title != 'undefined') {
				this._title = title;
			}
			return this._title;
		},
		position: function(position) {
			if (typeof position != 'undefined') {
				this._position = position;
			}
			return this._position;
		},
		hasArrow: function(has) {
			if (typeof has != 'undefined') {
				this._hasArrow = !!has;
			}
			return this._hasArrow;
		},
		hasTitle: function(has) {
			if (typeof has != 'undefined') {
				this._hasTitle = !!has;
			}
			return this._hasTitle;
		},
		hasCloseButton: function(has) {
			if (typeof has != 'undefined') {
				this._hasCloseButton = !!has;
			}
			return this._hasCloseButton;
		},
		hasMask: function(has) {
			if (typeof has != 'undefined') {
				this._hasMask = !!has;
			}
			return this._hasMask;
		},

		toString: function() {
			return '[object com.nature.Popup]';
		}
	};
	return Popup;
})(jQuery);

