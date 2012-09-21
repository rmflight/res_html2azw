/** unique, save, make specific
 *	Carousel
 *	Andrew Hayward - 26th May 2010
 *
 *	Pulls all '.carousel's out of the page
 */

(function($){
	var defaultShowCount = 4;
	$(".carousel").each(function(){
		var $carousel = $(this),
			$container = $(".container",$carousel),
			$list = $("> ul",$container),
			$items = $("> li",$list),
			showCount = (this.className.match(/show-(\d)/)||[defaultShowCount]).pop();

			
		if ($items.length <= showCount) {
			$items.width(Math.floor($container.width()/$items.length));
			return;
		} else {
			$carousel.addClass("active");
		}

		var $left = $('<a href="#left" title="Scroll Left" class="left"><span></span></a>').prependTo($carousel),
			$right = $('<a href="#right" title="Scroll Right" class="right"><span></span></a>').appendTo($carousel),
			idealWidth = Math.floor($container.width()/showCount) + 5,
			width,
			interval;

		var scroll = {
			left: function() {
				$list.animate({left:-width},{
					complete: function ( ) {
						$items = $("li",$list);
						$list.append($items[0]);
						$list.css("left",0);
					}
				});
			},
			right: function() {
				$items = $("li",$list);
				$list.css("left",-width);
				$list.prepend($items[$items.length-1]);
				$list.animate({left:0});
			},
			click: function(dir) {
				return function(e) {
					clearInterval(timer);
					clearTimeout(timer);
					timer = setTimeout(function(){
						timer = setInterval(scroll.left,5000);
					},15000);
					scroll[dir]();
					e.preventDefault();
				};
			},
			init: function() {
				timer = setInterval(scroll.left,5000);
			},
			pause: function() {
				clearTimeout(timer);
				clearInterval(timer);
			},
			resume: function() {
				timer = setTimeout(scroll.init,5000);
			}
		};

		$(function(){
			width = Math.min(idealWidth,$list.outerWidth());
			$items.css("width",width);
			$list.css("width",$items.length * width);
			$left.click(scroll.click('right'));
			$right.click(scroll.click('left'));
			scroll.init();
		});

		$container.hover(scroll.pause,scroll.resume);

	});
})(jQuery);


/** unique, save, make specific for application
 *	Teaser keywords
 *	Andrew Walker - 26 July 2010
 *
 *	Pulls all '.standard-teaser ul.tags out of the page
 */

(function($) {
	var defaultMaxKeywords = 3;
	
	$('.standard-teaser ul.tags').each(function() {
		var $list = $(this),
			maxKeywords = ((this.className||"").match(/\blimit-(\d+)\b/)||[defaultMaxKeywords]).pop(),
			$extras = $list.children('li:gt(' + (maxKeywords - 1) + ')');
			
		if ($extras.length) {
			$list.append('<li><a href="#" class="toggle">Show ' + $extras.length + ' more</a></li>').attr('title', '+ ' + $extras.length + ' more').find('a:last').click(function() {
				var $el = $(this);
				if ($el.hasClass('toggle-collapse')) {
					$el.removeClass('toggle-collapse').attr('title', 'Show ' + $extras.length + ' more');
					$extras.hide();
				} else {
					$el.addClass('toggle-collapse').attr('title', 'Show fewer').html('Show fewer');
					$extras.show();
				}
				return false;
			});
			$extras.hide();
		}
	});
	
})(jQuery);

			
/**
 *	Research Drop Down
 *	Andrew Walker - 26 July 2010
 *
 *	Creates research by subject/article type drop down navigation
	*/
	
(function($) {
	
	var $options = $('#research-options'),
		$heading = $options.closest('div.inner').find('h1.primary-heading:first'),
		$doc = $(document),
		$link = null,
		isActive = false,
		focusTimeout = null,
		numLinks = $options.find('a').length + 1,
		linkIndex = 0;
	
	var focus = function() {
		var $this = $(this), offset = $this.position();
		
		if (focusTimeout) {
			clearTimeout(focusTimeout);
		}
		linkIndex = getLinkIndex($this);
		
		if (isActive) {
			return false;
		}
		isActive = true;
		
		$options.css({
			display: 'block',
			left: offset.left - 10,
			top: offset.top + $this.height(),
			minWidth: $this.outerWidth() + 20
		});		
		setTimeout(function() { // delay needed for chrome
		$doc.click(close).keydown(keydown);
		}, 10);
	};
	var blur = function() {
		if (focusTimeout) {
			clearTimeout(focusTimeout);
		}
		focusTimeout = setTimeout(function() {
			close();
		}, 100);
	};
	var close = function() {
		$doc.unbind('click', close).unbind('keydown', keydown);
		$options.hide();
		isActive = false;
		clearTimeout(focusTimeout);
	};
	var keydown = function(e) {
		var dir = {38: -1, 40: 1}[e.keyCode] || 0;
		if (dir != 0) {
			linkIndex += dir;
			if (linkIndex < 0) {
				linkIndex = numLinks - 1;
			} else if (linkIndex >= numLinks) {
				linkIndex = 0;
			}
			if (linkIndex == 0) {
				$link.get(0).focus();
			} else {
				$options.find('a:eq(' + (linkIndex - 1) + ')').get(0).focus();
			}
			return false;
		}
	};
	var getLinkIndex = function($el) {
		return $options.find('a').index($el) + 1;
	};
	
	if (numLinks > 1) {
		$link = $heading.children('span').children('span');
		$link.replaceWith('<a href="#" class="select">' + $link.html() + '</a>');
		$link = $heading.find('a');

		$options.find('a').blur(blur).focus(focus);
		$link.blur(blur).focus(focus).click(focus);
	}
	
	
})(jQuery);



