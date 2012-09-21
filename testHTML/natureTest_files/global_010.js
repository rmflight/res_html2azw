

com = com || {};
com.nature = com.nature || {};

com.nature.FigureBrowser = (function($) {
	
	$.fn.reverse = [].reverse;
	
	var FigureBrowser = function($figures, options) {
		var opts = options || {}, id = $figures.attr('id') || 'figure-browser';
		var $thumbs = null, $mask = null, self = this;
		
		// ie6 reports the wrong value for $figures.width() but $('#content').width() is OK so use that instead
		var full = {
			width: $('#content').width(), height: 120
		};
		var mask = {
			width: full.width - 60, height: full.height,
			left: 30, right: 30
		};
		var current = null, scrollTarget = 0, thumbPosX = 0, thumbsWidth = 0, thumbSpacing = opts.thumbSpacing || 10;
		
		
		
		var resizeMask = function() {
			full.width = $('#content').width();			
			mask.width = full.width - mask.left - mask.right;
			$mask.css({
				width: mask.width + 'px',
				left: mask.left + 'px'
			});
		};
		
		var getFilename = function($img) {
			var src = $img.attr('src');
			var file = src.substring(src.lastIndexOf('/') + 1);
			return file.substring(0, file.lastIndexOf('.')).replace(/\./g, '-');
		};
		var getPreviewId = function($img) {
			return id + '-preview-' + getFilename($img);
		};
		var getThumbId = function($img) {
			return id + '-thumb-' + getFilename($img);
		};
		
		var updateNavButtons = function() {
			if (scrollTarget === 0) {
				$figures.find('a.nav.left:not(.inactive)').addClass('inactive').attr('tabindex', '-1');
			} else {
				$figures.find('a.nav.left.inactive').removeClass('inactive').removeAttr('tabindex');
			}
			if (mask.width > thumbsWidth || Math.abs(mask.width - (scrollTarget + thumbsWidth)) < 1) {
				$figures.find('a.nav.right:not(.inactive)').addClass('inactive').attr('tabindex', '-1');
			} else {
				$figures.find('a.nav.right.inactive').removeClass('inactive').removeAttr('tabindex');
			}
		};
		var getImageScrollOffset = function($img) {
			var offsetLeft = scrollTarget + $img.closest('li').position().left;
			var offsetRight = offsetLeft + $img.data('thumbWidth');
			if (offsetRight > mask.width) {
				return offsetRight - mask.width;
			} else if (offsetLeft < 0) {
				return offsetLeft;
			}
			return 0;
		};
		var doImageScroll = function(offset) {
			if (offset != 0) {
				scrollTarget -= offset;
				$thumbs.animate({
					left: scrollTarget + 'px'
				}, 'fast');
				self.notify('scrolled', offset);
			}
			updateNavButtons();			
		};
		
		var close = function() {
			if (current) {
				$('#' + current).fadeOut('fast');
				$('#' + current.replace('-preview-', '-thumb-')).parent().focus();
				self.notify('close', current);
				current = null;
			}
		};
		
		var open = function($img) {
			close();
				
			var previewId = getPreviewId($img), $preview = $('#' + previewId);
			var width = $img.data('previewWidth');
			var ieHackIsUsed = false;
			
			self.notify('popupShown', previewId);
			
			if (!$preview.length) {
				var newImg = $('<img />').attr({'src': $img.attr('src'), 'alt': $img.attr('alt'), 'title': $img.attr('title'), 'class': $img.attr('class'), 'width': $img.data('previewWidth'), 'height': $img.data('previewHeight') });
			//	var imgCopy = '<img src="' + $img.attr('src') + '" alt="' + $img.attr('alt') + '" title="' + $img.attr('title') + '" class="' + $img.attr('class') + '" width="' + $img.data('previewWidth') + '" height="' + $img.data('previewHeight') + '" />';
				
				var $wrapper = $img.closest('li');
				var html = '<div id="' + previewId + '" class="box no-padding figure-preview cleared">';
				html += '<figure><figcaption><span class="legend cleared">' + $wrapper.find('span.legend').html()
				
				if ($('body.ie6').length > 0) {
					html += '<button class="close" title="close">x</button>';
				}   
				else {
					html += '<button class="close" title="close">close</button>';
				}
				
			   
				
				html += '</span></figcaption>';
				
				html += '<div class="fig"></div><div class="description">';
				html += com.nature.Truncator.truncate($wrapper.find('div.description').html(), 250);
				if (($wrapper.find('div.larger').length) && ((com.nature.Configuration.get('isLoggedIn') == "yes") || (com.nature.Configuration.get('articleLevel') == "0"))) {
					html += $wrapper.find('div.larger').html();
				} else if ((com.nature.Configuration.get('isLoggedIn') == "no") && (com.nature.Configuration.get('articleLevel') !== "0")) {
					var siteRegister = com.nature.Configuration.get('mopRegister') || "",
						siteSubscribe = com.nature.Configuration.get('mopSubscribe') || "",
						siteLogin = com.nature.Configuration.get('mopLogin') || "",
						siteTitle = com.nature.Configuration.get('mopTitle') || "";
					
					html += '<p class="subLinks"><a href="' + siteRegister + '">Purchase Article</a><a href="' + siteSubscribe + '">Subscribe</a><a href="' + siteLogin + '" class="login" title="Login to ' + siteTitle + '">Login</a></p>';
				}
				html += '</div></figure></div>';
					
				var $preview = $(html);
				
				$preview.find('div.fig').append(newImg);

				$preview.find('button.close').click(function() {
					close();
				});
				$preview.find('p.fig-link').find('a').click(function() {
					close();
				});
				if (!com.nature.Css.isImplemented('boxShadow')) {
					$preview.addClass('popup-highlight');
				}
				
				$('body').append($preview);
				self.notify('created', previewId);
			}
			var w = Math.max(Math.min((width * 2), 725), 300);
			if (w < width + 40) {
				w = width + 40;
			}
			var x = Math.max(5, $mask.offset().left + ((mask.width - w) / 2));
			var y = $mask.offset().top - (($preview.outerHeight() - $mask.outerHeight()) / 2)
			//If the image hasn't loaded yet then shift up to account for it
			if ($preview.find("img.fig").length == 0) {
				y -= $img.data('previewHeight') / 2;
			}
			
			$preview.css({
				width: w + 'px',
				left: x + 'px',
				top: y + 'px'
			});
			$preview.find('span.legend').css({
				width: (w - 40) + 'px'
			});
			
			$preview.fadeIn('fast');
			$preview.find('button.close').focus();

			current = previewId;
		};
		

		this.init = function() {
			$thumbs = $figures.find('ol:first');
			$mask = $thumbs.wrap('<div class="thumbs masking"></div>').parent();
			
			$thumbs.css('visibility', 'visible');
			$mask.before('<a href="javascript:;" class="nav left inactive" tabindex="-1"><span>left</span></a>').after('<a href="javascript:;" class="nav right"><span>right</span></a>');
			
			resizeMask();
			
			$figures.append('<div class="figure-browser-loading"><img src="/view/images/figure_browser_loading.gif" alt="Loading" class="figure-browser-loading-icon"/></div>').find('div.figure-browser-loading').css({
				width: full.width + 'px',
				height: full.height + 'px'
			});
		};
		this.start = function() {
			$thumbs.find('img.fig').each(function() {
				var $el = $(this), pw = $el.width(), ph = $el.height(), tw = pw / 2, th = ph / 2;
				$el.data('previewWidth', pw).data('previewHeight', ph).data('thumbWidth', tw).data('thumbHeight', th);
				$el.css({
					width: tw + 'px', height: th + 'px'
				});
				$el.closest('li').css({
					left: thumbPosX + 'px', top: '10px'
				});
				$el.attr('id', getThumbId($el));
				thumbPosX += (tw + thumbSpacing);
			}).wrap('<a href="javascript:;"></a>').parent().click(function() {
				open($(this).find('img.fig'));
			}).focus(function() {
				var offset = getImageScrollOffset($(this).find('img.fig'));
				doImageScroll(offset);
			});

			$figures.find('a.nav').click(function(e) {
				if ($thumbs.is(':animated') || $(this).hasClass('inactive')) {
					return false;
				}
				close();
				
				var offset = 0;
				if ($(this).hasClass('left')) {
					$thumbs.find('img.fig').reverse().each(function() {
						offset = getImageScrollOffset($(this));
						if (offset < ($(this).width() * -1)) {
							return false;
						}
					});
				} else {
					$thumbs.find('img.fig').each(function() {
						offset = getImageScrollOffset($(this));
						if (offset > $(this).width()) {
							return false;
						}
					});
				}
				doImageScroll(offset);
			});
			
			thumbsWidth = thumbPosX - thumbSpacing;
			updateNavButtons();
			
			$(window).bind('resize', function() {
				resizeMask();
				updateNavButtons();
			});
			
			setTimeout(function() {
				$figures.find('img.figure-browser-loading-icon').animate({
					top: '-32px',
					opacity: 0.5
				}, 'medium', function() {
					$figures.find('div.figure-browser-loading').fadeOut('fast');
				});
			}, 10);
		};
	};
	return FigureBrowser;
	
})(jQuery);
 