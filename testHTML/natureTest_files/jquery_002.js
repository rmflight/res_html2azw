
(function($) {
	
	$.fn.hitch = function(ev, fn, scope) {
		return this.bind(ev, function() {
			return fn.apply(scope || this, Array.prototype.slice.call(arguments));
		});
	};
	
	$.fn.liveHitch = function(ev, fn, scope) {
		return this.live(ev, function() {
			return fn.apply(scope || this, Array.prototype.slice.call(arguments));
		});
	};
	
})(jQuery);
