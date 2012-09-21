(function($){
	$(window).load(function() {
		// collapse the space taken by an ad slot if no ad has been targeted
		setTimeout(function() {
			$('div.ad').each(function() {
				var $el = $(this);
				if ($el.height() < 30) {
					$el.css({display: 'none'});
				}
			});	
		}, 500);
		
		/**
		 *  Doubleclick ad ID scraper
		 *  Leigh Clancy - 26 May 2011
		 *
		 *  Tests unique ID from ad that is delivered
		 */
	
		// only do this if an adIdentifier is set
		if (typeof adIdentifier !== "undefined"){
	
			// if clickTAG exists then the ad is in flash
			if (typeof clickTAG !== "undefined") {
				if (clickTAG.indexOf(adIdentifier) >= 0) {
					com.nature.Cookie.set(adKeyword, 'shown', 365, '/');
				}
		
			// otherwise just get it from the usual anchor tag.
			} else {  	
				var adSrc = $("div.ad a").attr('href');
				if (adSrc.indexOf(adIdentifier) >= 0) {
					com.nature.Cookie.set(adKeyword, 'shown', 365, '/');
				}
			}
		
			// but what if its being served from Eyewonder?
			var adID = "#" + adIdentifier;
			if ($(adID).length){
				com.nature.Cookie.set(adKeyword, 'shown', 365, '/');
			}
		
		}
	});	
})(jQuery);
