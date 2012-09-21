
(function($) {
	
	$.fn.grow = function() {
		var minHeight = parseInt(this.css('height'), 10);
		this.bind('keyup', function() {
			$(this).css('height', 0);
			$(this).css('height', Math.max(minHeight, this.scrollHeight) + 'px');
		});
		return this;
	};
	
})(jQuery);
