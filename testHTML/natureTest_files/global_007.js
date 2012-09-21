(function($) {

    /* Figuring out what css is being used and then adding new web trends meta */

    var mobileCss = $("#mobile-css-test").css("display");

    if(mobileCss == "block") {
        $("head").append('<meta name="WT.z_css" content="mobile" />');
    } else {
        $("head").append('<meta name="WT.z_css" content="desktop" />');
    }
    
    $(document).ready(function() {

        /* Creating the mobile js navigation and search */

    	$('.menu-sub li:nth-child(odd)').addClass('odd');

    	$('#menu-parent').click(function () {
    		if($(this).hasClass('menu-up')) {
    	        $('.menu-sub').hide(100, function() {
    	        	$('#menu-parent').removeClass('menu-up');
    	        });
        	} else {
        		$('#menu-parent').addClass('menu-up');
        		$('.menu-sub').show(100);
        	}
            return false;
        });

            
        var searchOpen = false;
        $('#search-parent').click(function () {
        	$('.menu-sub').hide(400, function() {
    	        	$('#menu-parent').removeClass('menu-up');
    	    });

    		$('#header-search').toggle();
    		
    		if($('#header-keyword:not(:focus)')) {
    	    	$('#header-keyword').focus();
    	    }

            return false;
        }); 

        /* Using web trends multi track to monitor the toggle between desktop and mobile */

    	var switchView = com.nature.Cookie.get('switchView');
    	if(switchView == 'desktop') {
    		$("#toggle").click(function() {
    			com.nature.Cookie.set('switchView', '', -1, '/');
    			var args = [];
    			args.push("WT.action");
    			args.push("toggle_css_mobile");
    			args.push("WT.source");
    			args.push("css_desktop");
    			args.push("WT.destination");
    			args.push("css_mobile");
    			args.push("WT.dl");
    			args.push("1");
    			args.push("WT.ndl");
    			args.push("1");
    			_tag.dcsMultiTrack.apply(_tag, args);
    			location.reload();
    		});
    	} else {
    		$("#toggle").click(function() {
    			com.nature.Cookie.set('switchView','desktop', 1, '/');
    			var args = [];
    			args.push("WT.action");
    			args.push("toggle_css_desktop");
    			args.push("WT.source");
    			args.push("css_mobile");
    			args.push("WT.destination");
    			args.push("css_desktop");
    			args.push("WT.dl");
    			args.push("1");
    			args.push("WT.ndl");
    			args.push("1");
    			_tag.dcsMultiTrack.apply(_tag, args);
    			location.reload();
    		});
    	}

        $(".small-screen ul.tab-bar").each(function() {
            var list = $(this),
                select = $(document.createElement("select")).insertBefore($(this).hide());
                label = $(document.createElement("label")).insertBefore(select);
                label.text("Archive Type:");
                label.addClass("mobile-filter");
                select.addClass("mobile-filter ");
            $(">li", this).each(function() {
                var option = $(document.createElement("option"))
                    .appendTo(select)
                    .val($(this).find("a").attr("href"))
                    .html($(this).text()),

                selected = $(this).hasClass("active");

                if(selected === true) {
                    $(option).attr("selected", "selected");
                }
            });

            select.change(function() {
                window.location = $(this).val();
            })
            
        });
    });  

    /*! A fix for the iOS orientationchange zoom bug.
     Script by @scottjehl, rebound by @wilto.
     MIT License.
    */
    (function(w){
        var doc = w.document;

        if( !doc.querySelectorAll ){ return; }

        var meta = doc.querySelectorAll( "meta[name=viewport]" )[ 0 ],
            initialContent = meta && meta.getAttribute( "content" ),
            disabledZoom = initialContent + ", maximum-scale=1.0",
            enabledZoom = initialContent + ", maximum-scale=10.0",
            enabled = true,
            orientation = w.orientation,
            rotation = 0;

        if( !meta ){ return; }

        function restoreZoom(){
            meta.setAttribute( "content", enabledZoom );
            enabled = true;
        }

        function disableZoom(){
            meta.setAttribute( "content", disabledZoom );
            enabled = false;
        }

        function checkTilt( e ){
            orientation = Math.abs( w.orientation );
            rotation = Math.abs( e.gamma );

            if( rotation > 8 && orientation === 0 ){
                if( enabled ){
                    disableZoom();
                }   
            }
            else {
                if( !enabled ){
                    restoreZoom();
                }
            }
        }

        w.addEventListener( "orientationchange", restoreZoom, false );
        w.addEventListener( "deviceorientation", checkTilt, false );
    })( this );
})(jQuery);

