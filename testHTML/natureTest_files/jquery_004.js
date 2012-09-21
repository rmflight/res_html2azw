
(function($) {
	
	$.fn.linkify = function() {
		return this.each(function() {
			var el = $(this);
			el.html('<a href="javascript:;" title="' + el.text() + '">' + el.html() + '</a>');
		});
	};
	
})(jQuery);