/**
 *	Archive Lists
 *	Andrew Hayward - 09 July 2010
 */
(function($) {
	$("#archive ol.archive-list > li").each(function(i,item) {
		var $item = $(item);
		if(!$item.find('h2').find('a').length) {
		$("h2",this).wrapInner('<a href="#"/>');
		$("h2 a",this).click(function(){
			$item.toggleClass("collapsed");
			$(this).attr('title',$item.hasClass('collapsed')?"Expand":"Collapse");
			return false;
		}).attr('title',$item.hasClass('collapsed')?'Expand':'Collapse');
		}
	});
})(jQuery);



/**
 *  Setup Form placeholders
 *  Andrew Walker - 2 September 2010
 *
 *  requires /view/scripts/plugins/jquery.initplaceholders.js
 */

(function($) {
	
	$('form').initPlaceholders();
	
})(jQuery);


/**
 *  Video list box height equaliser
 *  Tom Courthold - 16 August 2010
 *
 *  Aligns all <ul class='video-list'> rows
 */

(function($) {
	
	$('ul.video-list,ul.podcast-list').each(function() {
		var $ul = $(this);
		var $items = $ul.children("li");
		var _itemsPerRow = Math.round($ul.width() / $items.width());
		var c = 1;
		var maxHeight = 0;
		var $tmp = [];
		
		$items.each(function() {
			var $li = $(this);		
			$tmp.push($li);
			
			if (maxHeight < $li.height()) {
				maxHeight = $li.height();
			}
			
			if (c == _itemsPerRow) {
				$.each($tmp, function(index, value) {
					$tmp[index].height(maxHeight);
				});
				
				$tmp = [];
				maxHeight = 0;
				c = 0;
			}
			
			c++;
		});
	
	});
	
})(jQuery);

/*
[VIEW-1834]
JS for megapod style content ticker
*/
var natureJs = window.natureJs || {};

natureJs.megapod = function(){
	
	var list = $('#news-home ul.megapod'),
		listItems = [],
		listLength,
		currentIndex = 0,
		getCurrentNode = function() {
			return listItems[currentIndex];
		},
		getContainsImage = function(node) {
		  return node.find('img').length;
		},
		rotate = function(move_to) {
			var current = getCurrentNode(),
			    highlightIndex,
			    index;
			    			    
			if (move_to) {
			    highlightIndex = move_to;
			} else {
			    // occasionally this was being set to a string. How I don't know
			    highlightIndex = parseInt(currentIndex, 10) + 1;
			}
						
			if (highlightIndex > listLength) {
			   index = 0;
			} else {
			    index = highlightIndex;
			}
												  			
			current.attr('class', '');
			currentIndex = index;
			
			var newCurrent = getCurrentNode();
			
			if (getContainsImage(newCurrent)) {
			  listItems[index].addClass('current-image-inside'); 
			} else {
			  listItems[index].addClass('current'); 
			}
		},
		init = function() {
				    
		  var ticker,
		      imageHeights = [];
			if (!list.length) { return false; }
			$.each(list.find('li'), function(i) {
				var current = $(this);
				current.attr('data-index', i);
				listItems.push(current);
				if (current.hasClass('current')) {
					currentIndex = i;
				}
				// if we've got a image we push it's height into an array
				if (getContainsImage(current)) {
				    imageHeights.push(current.find('img').height());
				}
			});
			// sort the array into reverse order
			imageHeights.sort(function(a, b) {
			    if ( a < b ) return 1;
                if ( a > b ) return -1;
                if ( a === b ) return 0;
			});
			/* 
			    set min-height on the list minus 20 
			    (which is a bit of a hack but works in this example)
			*/
			if (!$('body.ie6').length) {
			    list.css('min-height', imageHeights[0] - 20);
			} else {
			    // no IE6 support for min-height but height will work the same
			    list.css('height', imageHeights[0] - 20);
			}
			listLength = listItems.length - 1;
			list.bind('mouseover focus', function(e) {
				var node = $(e.target);
				if (node.is('a')) {
					rotate(node.closest('li').attr('data-index'));
				}
			});
			ticker = window.setInterval(function() {
			    rotate(false);
			}, 4000);
						
		    list.parent().hover(function() {
		        window.clearInterval(ticker);
		    },
		    function() {
		        ticker = window.setInterval(function() {
		            rotate(false);
		        }, 4000);
		    });
		};
		
	return {
		init: init
	};
	
}();

$(function() {
	natureJs.megapod.init();
});

/**
 *  ToC - Toggle the about the cover text
 */

(function($){
	$("#about-the-cover h3").wrapInner('<a href="#about-the-cover"/>').find("a").click(function(){
		$("#about-the-cover").toggleClass("visible");
		return false;
	});
})(jQuery);


// preserve in site
if (com.nature.TypeHelper.hasSmoothing() === false) {
	document.getElementsByTagName('html')[0].className += ' font-smoothing-disabled';
} else {
	document.getElementsByTagName('html')[0].className += ' font-smoothing-enabled';
}
