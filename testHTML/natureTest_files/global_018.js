
var com = com || {};
com.nature = com.nature || {};

/* onhashchange code heavily inspired by 
 * http://github.com/cowboy/jquery-hashchange/raw/v1.2/jquery.ba-hashchange.js
 * and to a lesser extent by 
 * http://blixt.org/js/Hash.js
 */

com.nature.History = (function($) {

	var History = function() {
		var isOldIe = $.browser.msie && (!document.documentMode || document.documentMode < 8);
		var hasNativeSupport = 'onhashchange' in window && !isOldIe;
		
		var iframe = null, interval = null;
		if (isOldIe) {
			iframe = $('<iframe src="javascript:0"/>').css({display: 'none'}).appendTo(document.body).get(0).contentWindow;
		}

		var add = function(hash) {
			hash = addPrefix(hash);
			if (iframe) {
				iframe.document.open();
				iframe.document.close();
				iframe.location.hash = hash;
			}
			location.hash = hash;
		};
		var getHash = function(url) {
			if (!url) {
				url = (iframe) ? iframe.location.href : location.href;
			}
			//if (url.indexOf('#') == -1) {
			//	return '/';
			//}
			return addPrefix(url.replace(/^.*?#/, ''));
		};
		var addPrefix = function(hash) {
			if (hash.indexOf('/') !== 0) {
				hash = '/' + hash;
			}
			return hash;
		};
		var clean = function(hash) {
			return hash.replace(/^\//, '');
		};
		
		var startPolling = function() {
			var current = getHash();
			interval = setInterval(function() {
				var hash = getHash();
				if (hash != current) {
					current = hash;
					if (iframe) {
						location.hash = hash;
					}
					$(window).trigger('hashchange');
				}
			}, 100);
		};
		var stopPolling = function() {
			if (!iframe) {
				clearInterval(interval);
			}
		};

		$.event.special.hashchange = {
			setup: function() {
				if (hasNativeSupport) return false;
				startPolling();			
			},
			teardown: function() { 
				if (hasNativeSupport) return false;
				stopPolling();
			}
		};

		this.add = add;
		this.getHash = getHash;
		this.clean = clean;
	};

	return History;

})(jQuery);


com.nature.Article = (function($) {

	var Article = function() {
		var history = new com.nature.History();
		var currentAction = '';
		var isIe6 = $('body.ie6').length > 0;
		var currentSource;

		this.init = function() {
			$('h1.toggle, h2.toggle, h3.toggle').linkify().find('a').hitch('click', this.toggle, this);
			
			if ($('div.article-template').length) {
				$('a[href*="#"]').liveHitch('click', this.anchorLink, this);
				
				$(window).hitch('hashchange', function(e) {
					this.openAndScrollTo(history.getHash());
				}, this);
				
				if (location.hash) {
					this.openAndScrollTo(history.getHash(location.href));
				}
			}
		};
		this.anchorLink = function(e) {
			var target = e.target;
			currentSource = $(target).parents("ul.figure-nav").size() > 0 ? 
				$(target).parents(".figure").attr("id") :
				$(target).parents("section").find("h1").text().toLowerCase().replace(/\s/g, "-");

			while (target.nodeName.toLowerCase() != 'a') {
				target = target.parentNode;
			}

			var linkHostname = target.hostname.replace(/:[0-9]+$/, '');
			var locationHostname = location.hostname.replace(/:[0-9]+$/, '');
			var linkPathname = target.pathname.replace(/^\//, '');
			var locationPathname = location.pathname.replace(/^\//, '');

			if (linkHostname != locationHostname || linkPathname != locationPathname) {
				return true;
			}

			this.openSection($(target).attr('href'));
			
			return false;
		};
		this.toggle = function(e) {
			var $el = $(e.target);
			var $section = $el.closest('.expanded, .collapsed');
			if ($section.hasClass('expanded')) {
				if (isIe6) {
					// ie6 sometimes jumps around when a section is closed
					// this should keep it in place albeit 
					// with a slightly unsightly judder :( 
					var pos = $(window).scrollTop();
					this.close($section);
					setTimeout(function() {
						window.scrollTo(0, pos);
					}, 50);
				} else {
					this.close($section);
				}
			} else {
				currentAction = 'toggle';
				this.openSection($section.attr('id'));
			}
			return false;
		};
		
		this.openSection = function(id) {
			var hash = history.getHash(id);
			var current = history.getHash();
			if (hash != current) {
				history.add(hash); // will trigger hashchange event
			} else {
				this.openAndScrollTo(hash);
			}
		};

		this.openAndScrollTo = function(hash) {
			var target = history.clean(hash);
			if (target.length) {
				var $target = $('#' + target);
				if (!$target.length) {
					return;
				}
				
				var $parent = $target.closest('.expanded, .collapsed');
				this.open($parent);
				this.highlight($target);
				
				if (currentAction != 'toggle' || isIe6) { // don't scroll for toggle action
					if (isIe6) {
						if ($target.parents('#extranav').length == 0) {
							setTimeout(function() {
								window.scrollTo(0, Math.max($target.offset().top - 10, 0));
							}, 50);
						}
					} else {
						window.scrollTo(0, Math.max($target.offset().top - 10, 0));
					}
					this.notify('scroll', currentSource, $target.attr('id'));
				}
			} else {
				window.scrollTo(0, 0);
			}
			currentAction = '';
		};
		this.highlight = function($target) {
			var $fadeEl = null;
			
			if (!$target || !$target.length) {
				return;
			}
			
			if ($target.hasClass('section')) {
				$fadeEl = $target.find('h1.section-heading');
			} else if ($target.hasClass('figure')) {
				$fadeEl = $target.find('span.legend');
			} else {
				$fadeEl = $target.find('h2.toggle, h3.toggle');
				if (!$fadeEl.length) {
					$fadeEl = $target;
				}
			}
			
			var bg = $fadeEl.css('backgroundColor');
			// assume white background if not set
			if (bg == 'transparent' || bg.match(/rgba *\([0-9]{1,3} *, *[0-9]{1,3} *, *[0-9]{1,3} *, *0 *\)/i)) {
				bg = '#ffffff';
			}
			if (!$fadeEl.hasClass('scroll-highlight')) {
				$fadeEl.addClass('scroll-highlight').colorFade({
					backgroundColor: bg
				}, {delay: 1000}).bind('fadeComplete', function() {
					$(this).removeClass('scroll-highlight').removeAttr('style').unbind('fadeComplete');
				});
			}
		};
		
		this.open = function(section) {
			var $section = typeof section == 'string' ? $('#' + section) : section;
			if ($section.hasClass('expanded')) {
				return;
			}
			$section.swapClasses('collapsed', 'expanded');
			this.notify('expand', $section.attr('id'));
		};
		this.close = function(section) {
			var $section = typeof section == 'string' ? $('#' + section) : section;
			if ($section.hasClass('collapsed')) {
				return;
			}
			$section.swapClasses('expanded', 'collapsed');
			this.notify('collapse', $section.attr('id'));
		};
		
		this.getExpandedSections = function() {
			return this.getSections('expanded');
		};
		this.getCollapsedSections = function() {
			return this.getSections('collapsed');
		};
		this.getSections = function(type) {
			var selector = '.section';
			if (typeof type != 'undefined') {
				selector += '.' + type;
			}
			var items = [];
			$(selector).each(function() {
				items.push($(this).attr('id'));
			});
			return items;
		};
	};
	return Article;

})(jQuery);
