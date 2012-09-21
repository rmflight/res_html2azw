/*Image Power Zoomer v1.1 (June 18th, 2010)
* This notice must stay intact for usage 
* Author: Dynamic Drive at http://www.dynamicdrive.com/
* Visit http://www.dynamicdrive.com/ for full source code
*/

//June 18th, 10: Adds ability to specify a different, higher resolution version of the original image as the image shown inside the magnifying glass.

//jQuery.noConflict();

(function($){
	
	var ddpowerzoomer = {
			dsetting: { defaultpower:3, powerrange:[2,7], magnifiersize:[500, 500]},
			$magnifier: { outer:null, inner:null, image:null},
			activeimage: null,
			movemagnifier:function(e, moveBol, zoomdir){
				var activeimage = ddpowerzoomer.activeimage, //get image mouse is currently over
					activeimginfo = activeimage.info,
					coords = activeimginfo.coords, //get offset coordinates of image relative to upper left corner of page
					$magnifier = ddpowerzoomer.$magnifier,
					magdimensions = activeimginfo.magdimensions, //get dimensions of magnifier
					power = activeimginfo.power.current,
					powerrange = activeimginfo.power.range,
					x = (coords ? e.pageX - coords.left : 0), //get x coords of mouse within image (where top corner of image is 0)
					y = (coords ? e.pageY - coords.top : 0);

				if (moveBol){
					if (coords && e.pageX >= coords.left && e.pageX <= coords.right && e.pageY >= coords.top && e.pageY<=coords.bottom)  //if mouse is within currently within boundaries of active base image
						$magnifier.outer.css({left:e.pageX-magdimensions[0]/2, top:e.pageY-magdimensions[1]/2});	//move magnifier so it follows the cursor
					else{ //if mouse is outside base image
						ddpowerzoomer.activeimage = null;
						$magnifier.outer.hide(); //hide magnifier
					}
				}
				else if (zoomdir){ //if zoom in
					var od = activeimginfo.dimensions, //get dimensions of image
						newpower = (zoomdir === "in") ? Math.min(power+1, powerrange[1]) : Math.max(power-1, powerrange[0]), //get new power from zooming in or out
						nd = [od[0] * newpower,od[1] * newpower]; //calculate dimensions of new enlarged image within magnifier
					
					$magnifier.image.css({width:nd[0], height:nd[1]});
					activeimginfo.power.current = newpower; //set current power to new power after magnification
				}
				power = activeimginfo.power.current; //get current power
				var newx =- x*power+magdimensions[0]/2, //calculate x coord to move enlarged image
					newy =- y*power+magdimensions[1]/2;
				$magnifier.inner.css({left:newx, top:newy}); //move image wrapper within magnifier so the correct image area is shown
			},

			setupimage:function($, imgref, options){
				var s = jQuery.extend({}, ddpowerzoomer.dsetting, options),
					$imgref = $(imgref);
				
				imgref.info = { //create object to remember various info regarding image 
					power: {current:s.defaultpower, range:s.powerrange},
					magdimensions: s.magnifiersize,
					dimensions: [$imgref.width(), $imgref.height()],
					coords: null
				}
				$imgref.unbind('mouseenter').mouseenter(function(e){ //mouseenter event over base image
					var $magnifier = ddpowerzoomer.$magnifier;
					$magnifier.outer.css({width:s.magnifiersize[0], height:s.magnifiersize[1]}) //set magnifier's size
					var offset = $imgref.offset(); //get image offset from document
			
					var power = imgref.info.power.current;
					$magnifier.inner.html('<img src="'+options.largeimagesrc+'"/>'); //get base image's src and create new image inside magnifier based on it
					$magnifier.image=$magnifier.outer.find('img:first').css({width:imgref.info.dimensions[0]*power, height:imgref.info.dimensions[1]*power}) //set size of enlarged image
					var coords = {left:offset.left, top:offset.top, right:offset.left+imgref.info.dimensions[0], bottom:offset.top+imgref.info.dimensions[1]};
					imgref.info.coords = coords; //remember left, right, and bottom right coordinates of image relative to doc
					$magnifier.outer.show();
				
					ddpowerzoomer.activeimage = imgref;
				}).trigger('mouseenter');
			},

	
			init:function($){
				var $magnifier=$('<div id="zoomer" class="zoomer" />')
					.append('<div style="position:relative;left:0;top:0;" />')
					.appendTo(document.body); //create magnifier container and add to doc
				ddpowerzoomer.$magnifier = {outer:$magnifier, inner:$magnifier.find('div:eq(0)'), image:null}; //reference and remember various parts of magnifier
				$magnifier = ddpowerzoomer.$magnifier;
				$(document).unbind('mousemove.trackmagnifier').bind('mousemove.trackmagnifier', function(e){ //bind mousemove event to doc
					if (ddpowerzoomer.activeimage && $('.zoom-toggle a').hasClass('zoom-on')){ //if mouse is currently over a magnifying image AND the zoomer is turned on
						ddpowerzoomer.movemagnifier(e, true); //move magnifier
					}
				})
			}

		}; //ddpowerzoomer

	jQuery.fn.addpowerzoom = function(options){
		var options = options;
			
		$('#zoomer').css({'visibility':'hidden','display':'none'}); 
		return this.each(function(){ //return jQuery obj
			if (this.tagName != "IMG")
				return true; //skip to next matched element
			if (typeof options === "undefined")
				options = {};
			if (options.largeimage && options.largeimage.length>0){ //preload large image?
				options.preloadimg = new Image();
				options.preloadimg.src = options.largeimage;
			}
			var $imgref = $(this);
			options.largeimagesrc = (options.preloadimg) ? options.preloadimg.src : $imgref.attr('src');
			if (parseInt(this.style.width) > 0 && parseInt(this.style.height) > 0) //if image has explicit CSS width/height defined	
				ddpowerzoomer.setupimage($, this, options);
			else if (this.complete){ //account for IE not firing image.onload
				ddpowerzoomer.setupimage($, this, options);
			}
			else{
				$imgref.bind('load', function(){
					ddpowerzoomer.setupimage($, this, options);
				})
			}
		})
	}

	$(document).ready(function(){ //initialize power zoomer on DOM load
		ddpowerzoomer.init($);
	});
})(jQuery);

