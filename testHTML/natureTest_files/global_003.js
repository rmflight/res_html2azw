/**
 *	Limited Authors List
 *	Andrew Hayward - 09 July 2010
 *	Andrew Walker - 04 August 2010 
 *  Andrew Mee - 27 September 2011
 *
 *	Processes all 'ul.authors.limited's to present the authors 
 *  in a nice list format with an "et al" expansion where appropriate
 *  Accepts a new limit to be set by class: e.g. "authors limited limit-2"
 */

var com = com || {};
com.nature = com.nature || {};

com.nature.LimitedAuthorsList = {
	defaultMaxAuthors: 5,
	insertSeparators: function($authors){
		var l = $authors.length - 2;
		for (var i = l; i >= 0; i--) {
			$authors[l-i].innerHTML += (i ? '<span class="sep">, </span>' : '<span class="sep"> &amp; </span>');
		};
	},
	
	init: function(){
    	$('ul.authors.limited, .toc ul.authors').each(function() {
    	    var lal = com.nature.LimitedAuthorsList;
    		$(this).removeClass("limited");//prevents this being called multiple times on the same list
    		var $authors = $('li', this),
    			numAuthors = $authors.length,
    			maxAuthors = ((this.className||"").match(/\blimit-(\d+)\b/)||[lal.defaultMaxAuthors]).pop(),
    			hidden = numAuthors - maxAuthors;

    		if (numAuthors > 1) {
    			lal.insertSeparators($authors);
    		}
    		if (hidden > 0) {
    			$(this).addClass("expandable");
    			var collapsed = true;
    			var $extras = $("li:gt("+(maxAuthors-1)+")",this).hide(),
    				$last = $("li:eq("+(maxAuthors-1)+")",this).addClass("last"),
    				$etal = $('<li class="etal"><a href="javascript:;">+ et al.</a></li>').appendTo(this).attr("title","+ "+hidden+" more").find("a");
    			$etal.click(function(){
    				if (collapsed = !collapsed) {
    					$last.addClass("last");
    					$etal.html("+ et al").parent().attr("title","+ "+hidden+" more");
    					$extras.hide();
    				} else {
    					$last.removeClass("last");
    					$etal.html("&ndash; Show fewer authors").parent().attr("title",null);
    					$extras.show();
    				}
    				return false;
    			});
    		};
    	});
    }
};

(function($) {
	$(document).ready(function() {
        com.nature.LimitedAuthorsList.init();
    })
})(jQuery)