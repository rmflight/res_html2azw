var com = com || {};
com.nature = com.nature || {};

com.nature.slideshow = (function($) {
	var Inline = null,
		Lightbox = null,
		lightbox = null,
		idToIndex = null;
	
	// helpers
	idToIndex = function(id) {
		return parseInt(id.split('-').pop(), 10);
	};

	// classes
	Inline = function($slideshow) {
		var $slides = $slideshow.find('ol.slides'),
			$frames = $slides.find('a.frame'),
			$items = $slides.children('li'),
			$pagination = null,
			numItems = $items.length,
			currentId = $items.filter('li:first').attr('id'),
			redraw = null,
			buildFrames = null,
			buildNavigation = null,
			slicePaginationLinks = null,
			pagination = null,
			expand = null;
			
		redraw = function() {
			var height = 0;
			$items.each(function() {
				var $item = $(this);
				height = Math.max(height, $item.outerHeight());
				if (!$item.hasClass('current')) {
					$item.css({
						visibility: 'visible',
						display: 'none'
					});
				} else {
					$item.css({
						visibility: 'visible',
						display: 'block'
					});
				}
			});

			$slides.css({
				height: height
			});
		};
		buildFrames = function() {
			var $imgs = $slides.find('img.slide'),
				width = 0,
				height = 0;

			$imgs.each(function() {
				var $img = $(this);
				width = Math.max(width, $img.width());
				height = Math.max(height, $img.height());
			});
			
			$frames.css({
				width: width,
				height: height
			});
			
			$imgs.each(function() {
				var $img = $(this);
				$img.css({
					marginTop: (height - $img.height()) / 2
				});
			});
		};
		buildNavigation = function() {
			var $nav = null,
				nav = '';
				
			nav = '<div class="nav"><nav><ol class="pagination"><li class="prev inactive"><a href="javascript:;">Previous</a></li>';
			$items.each(function(i) {
				var $item = $(this);
				nav += '<li' + ((i === 0) ? ' class="current"' : '') + '><a href="#' + $item.attr('id') + '" title="' + $item.find('img.slide').attr('alt') + '">' + (i + 1) + '</a></li>';
			});
			nav += '<li class="next"><a href="javascript:;">Next</a></li></ol>';
			nav += '<div class="controls"><span class="position">1/' + numItems + '</span> <a href="javascript:;" class="lightbox">Fullscreen</a></div></nav></div>';
			
			$nav = $(nav);
			
			$pagination = $nav.find('ol.pagination');
			slicePaginationLinks(1);
			
			$nav.hide();
			$slideshow.append($nav);
			$nav.fadeIn('fast');
		};
		slicePaginationLinks = function($item) {
			var $pages = null,
				index = 0,
				min = 0,
				max = 0;
				
			if (numItems > 5) {
				$pages = $pagination.children('li');
				
				index = typeof $item == 'number' ? $item : $item.index();
				min = Math.max(1, index - 2);
				max = Math.min(numItems + 1, index + 3);
					
				if (max - min < 5) {
					if (index < 3) {
						max += 3 - index;
					} else {
						min -= 2 - (numItems - index);
					}
				}					
				
				$pages.slice(1, numItems + 1).css({display: 'none'});
				$pages.slice(min, max).css({display: 'inline'});
			}
		};
		pagination = function(e) {
			var $target = $(e.target),
				$parent = $target.closest('li');
				
			if (!$target.is('a')) {
				return true;
			}
			if ($parent.hasClass('inactive') || $parent.hasClass('current')) {
				return false;
			}
			if ($parent.hasClass('next') || $parent.hasClass('prev')) {
				if ($parent.hasClass('next')) {
					this.next();
				} else {
					this.prev();
				}
			} else {
				this.show(idToIndex($target.attr('href')), $target);
			}
			return false;
		};
		expand = function(e) {
			if (!lightbox) {
				lightbox = new com.nature.slideshow.Lightbox($slideshow, new com.nature.Lightbox());
			}
			lightbox.open(idToIndex(currentId));
			return false;
		};
		
		this.init = function() {
			$slideshow.css('visibility', 'visible');
			
			buildFrames();
			redraw();
			buildNavigation();
			
			$pagination.hitch('click', pagination, this);
			$slideshow.find('a.lightbox, a.frame').hitch('click', expand, this);
		};
		this.next = function() {
			return this.move(1);
		};
		this.prev = function() {
			return this.move(-1);
		};
		this.move = function(step) {
			return this.show(idToIndex(currentId) + step);
		};
		this.show = function(index, $target) {
			var id = null,
				$parent = null,
				$current = null
				$next = null;
			
			if (index < 1) {
				index = 1;
			} else if (index > numItems) {
				index = numItems;
			}
			
			id = currentId.replace(/-[0-9]+$/, '-' + index);
			
			if (id === currentId) {
				return false;
			}
			
			$current = $slideshow.find('#' + currentId);
			$next = $slideshow.find('#' + id)
			
			$current.find('img.slide').fadeOut(200, function() {
				$current.hide().removeClass('current');
				currentId = id;
				$next.addClass('current').show();
				$next.find('img.slide').hide().fadeIn(200);
			});
			
			$slideshow.find('span.position').html(index + '/' + numItems);
			$pagination.find('li.current').removeClass('current');
			
			if (!$target) {
				$target = $pagination.find('a[href*="#' + id + '"]');
			}
			$parent = $target.closest('li');
			
			slicePaginationLinks($parent);
			$parent.addClass('current');
			if (index === 1) {
				$pagination.find('li.prev').addClass('inactive');
			} else {
				$pagination.find('li.prev.inactive').removeClass('inactive');
			}
			if (index === numItems) {
				$pagination.find('li.next').addClass('inactive');
			} else {
				$pagination.find('li.next.inactive').removeClass('inactive');
			}
			return false;
		};
		
		$(window).hitch('load', function() {
			this.init();
		}, this);
		
	};
	
	Lightbox = function($src, lightbox) {
		var $slideshow = null,
			$slides = null,
			$items = null,
			$pagination = null,
			$paginationWindow = null,
			$nav = null,
			$sliders = null,
			redraw = null,
			numItems = 0,
			paginationItemsToDisplay = 7,
			paginationThumbWidth = 54,
			paginationThumbSpacing = 3,
			currentId = '',
			initialized = false;
			
		redraw = function(showCurrent) {
			var maxWidth = 0,
				width = 0,
				height = 0,
				imgHeight = 0,
				paginationWindowWidth = 0,
				slidesLeftPos = 0,
				slideBtnWidth = 0;
				
			$slideshow.show();
			
			slideBtnWidth = $nav.filter('a.prev').outerWidth();
			maxWidth = $slideshow.outerWidth() - (slideBtnWidth * 2);
			
			$items.each(function() {
				var $item = $(this),
					itemWidth = $item.outerWidth();
					
				$item.css({
					visibility: 'hidden',
					display: 'block'
				});
				
				if (itemWidth > maxWidth) {
					$item.css({width: maxWidth});
					width = maxWidth;
				} else {
					width = Math.max(width, $item.outerWidth());
				}
				
				height = Math.max(height, $item.outerHeight());
				imgHeight = Math.max(imgHeight, $item.find('img.slide').height());
				if (showCurrent && $item.hasClass('current')) {
					$item.css({
						visibility: 'visible',
						display: 'block'
					});
				} else {
					$item.css({
						visibility: 'visible',
						display: 'none'
					});
				}
			});

			$slides.css({
				width: width,
				height: height
			});
			$items.each(function() {
				var $item = $(this),
					itemLeft = (width - $item.width()) / 2,
					itemTop = (height - $item.height()) / 2;
				$item.css({
					left: itemLeft,
					top: itemTop
				});
				$item.data('itemTop', itemTop);
			});
			
			slidesLeftPos = ($slideshow.width() - width) / 2;

			$nav.filter('a.prev').css({
				height: imgHeight,
				left: slidesLeftPos - slideBtnWidth,
				top: $slides.position().top
			});
			$nav.filter('a.next').css({
				height: imgHeight,
				left: slidesLeftPos + width,
				top: $slides.position().top
			});
			
			paginationWindowWidth = ((paginationThumbWidth + paginationThumbSpacing) * Math.min(paginationItemsToDisplay, numItems)) - paginationThumbSpacing;
			
			$paginationWindow.css({
				position: 'absolute',
				left: ($slideshow.find('div.nav').width() - paginationWindowWidth) / 2,
				visibility: 'visible',
				width: paginationWindowWidth,
				overflow: 'hidden'
			});
						
			$pagination.css({
				visibility: 'visible',
				width: (numItems * (paginationThumbWidth + paginationThumbSpacing)) 
			});
			$sliders.css({
				visibility: 'visible',
				top: $paginationWindow.position().top
			});

			$sliders.filter('a.left').css({
				left: $paginationWindow.position().left - 25
			});
			$sliders.filter('a.right').css({
				left: $paginationWindow.position().left + $paginationWindow.outerWidth()
			});
			lightbox.redraw();
		};
		
		this.init = function() {
			var $srcSlides = null,
				slideshow = '',
				slides = '',
				pagination = '';
			
			if (initialized) {
				return;
			}
			
			$srcSlides = $src.find('ol.slides').children('li');
			numItems = $srcSlides.length;
			
			$srcSlides.each(function(i) {
				var $item = $(this),
					$img = $item.find('img.slide'),
					$title = $item.find('h2'),
					$caption = $item.find('p.caption'),
					$credit = $item.find('p.credit'),
					id = $item.attr('id').replace(/^s-/, 'l-');
				
				slides += '<li id="' + id + '" style="width:' + $img.attr('data-full-width') +'px"' + (i === 0 ? ' class="current"' : '') + '>';
				slides += '<img src="' + $img.attr('src').replace(/thumb-img-/, 'full-img-') + '" alt="' + $img.attr('alt') + '" class="slide" width="' + $img.attr('data-full-width') + '" height="' + $img.attr('data-full-height') + '"/>';
				if ($credit.length) {
					slides += '<p class="credit">' + $credit.html() + '</p>';
				}
				if ($title.length) {
					slides += '<h2>' + $title.html() + '</h2>';
				}
				if ($caption.length) {
					slides += '<p class="caption">' + $caption.html() + '</p>';
				}
				slides += '<p class="position">' + (i + 1) + '/' + numItems + '</p>';
				slides += '</li>';
				
				pagination += '<li><a href="#' + id + '"><img src="' + $img.attr('src') + '" alt="Slide ' + (i + 1) + '"/></a></li>';
			});
			
			slides = '<a href="javascript:;" class="nav prev">Previous</a><ol class="slides">' + slides + '</ol><a href="javascript:;" class="nav next">Next</a>';
			pagination = '<div class="pagination-window"><ol class="pagination cleared">' + pagination + '</ol></div>';
			
			if (numItems > paginationItemsToDisplay) {
				pagination = '<a href="javascript:;" class="slider left"><span>Left</span></a>' + pagination + '<a href="javascript:;" class="slider right"><span>Right</span></a>';
			}
			
			pagination = '<div class="nav"><div>' + pagination + '</div></div>';
			
			slideshow = '<div class="carosello">' + slides + pagination + '</div>';
			$slideshow = $(slideshow);
			$slides = $slideshow.find('ol.slides');
			$items = $slides.children('li');
			$paginationWindow = $slideshow.find('div.pagination-window');
			$pagination = $paginationWindow.find('ol.pagination');
			$nav = $slideshow.find('a.prev, a.next');
			$sliders = $slideshow.find('a.left, a.right');
								
			lightbox.title($src.find('h1')).content($slideshow);
			
			$pagination.hitch('click', function(e) {
				var $target = $(e.target),
					index = 0;
				if ($target.parent().is('a')) {
					$target = $target.parent();
				}

				if ($target.is('a')) {
					index = idToIndex($target.attr('href'));
					this.show(index);
				}
				return false;
			}, this);
			
			$nav.hitch('click', function(e) {
				var $target = $(e.target);
				
				if ($target.hasClass('next')) {
					this.next();
				} else {
					this.prev();
				}
				return false;
			}, this);
			
			$sliders.hitch('click', function(e) {
				var $target = $(e.target),
					pos = $pagination.position().left,
					nextIndex = 0;

				if ($target.parent().is('a')) {
					$target = $target.parent();
				}
				if ($target.hasClass('right')) {
					nextIndex = paginationItemsToDisplay + (pos / (paginationThumbWidth + paginationThumbSpacing) * -1) + 1;
					if (nextIndex < numItems) {
						++nextIndex;
					}
					if (nextIndex <= numItems) {
						this.scrollTo(nextIndex, pos);
					}
				} else {
					nextIndex = (pos / (paginationThumbWidth + paginationThumbSpacing) * -1);
					if (nextIndex > 1) {
						--nextIndex;
					}
					if (nextIndex > 0) {
						this.scrollTo(nextIndex, pos);
					}
				}
				return false;
			}, this);
			
			$(window).resize(function() {
				redraw(true);
			});
			
			initialized = true;		
		};
		
		this.scrollTo = function(index, left) {
			var pos = typeof left === 'undefined' ? $pagination.position().left : left,
				offset = pos / (paginationThumbWidth + paginationThumbSpacing),
				min = (offset * -1) + 1,
				max = min + paginationItemsToDisplay - 1,
				diff = 0;
				
			if (index === min && min > 1) {
				diff = -1;
			} else if (index === max && max < numItems) {
				diff = 1;
			}

			if (index < min || index > max) {
				if (index > max) {
					diff = index - max;
				} else {
					diff = (min - index) * -1;
				}
			}
			
			if (diff !== 0) {
				$pagination.animate({
					left: '-=' + diff * (paginationThumbWidth + paginationThumbSpacing)
				}, 150);
				max += diff;
				min += diff;
			}
			
			if (min == 1) {
				$sliders.filter('a.left:not(.inactive)').addClass('inactive');
			} else {
				$sliders.filter('a.left.inactive').removeClass('inactive');
			}
			if (max === numItems) {
				$sliders.filter('a.right:not(.inactive)').addClass('inactive');
			} else {
				$sliders.filter('a.right.inactive').removeClass('inactive');
			}
		};
		this.next = function() {
			return this.move(1);
		};
		this.prev = function() {
			return this.move(-1);
		};
		this.move = function(step) {
			var index = idToIndex(currentId) + step;
			return this.show(index);
		};
		this.show = function(index) {
			var $current = null,
				$next = null,
				id = '';
				
			if (index < 1) {
				index = 1;
			} else if (index > numItems) {
				index = numItems;
			}

			if (currentId === '') {
				id = $items.filter('li:first').attr('id').replace(/-[0-9]+$/, '-' + index);
				$current = $('#' + id);
				
				setTimeout(function() {
					$current.css({
						top: $current.data('itemTop') + 20,
						opacity: 0,
						display: 'block'
					}).addClass('current').animate({
						top: $current.data('itemTop'),
						opacity: 1
					}, 200);
					currentId = id;
				}, 200);
	
			} else {
				id = currentId.replace(/-[0-9]+$/, '-' + index);
				if (currentId !== id) {
					$current = $('#' + currentId);
					$next = $('#' + id);
				
					$current.fadeOut(300, function() {
						currentId = id;
						$current.removeClass('current');
					});
					$next.fadeIn(300, function() {
						$next.addClass('current');
					});
				}
			}
			
			if (index == 1) {
				$slideshow.find('a.prev').addClass('inactive');
			} else {
				$slideshow.find('a.prev.inactive').removeClass('inactive');
			}
			if (index === numItems) {
				$slideshow.find('a.next').addClass('inactive');
			} else {
				$slideshow.find('a.next.inactive').removeClass('inactive');
			}
			
			$pagination.find('li.current').removeClass('current');
			$pagination.find('a[href*="#' + id + '"]').closest('li').addClass('current');
			
			this.scrollTo(idToIndex(id));
		};
		this.open = function(index) {
			if (!lightbox.isOpen()) {
				if ($slideshow && $slideshow.length) {
					$slideshow.hide();
				}
				currentId = '';
				
				lightbox.open(function() {
					this.init();
					redraw();			
					this.show(index);
				}, this);
			}
		};
	};


	return {
		Inline: Inline,
		Lightbox: Lightbox
	};
	
})(jQuery);


