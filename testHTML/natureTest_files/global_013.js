

com = com || {};
com.nature = com.nature || {};

com.nature.SimpleCarousel = (function($) {
	
	var SimpleCarousel = function($itemsContainer, options) {
		var opts = options || {}, 
			id = $itemsContainer.attr('id') || 'simple-carousel',
			$thumbs = null, 
			$thumbLinks = null, 
			$mask = null, 
			self = this,
			full = {
				width: $itemsContainer.width(),
				height: opts.height || 120
			},
			mask = {
				width: full.width - 60, 
				height: full.height,
				left: 0, 
				right: 0
			},
			current = null, 
			scrollTarget = 0,
			thumbsPosX = 0, 
			thumbsWidth = 0, 
			thumbSpacing = opts.thumbSpacing || 6,
			initialActive = opts.initialActive || 0,
			inView = 4,
			moveBy = 0,
			end = false,
			resizeMask = function() {
				full.width = $itemsContainer.width();
				mask.width = full.width - mask.left - mask.right;
				$mask.css({
					width: mask.width + 'px',
					height: mask.height + 'px',
					left: mask.left + 'px'
				});
			},
			updateNavButtons = function() {
				if (thumbsPosX === 0) {
					$itemsContainer.find('a.nav.left:not(.inactive)').addClass('inactive').attr('tabindex', '-1');
				} else {
					$itemsContainer.find('a.nav.left.inactive').removeClass('inactive').removeAttr('tabindex');
				}
				if (thumbsPosX % moveBy > 0 || end) {
					$itemsContainer.find('a.nav.right:not(.inactive)').addClass('inactive').attr('tabindex', '-1');
				} else {
					$itemsContainer.find('a.nav.right.inactive').removeClass('inactive').removeAttr('tabindex');
				}
			},
			doImageScroll = function(offset) {
				scrollTarget = -offset;
				$thumbs.animate({
					left: scrollTarget + 'px'
				}, 'fast');
				if(self.notify)
					self.notify('scrolled', offset);
				updateNavButtons();			
			};
		
		this.init = function() {
			$thumbs = $itemsContainer.find('ol:first');
			$mask = $thumbs.wrap('<div class="thumbs masking"></div>').parent();
			
			$thumbs.css('visibility', 'visible').attr('id','control-slider-'+id);
			
			
			if(opts.showLoader){
				$itemsContainer.append('<div class="simple-carousel-loading"><img src="/view/images/figure_browser_loading.gif" alt="Loading" class="simple-carousel-loading-icon"/></div>').find('div.simple-carousel-loading').css({
					width: full.width + 'px',
					height: full.height + 'px'
				});
			}
			$thumbs.find('img').wrap('<a href="javascript:;"></a>');
			$thumbLinks = $('a',$thumbs);
			$thumbLinks.eq(initialActive).addClass('active');
			
			$thumbLinks.click(function(){
				if(self.notify)
					self.notify('thumbClicked', $(this).find('img').data('video'));
				$thumbLinks.removeClass('active');
				$(this).addClass('active');
				$(this).parent('.popup')
				return false;
			});

			if(opts.title)
				$mask.before('<h3>'+opts.title+'</h3>');
				
			if($thumbLinks.length > inView){
				$mask.before('<div class="sc-nav" aria-controls="control-slider-'+id+'" role="presentation"><a href="javascript:;" class="nav left inactive" tabindex="-1" role="button"><span>left</span></a><a href="javascript:;" class="nav right" role="button"><span>right</span></a></div>');
				$itemsContainer.find('a.nav').click(function(e) {
					if ($thumbs.is(':animated') || $(this).hasClass('inactive')) {
						return false;
					}
				
					if ($(this).hasClass('left')) {
						if(thumbsPosX - moveBy < 0)
							thumbsPosX = 0;
						else
							thumbsPosX -= moveBy;
							end = false;
					} else {
						if(thumbsPosX + (moveBy*2) > thumbsWidth){						
							thumbsPosX = thumbsWidth - moveBy;
						}
						else
							thumbsPosX += moveBy;
						if(thumbsPosX === thumbsWidth - moveBy)
							end = true;
					}
					doImageScroll(thumbsPosX);
				});
			}
			
			$thumbs.find('li').css('margin-right', thumbSpacing).each(function(){
				thumbsWidth += $(this).outerWidth(true);
			}).last().css('margin-right',0);
			
			moveBy = inView * ($('li:first-child',$thumbs).outerWidth(true));
			updateNavButtons();
			
			setTimeout(function() {
				if(opts.showLoader){
					$itemsContainer.find('img.simple-carousel-loading-icon').animate({
						top: '-32px',
						opacity: 0.5
					}, 'medium', function() {
						$itemsContainer.find('div.simple-carousel-loading').fadeOut('fast');
					});
				}
				resizeMask();
			}, 10);
		};
	};
	
	return SimpleCarousel;
	
})(jQuery);
 