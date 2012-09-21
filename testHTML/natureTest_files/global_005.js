
var com = com || {};
com.nature = com.nature || {};

com.nature.Highlighter = (function($) {
	
	var Highlighter = function(id) {
		var group = new com.nature.PopupGroup(true);
		var id = id || 'highlighting-tool';
		var types = [];
		var self = this;
		var $figTabLinks = $("a[href*='fig_tab'], p.back a");
	//	var state = new com.nature.Bitstate();
	//	state.init();
		
		var idToType = function(id) {
			return id.replace(/^highlight-/, '');
		};
		var getAdditionalTypes = function(type) {
			var types = [type];
			if (type == 'geneprot') {
				types.push('protein');
			} else if (type == 'compound') {
				types.push('chemical');
			}
			return types;
		};
		var buildSelector = function(scope, types) {
			return scope + ' span.highlight-' + types.join(', ' + scope + ' span.highlight-');
		};
		
		this.init = function(scope) {
			var basicTypes = [], 
				bannedParents = ['#acknowledgments', '#author-information', '#author-contributions', 'h1', 'h2', 'h3', 'h4', 'h5', 'b', 'span.legend', 'div.figures-at-a-glance', '.section-nav', '#additional-information'];
						
			$('#' + id + ' input[type="checkbox"]').hitch('click', this.toggle, this).each(function() {
				var $el = $(this);
				var type = idToType($el.attr('id'));
				basicTypes.push(type);
				types = types.concat(getAdditionalTypes(type));
				
				if ($el.is(':checked')) {
					self.show(type);
				} else {
					// testing having this enabled by default
					$el.prop({"checked": true});
					self.toggle({"target": $el.get(0)});
				}
				//} else if(state.isSet("highlightcompound")) {
				//	$el.attr({"checked": true});
				//	self.toggle({"target": $el.get(0)});
				//}
			});
			
			var selectorsToClear = [], additionalTypes = [];
			for (var i = 0; basicTypes[i]; ++i) {
				additionalTypes = getAdditionalTypes(basicTypes[i]);
				for (var j = 0; bannedParents[j]; ++j) {
					selectorsToClear.push(buildSelector(bannedParents[j], additionalTypes));
				}
			}
			$(selectorsToClear.join(', ')).attr('class', '');			
			
			var selector = buildSelector('body', types);
			var $items = $(selector);
			if ($items.length) {
				$items.each(function() {
					$(this).attr('title', 'Click on the name for more options').attr('tabIndex', '0');
				});
				this.initPopups('body');

				var n = basicTypes.length;
				while (n--) {
					if (!$items.filter('span.highlight-' + getAdditionalTypes(basicTypes[n]).join(', span.highlight-')).length) {
						$('#' + id).find('#highlight-' + basicTypes[n] + ', .highlight-' + basicTypes[n]).hide();
					}
				}
				$('#' + id).slideDown('normal');
			}	
		};
		this.show = function(type) {
			$(buildSelector('body', getAdditionalTypes(type))).removeClass('highlight-off');
		//	state.set("highlightcompound", "/" + com.nature.Configuration.get("siteName"));
		};
		this.hide = function(type) {
			$(buildSelector('body', getAdditionalTypes(type))).addClass('highlight-off');
		//	state.clear("highlightcompound", "/" + com.nature.Configuration.get("siteName"));
		};
		this.toggle = function(e) {
			var $el = $(e.target);
			var label = $('#' + id + ' label[for="' + $el.attr('id') + '"]').attr('class');
			var type = idToType($el.attr('id'));
			if ($el.is(':checked')) {
				this.show(type);
			} else {
				this.hide(type);
			}
			this.notify('toggle', label, $el.is(':checked'));
		};
		this.initPopups = function(scope) {
			var pm = com.nature.PageManager;
			var scope = scope || 'body';
			var selector = buildSelector(scope, types);
			
			$(selector).each(function() {
				var id = this.getAttribute('data-related-id'),
					cls = this.className,
					$content = $('#' + id),
					$tmpContent = $content.clone(),
					parentSection = pm.getParentSection($(this)); //.parents(".section").find("h1").text().replace(/\s/g,"-");
				
				$tmpContent.find('h3').remove();

				var popup = new com.nature.Popup($(this), $tmpContent);
				popup = $.extend(popup, new com.nature.Broadcaster());
				if($content.find('h3').length) {
					popup.title($content.find('h3').html());
				}
				popup.init();
				popup.subscribe('open', group.onOpen, group);
				popup.subscribe('close', group.onClose, group);
				popup.subscribe('open', function() {
					var annotationType = /highlight-([a-z]+)/i.exec(cls.replace('highlight-off', ''))[1],
						a = new com.nature.ArticleSetup();
					pm.trackAnnotation(this, id, annotationType, parentSection);
					a.initDbLinks('#' + popup.id, parentSection);
				}, pm);
				group.add(popup);
			});
		};
	};
	return Highlighter;
	
})(jQuery);

