(function($) {
	$("#extranav .twitter-feed").each(function(){
        var $list = $(this).find('ol'),
            count = $list.children('li').length,
            index = 0, 
            height = 0;

		if (count > 1) {
		    $list.children('li').each(function() {
				height = Math.max(height, $(this).height());
			});
			$list.children('li:gt(0)').css({display: 'none'});
			$list.parent().css('minHeight', height);
			setInterval(function() {
			    $list.children('li:eq(' + index + ')').fadeOut('fast', function() {
				    index = (index < count - 1) ? ++index : 0;
					$list.children('li:eq(' + index + ')').fadeIn('fast');
				});
			}, 5000);
		}
	});
})(jQuery);