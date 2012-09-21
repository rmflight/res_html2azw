
var com = com || {};
com.nature = com.nature || {};

com.nature.TabGroup = (function($) {
	
	var TabGroup = function(el) {
		this.id = el.attr('id');
		this.active = el.find('div.tab-box.active').attr('id');
		this.prev;
		this._el = el;
		this._numTabs = el.find('h3.tab').length;
	};
	TabGroup.prototype = {
		init: function() {
			this._el.append('<div class="tab-bar"></div>');

			this._redraw();
			$('#' + this.id + ' h3.tab').linkify();
			$('#' + this.id + ' h3.tab a').hitch('click', this.click, this).ellipsis();
		},
		click: function(e) {
			var el = $(e.target);
			var id = el.parents('div.tab-box').attr('id');
			if (id != this.active) {
				this.switchTo(id);
			}
		},
		switchTo: function(id) {		
			if (this.active != id) {
				var $next = $('#' + id);
				if (!$next.length) {
					$next = this._el.find('div.tab-box:first');
				}
				$('#' + this.active).removeClass('active');
				$next.addClass('active');
				this.prev = this.active;
				this.active = id;
				this.notify('switch', this.prev, id);
			}
		},
		getTitle: function() {
			return $('#' + this.active + ' h3.tab a').attr('title');
		},
		_redraw: function() {
			var tabs = $('#' + this.id + ' h3.tab');
			var numTabs = tabs.length;
			var totalWidth = this._el.find('div.tab-content').width() + 2;
			
			var basicTabWidth = Math.floor(totalWidth / numTabs);
			var activeTabWidth = basicTabWidth + (totalWidth % numTabs);

			var x = 0;
			var h = 0;
			tabs.each(function() {
				if (numTabs < 3) {
					var width = Math.round(totalWidth / 3);
				} else {
					var width = ($(this).closest('div.tab-box').hasClass('active')) ? activeTabWidth : basicTabWidth;
				}
				
				h = Math.max(h, $(this).outerHeight())
				
				$(this).closest('div.tab-box').find('div.tab-content').css('paddingTop', $(this).outerHeight() + 9 + 'px');
				$(this).css({left: x + 'px', top: 0, width: (width == 'auto') ? 'auto' : width + 'px'});
				x += width;
			});

			if (numTabs < 3) {
				this._el.find('div.tab-bar').css({height: (h + 6) + 'px'});
			}
		}
	};
	
	return TabGroup;
	
})(jQuery);

(function($) {
	$(document).ready(function() {
        var pm = com.nature.PageManager;

    	$('#extranav div.tab-group').each(function() {
    		var t = new com.nature.TabGroup($(this));
    		t = $.extend(t, new com.nature.Broadcaster());
    		t.init();

    		t.subscribe('switch', pm.saveTabState, pm);
    		t.subscribe('switch', pm.trackTabs, pm);

    		pm.restoreTabState(t);
    	});
    })
})(jQuery)