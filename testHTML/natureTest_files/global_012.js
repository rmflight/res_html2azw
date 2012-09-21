(function($) {
	$('a.popup-this').bind('click', function() {
		window.open(this.href);
		return false;
	});
})(jQuery);