com.nature.Lightbox = (function($) {

	var Lightbox = function() {
		var $lightbox = null,
			$shade = null,
			$content = null,
			$body = null,
			$topbar = null,
			redraw = null;
			
		this.redraw = function() {
			var height = 0;
			
			if ($body.outerHeight() > $(window).height()) {
				if ($body.hasClass('fixed')) {
					$body.removeClass('fixed');
					$body.css({
						top: $(document).scrollTop()
					});
				}
			} else if (!$body.hasClass('fixed')) {
				$body.addClass('fixed');
				$body.css({
					top: 0
				});
			}
			height = Math.max($('body').outerHeight(), $body.offset().top + $body.outerHeight());
			$shade.css('height', height);
		};
		
		this.title = function(title) {
			$topbar.remove('h1');
			$topbar.prepend('<h1>' + (typeof title == 'string' ? title : title.html()) + '</h1>');
			return this;
		};
		this.content = function($el) {
			$content.empty();
			$content.append($el);
			return this;
		};
		this.open = function(callback, scope) {
			var args = (arguments.length > 2) ? [].slice.call(arguments, 2) : [];
			
			$lightbox.show();
			if (typeof callback !== 'undefined') {
				setTimeout(function() {
					callback.apply(scope || null, args);
				}, 100);
			}
			$(window).resize(this.redraw);
			
			return this;
		};
		this.close = function() {
			$lightbox.hide();
			$(window).unbind('resize', this.redraw);
			return this;
		};
		this.isOpen = function() {
			return $lightbox.is(':visible');
		};
			
		$lightbox = $('#lightbox');
		if (!$lightbox.length) {
			$('body').append('<div id="lightbox"><section><div id="lightbox-shade"></div><div id="lightbox-body" class="fixed"><div id="lightbox-constrain"><div id="lightbox-topbar" class="cleared"><a href="javascript:;" class="close">Close</a></div><div id="lightbox-content"></div></div></div></section></div>');
			$lightbox = $('#lightbox');
		}
		
		$shade = $lightbox.find('#lightbox-shade');
		$content = $lightbox.find('#lightbox-content');
		$body = $lightbox.find('#lightbox-body');
		$topbar = $lightbox.find('#lightbox-topbar');
		
		$topbar.find('a.close').hitch('click', function() {
			this.close();
		}, this);
		
		this.redraw();
		
		$lightbox.hide();	
	};
	
	return Lightbox;
	
})(jQuery);

(function($) {
	$(document).ready(function() {
		$('div.carosello').each(function() {
			var slideshow = new com.nature.slideshow.Inline($(this));
		});
    })
})(jQuery)