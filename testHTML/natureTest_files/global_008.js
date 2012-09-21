(function($) {
	var functionsToInit = [			
		'initHighlighting',
		'initBookmarking',
		'initDeliveryServices',
		'initAuthors',
		'initCompoundNumbers',
		'initDbLinks',
		'initCompoundViewer',
		'initDraggable',
		'initFigureBrowser',
		'initReferenceContextLinks',
		'initCommenting',
		'initEdsumms',
		'initBoxes',
		'initArticleNavigation',
		'initToggleAll',
		'initClickTrack',
		'initPlaceholders',
		'initReshighCarousel',
		'initIcbViewer',
		'initDownloading',
		'initCitations',
		'initCopyLink',
		'initRelatedVideoThumb'
	];
	// loops through items to be initialised and removes those not used on mobile display
	var n = functionsToInit.length;
	var toExclude = {};
    if($(document.body).hasClass('small-screen')){
    	toExclude.initDraggable = 0;
	}
   	while (n--) {
   		if (functionsToInit[n] in toExclude) {
   			functionsToInit.splice(n, 1);
   		}
   	}

    $(function() {
    	var a = new com.nature.ArticleSetup();
    	for (var i = 0; functionsToInit[i]; ++i) {
    		a[functionsToInit[i]]();
    	}
    });
    
})(jQuery);