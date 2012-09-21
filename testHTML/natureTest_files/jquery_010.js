
(function($) {
	
	$.fn.scrollIntoView = function() {
		var target = Math.max(0, this.offset().top - 20);
		var pos = null;
		var el = this;
		
		var id = setInterval(function() {
			var y = self.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop;
			var dy = target - y;
			if (Math.abs(dy) < 5 || pos && pos == y) {
				pos = null;
				window.scrollTo(0, y);
				clearInterval(id);
				id = null;
				el.trigger('scrollComplete');
			} else {
				pos = y;
				window.scrollTo(0, Math.round(y + dy / 5));
			}
		}, 20);
		
		return this;
	};

})(jQuery);
