/** functions */


function mathmlLightBox() {
	var resize = false;
	var largestEquationWidth;
	var padding = 30;
	var innerColWidth = $('div.full-text').width() - padding;

	function getLargestEquation() {
		var arr=[];
		var largest;
		var images = jQuery('.mathimg'); 
		
		for(var i = 0; i < images.length; i++ ){
			arr[i]=images[i].width	
		}
		largest = Math.max.apply(Math, arr);
		//console.log("largestEquationWidth: "+largest);
		return largest;
	}
	
	largestEquationWidth = getLargestEquation();
			
	if (largestEquationWidth > innerColWidth){
		var stretchFactor = largestEquationWidth - innerColWidth;
		var newDivContentWidth = $('#content').width() + stretchFactor ;
		var newInnerColWidth = $('div.full-text').width()+ stretchFactor;
		stretchOrResize(stretchFactor,newDivContentWidth,newInnerColWidth)
	}

	function stretchOrResize(stretchFactor,newDivContentWidth,newInnerColWidth){
		var screenWidth,returnValue;
		
		if((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPad/i))) {
			screenWidth = $(document).width();
		}else{
			screenWidth = screen.width;
		}

		//alert(" originalInnerColWidth: "+innerColWidth+"\r\n LargestEquWidth: "+largestEquationWidth+"\r\n\r\n We need to stretchBy: "+stretchFactor+"\r\n\r\n newInnerColWidth becomes: "+newInnerColWidth+"\r\n\r\n contentWidth will stretch too"+" \r\n\r\n originalContentWidth: "+$('#content').width()+"\r\n newContentWidth: "+newDivContentWidth+"\r\n\r\n newContentWidth + padding: "+(newDivContentWidth+padding) +"\r\n screenRes: "+screenWidth+" \r\n\r\n maximumInnerWidth this screen can handle : "+ (newInnerColWidth - ((newDivContentWidth + padding) - screenWidth)));
		if ((newDivContentWidth + padding) > screenWidth){
			stretchAndResize(newDivContentWidth,screenWidth,newInnerColWidth);
			//console.log("EquationTooLarge, stretchAndResize");
			resize = true;
		}else{
			//console.log("EquationFits, stretch");
			stretchContent(newDivContentWidth,newInnerColWidth);
		}
	}
	function stretchAndResize(newDivContentWidth,screenWidth,newInnerColWidth){
		var extraScreenWidth = (newDivContentWidth + padding) - screenWidth;
		
		$('#content').width(screenWidth - padding);
		$('div.full-text').width(newInnerColWidth - extraScreenWidth);
		
	}
	function stretchContent(newDivContentWidth,newInnerColWidth){
		$('#content').width(newDivContentWidth);
		$('div.full-text').width(newInnerColWidth);
	}
	
jQuery('.mathimg').each(function() {
  
    var originalEvent = jQuery(this).parent().attr('href'), originalWidth = jQuery(this).width();
	// manipulate <a>'s behaviour
   if(originalWidth > 100){ 
		jQuery(this).parent().attr('onclick', '');
		jQuery(this).parent().bind('click', function(e) { e.preventDefault(); });
		jQuery(this).parents('a').attr('href',$(this).attr('src')).attr('class','group').attr('title','');
		
		// adding tooltip on mouseover
		if(jQuery(this).parent().is("a[class='group']")){
			jQuery(this).mouseover(function() {
			jQuery(this).attr('title','Click to Enlarge');
			});
			// Onlick remove title
			jQuery(this).click(function() {
			jQuery(this).attr('title','');
			});
		}
	}
	// resize large image and add toggle
	if (resize) {
		var resizeFactor;
		padding = 30;
		
		if($('div.full-text').width()/largestEquationWidth > 0.8){
			resizeFactor = 0.8;
		}else{
			resizeFactor = $('div.full-text').width()/largestEquationWidth;
		}
		//console.log("resizeFactor: "+resizeFactor);
		jQuery(this).css('width',(originalWidth * resizeFactor) - padding);
	}

});	
	if((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPad/i))){
	//do not activate lightBox effect for Iphone or Ipad
	}else{
        // activate lightbox effect
        $("a.group").attr('title','');
        jQuery("a.group").fancybox({
                hideOnContentClick : true,
                centerOnScroll: true

        });
    }
}
function initShareThis () {
	jQuery('.iconlist').attr("id", "sharethis").hide();//add the id to apply the css style attached and hides the box
	//jQuery('.iconlist li:even').addClass('left');
	jQuery('.postto_title').replaceWith('<a href="#" class="sharethis_title">Share this article</a>');
	jQuery('.sharethis_title')
		.hover(function() {$('#sharethis').stop(true, true).show();},function () {$('#sharethis').fadeOut();})
		.click(function(){return false;})//disable the link
	jQuery('#sharethis').hover(function() {$(this).stop(true, true).show();  $(".sharethis_title").addClass("btn-on");},function() {$('#sharethis').stop(true, true).hide(); $(".sharethis_title").removeClass("btn-on")});//fades out after 1s out of the box
	//push down the bottom ad when the central bloc (content) is too short
	contentOffset = jQuery('.article').height() - (jQuery('#article-navigation-bar').height() + jQuery('#sharethis').height());
	if(contentOffset < 0) {
		jQuery('#content').css({'padding-bottom':jQuery('#sharethis').height() + 'px'});
	}
}

function initAffiliations() {
	// Auto-collapse Author affiliations on full-text page
	jQuery('.article #ins_container').hide();
	jQuery('.full-text #ins_container').show();
	jQuery('.full-text .affiliations-toggle i').addClass('active');
	
	jQuery('.affiliations-toggle').click(toggleAffiliations);
	
	jQuery('p.authors sup a').click( function(e) {
		e.preventDefault();
		if($('#ins_container').is(":hidden")) toggleAffiliations();
		var ind = $(this).text();
		jQuery("#ins_container sup").parent().css("background-color","").eq(ind-1).css("background-color","lightGrey");
		//jQuery('html, body').animate({scrollTop: $("#ins"+ind ).offset().top}, 500);
	});

}

function toggleAffiliations() {
		jQuery('#ins_container').slideToggle('fast');
		jQuery('.affiliations-toggle i').toggleClass('active');//arrow
}

function outlineAbbreviations() {
	window.onscroll = document.documentElement.onscroll = setMenuOffset;
	
	// full text long titles popup
	jQuery('.long a').each(function() {
		// capture abbreviated title in memory
		var abbreviatedText = jQuery(this).text();
		// replace abbreviated title with full title
		jQuery(this).mouseover(function() {
			jQuery(this).removeClass("clipped").addClass("full");
			jQuery(this).text($(this).attr('title'));
		});
		// replace full title with abbreviated title
		jQuery(this).mouseout(function() {
			jQuery(this).removeClass("full").addClass("clipped");
			jQuery(this).text(abbreviatedText);
		});
	}); 
}

// make the outline box to be fixed while browsing the content
function setMenuOffset() {
	var scroll = (window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop);//scroll position (cross-browser)
	var leftNavBox = jQuery(".outline-wrapper");//box to move
	var leftNavTop = scroll + 20;//20 = leftnav's css "top" property
	var leftNavBottom = leftNavTop + leftNavBox.height();
	var contentTop = jQuery(".full-text").offset().top;//vertical position FROM which the position will be fixed
	var contentBottom = contentTop + jQuery(".full-text").height();//vertical position TO which the position will be fixed
	
	if (leftNavTop > contentTop)
		if (leftNavBottom > contentBottom) {
			var hackTop = contentBottom - leftNavBox.height();
			leftNavBox.css({'position':'absolute','top':hackTop + 'px'});
		}
		else if((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPad/i))){
			leftNavBox.css({'position':'relative','top':'20px'});
		}
		else
			leftNavBox.css({'position':'fixed','top':'20px'});		
	else
		leftNavBox.css({'position':'absolute','top':''});
}
function returnToText(){
        $('#references li').css('background-color','');

		if (window.location.hash) {
            scrollTo(0, $('a[href='+window.location.hash+']'));
			window.history.back();
		}
		else {
			scrollTo(0, 0);
		}
	}

function totext() {
	   document.write('<a href="javascript:returnToText();">Return to text</a>');
}

jQuery(function(){
	jQuery().zoom(function(){
		if(jQuery.browser.msie && jQuery.browser.version == "7.0") {
			if(window.screen.deviceXDPI > 129) {
				jQuery(".outline-wrapper").css('display','none');
			} else {
				jQuery(".outline-wrapper").css('display','block');
			}
		}
	});
});



/** onLoad */
jQuery(document).ready(function() {
	// h: minor xsl changes to accomodate css styles
	// jQuery('span.articletype').wrap(document.createElement('h2')); vm not xsl
		
	if(jQuery(".full-text").offset()) { outlineAbbreviations(); }

	if(jQuery('.article').offset()) { initAffiliations(); }
	
	if (jQuery('#sharethis').offset()) { initShareThis(); }
	
	if (!($.browser.webkit)){
		if (jQuery('.mathimg').offset()) { mathmlLightBox();}
	}


    /* shifting movies in pop-up fix
    *   a css solution requires xsl update
    * */
    if($("#poparticle").length > 0 && $("img.poster").length == 1 ) {
        $("img.poster").parents("p").css("min-height",($("img.poster").height()+10)+"px");
    }

		
});

// webkit cannot handle document.ready with width() or height()
 jQuery(window).load(function() {
	if ($.browser.webkit) {
		if (jQuery('.mathimg').offset()) { mathmlLightBox();}
	}
 })

 
 /* LEGACY CODE FOR INLINE JS IN XML */
 
 /* dummy functions for xsl */
function initializeOutline() {}
function outlineok() {}
function outlineover() {}
function outlineout() {}

function fullpopup(url,n,w,h) {
	window.open(url,n,'width='+w+',height='+h+',resizable=yes,scrollbars=yes,toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,copyhistory=yes');
}

function largepopup(url,n,w,h) 
{
	var wi=520, he=550;
	if (undefined != w) wi=w;
	if (undefined != h) he=h;
	if (window.screen) {
		if (undefined == w) wi = screen.availWidth-100;
		if (undefined == h) he = screen.availHeight-200;
	}
	window.open(url,n,'width='+wi+',height='+he+',top=10,left=10,resizable=yes,scrollbars=yes,toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,copyhistory=yes');
}

function loadhalf(width) {
	var popwidth = typeof width != 'undefined'? width+40 : 640;
	if (popwidth > screen.availWidth) popwidth = screen.availWidth;
	if (popwidth < 640) popwidth = 640;
	window.focus();
	window.moveTo(0,0);
	window.resizeTo(popwidth,screen.availHeight);
	window.blur;
}

function loadfull() {
	window.focus();
	window.moveTo(0,0);
	window.resizeTo(screen.availWidth,screen.availHeight);
	window.blur;
}



function andtotext() {
	document.write(" | <a href='javascript:turn();'>Return to text</a>")
}

function stepback(text) {
	document.write("<a href='javascript:goback();'>" + text + "</a>")
}

function turn() {
	if (window.location.hash.length > 0) window.history.back(); 
	else scrollTo(0,0);
}

function goback() {
	window.history.back(); 
}

/* PluginDetect v0.4.9 ( QuickTime ) by Eric Gerds www.pinlady.net/PluginDetect */ 

if(!PluginDetect){var PluginDetect={getNum:function(A,_2){if(!this.num(A)){return null}var m;if(typeof _2=="undefined"){m=/[\d][\d\.\_,-]*/.exec(A)}else{m=(new RegExp(_2)).exec(A)}return m?m[0].replace(/[\.\_-]/g,","):null},hasMimeType:function(_4){var s,t,z,M=_4.constructor==String?[_4]:_4;for(z=0;z<M.length;z++){s=navigator.mimeTypes[M[z]];if(s&&s.enabledPlugin){t=s.enabledPlugin;if(t.name||t.description){return s}}}return null},findNavPlugin:function(N,_7){var _8=N.constructor==String?N:N.join(".*"),numS=_7===false?"":"\\d";var i,re=new RegExp(_8+".*"+numS+"|"+numS+".*"+_8,"i");var _a=navigator.plugins;for(i=0;i<_a.length;i++){if(re.test(_a[i].description)||re.test(_a[i].name)){return _a[i]}}return null},getAXO:function(_b){var _c,e;try{_c=new ActiveXObject(_b);return _c}catch(e){}return null},num:function(A){return (typeof A!="string"?false:(/\d/).test(A))},compareNums:function(_e,_f){if(!this.num(_e)||!this.num(_f)){return 0}if(this.plugin&&this.plugin.compareNums){return this.plugin.compareNums(_e,_f)}var m1=_e.split(","),m2=_f.split(","),x,p=parseInt;for(x=0;x<Math.min(m1.length,m2.length);x++){if(p(m1[x],10)>p(m2[x],10)){return 1}if(p(m1[x],10)<p(m2[x],10)){return -1}}return 0},formatNum:function(num){if(!this.num(num)){return null}var x,n=num.replace(/\s/g,"").replace(/[\.\_]/g,",").split(",").concat(["0","0","0","0"]);for(x=0;x<4;x++){if(/^(0+)(.+)$/.test(n[x])){n[x]=RegExp.$2}}return n[0]+","+n[1]+","+n[2]+","+n[3]},initScript:function(){var $=this,IE;$.isIE=(/*@cc_on!@*/false);$.IEver=-1;$.ActiveXEnabled=false;if($.isIE){IE=(/msie\s*\d\.{0,1}\d*/i).exec(navigator.userAgent);if(IE){$.IEver=parseFloat((/\d.{0,1}\d*/i).exec(IE[0]),10)}var _14,x;_14=["ShockwaveFlash.ShockwaveFlash","Msxml2.XMLHTTP","Microsoft.XMLDOM","Msxml2.DOMDocument","TDCCtl.TDCCtl","Shell.UIHelper","Scripting.Dictionary","wmplayer.ocx"];for(x=0;x<_14.length;x++){if($.getAXO(_14[x])){$.ActiveXEnabled=true;break}}}if($.isIE){$.head=typeof document.getElementsByTagName!="undefined"?document.getElementsByTagName("head")[0]:null}},init:function(_15){if(typeof _15!="string"){return -3}_15=_15.toLowerCase().replace(/\s/g,"");var $=this,IE,p;if(typeof $[_15]=="undefined"){return -3}p=$[_15];$.plugin=p;if(typeof p.installed=="undefined"){p.minversion={};p.installed=null;p.version=null;p.getVersionDone=null}$.garbage=false;if($.isIE&&!$.ActiveXEnabled){return -2}return 1},isMinVersion:function(_17,_18,_19){var $=PluginDetect,i=$.init(_17);if(i<0){return i}if(typeof _18=="undefined"||_18==null){_18="0"}if(typeof _18=="number"){_18=_18.toString()}if(!$.num(_18)){return -3}_18=$.formatNum(_18);if(typeof _19=="undefined"){_19=null}var p=$.plugin,m=p.minversion;if(typeof m["a"+_18]=="undefined"){if(p.getVersionDone==null){var tmp,x;for(x in m){tmp=$.compareNums(_18,x.substring(1,x.length));if(m[x]==1&&tmp<=0){return 1}if(m[x]==-1&&tmp>=0){return -1}};p.getVersion(_18,_19)}if(typeof m["a"+_18]!="undefined"){}else{if(p.version!=null||p.installed!=null){p.getVersionDone=1;m["a"+_18]=(p.installed==-1?-1:(p.version==null?0:($.compareNums(p.version,_18)>=0?1:-1)))}else{m["a"+_18]=-1}}}$.cleanup();return m["a"+_18];return -3},getVersion:function(_1d,_1e){var $=PluginDetect,i=$.init(_1d);if(i<0){return null}var p=$.plugin;if(typeof _1e=="undefined"){_1e=null}if(p.getVersionDone==null){p.getVersion(null,_1e);p.getVersionDone=1}$.cleanup();return p.version;return null},cleanup:function(){var $=this;if($.garbage&&typeof window.CollectGarbage!="undefined"){window.CollectGarbage()}},isActiveXObject:function(_22){var $=this,result,e,s="<object width=\"1\" height=\"1\" "+"style=\"display:none\" "+$.plugin.getCodeBaseVersion(_22)+">"+$.plugin.HTML+"</object>";if($.head.firstChild){$.head.insertBefore(document.createElement("object"),$.head.firstChild)}else{$.head.appendChild(document.createElement("object"))}$.head.firstChild.outerHTML=s;try{$.head.firstChild.classid=$.plugin.classID}catch(e){}result=false;try{if($.head.firstChild.object){result=true}}catch(e){}try{if(result&&$.head.firstChild.readyState<4){$.garbage=true}}catch(e){}$.head.removeChild($.head.firstChild);return result},codebaseSearch:function(min){var $=this;if(typeof min!="undefined"){return $.isActiveXObject(min)};var _26=[0,0,0,0],x,y,A=$.plugin.digits,t=function(x,y){var _29=(x==0?y:_26[0])+","+(x==1?y:_26[1])+","+(x==2?y:_26[2])+","+(x==3?y:_26[3]);return $.isActiveXObject(_29)};var _2a,tmp;var _2b=false;for(x=0;x<A.length;x++){_2a=A[x]*2;_26[x]=0;for(y=0;y<20;y++){if(_2a==1&&x>0&&_2b){break}if(_2a-_26[x]>1){tmp=Math.round((_2a+_26[x])/2);if(t(x,tmp)){_26[x]=tmp;_2b=true}else{_2a=tmp}}else{if(_2a-_26[x]==1){_2a--;if(!_2b&&t(x,_2a)){_2b=true}break}else{if(!_2b&&t(x,_2a)){_2b=true}break}}}if(!_2b){return null}}return _26.join(",")},dummy1:0}}PluginDetect.initScript();PluginDetect.quicktime={mimeType:["video/quicktime","application/x-quicktimeplayer","image/x-macpaint","image/x-quicktime"],progID:"QuickTimeCheckObject.QuickTimeCheck.1",progID0:"QuickTime.QuickTime",classID:"clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B",minIEver:7,HTML:"<param name=\"src\" value=\"A14999.mov\" /><param name=\"controller\" value=\"false\" />",getCodeBaseVersion:function(v){var r=v.replace(/[\.\_]/g,",").split(","),$=PluginDetect;if($.compareNums(v,"7,5,0,0")>=0){v=r[0]+","+r[1]+r[2]+","+r[3]}return "codebase=\"#version="+v+"\""},digits:[16,16,16,0],clipTo3digits:function(v){if(v==null||typeof v=="undefined"){return null}var t;t=v.split(",");return t[0]+","+t[1]+","+t[2]+",0"},getVersion:function(min){var _31=null,p,$=PluginDetect;if(typeof min=="undefined"){min=null}min=this.clipTo3digits(min);if(!$.isIE){p=$.findNavPlugin(["QuickTime","(Plug-in|Plugin)"]);if(p&&p.name&&$.hasMimeType(this.mimeType)){_31=$.getNum(p.name)}this.installed=_31?1:-1}else{var obj;if($.IEver<this.minIEver){obj=$.getAXO(this.progID);if(obj&&obj.QuickTimeVersion){_31=obj.QuickTimeVersion.toString(16);_31=_31.charAt(0)+"."+_31.charAt(1)+"."+_31.charAt(2)}}else{if($.getAXO(this.progID0)){if(min==null){_31=$.codebaseSearch()}else{this.minversion["a"+min]=$.codebaseSearch(min)?1:-1;return}}}this.installed=_31?1:($.getAXO(this.progID0)?0:-1)}this.version=this.clipTo3digits($.formatNum(_31))}};

// Flash detection

// This script will test up to the following version.
flash_versions = 20;

// Initialize variables and arrays
var flash = new Object();
flash.installed=false;
flash.version='0.0';

// Dig through Netscape-compatible plug-ins first.
if (navigator.plugins && navigator.plugins.length) {
	for (x=0; x < navigator.plugins.length; x++) {
		if (navigator.plugins[x].name.indexOf('Shockwave Flash') != -1) {
			flash.version = navigator.plugins[x].description.split('Shockwave Flash ')[1].split(' ')[0];
			flash.installed = true;
			break;
		}
	}
}

// Then, dig through ActiveX-style plug-ins afterwords
else if (window.ActiveXObject) {
	for (x = 2; x <= flash_versions; x++) {
		try {
			oFlash = eval("new ActiveXObject('ShockwaveFlash.ShockwaveFlash." + x + "');");
			if(oFlash) {
				flash.installed = true;
				flash.version = x + '.0';
			}
		}
		catch(e) {}
	}
}

// Movie embedding. Part 2 - Replacing the thumbnail with the embedded movie

var link = true;
function playmovie(id,format,moviename,width,height) {
	var qtheight = height + 16;
	var cond = false;
	
	// Everything that depends on the movie format is in this section, minimum player version and suitable embed code
	switch (format) {
		case "swf":
		cond = document.getElementById && (PluginDetect.isMinVersion('QuickTime', '0.0') >= 0 ? 'true' : 'false');
		movietext="<object classid='clsid:D27CDB6E-AE6D-11cf-96B8-444553540000' height='"+ height +"' width='"+ width +"' class='embedded'><param name='src' value='"+ moviename +"' /><!--[if !IE]>--><object data='"+ moviename +"' type='application/x-shockwave-flash' height='"+ height +"' width='"+ width +"' class='embedded'></object><!--<![endif]--></object>";
		break;
		case "mp4":
		cond = document.getElementById && (PluginDetect.isMinVersion('QuickTime', '6.0') >= 0 ? 'true' : 'false');
		movietext="<object classid='clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B' height='"+ qtheight +"' width='"+ width +"'><param name='src' value='"+ moviename +"' /><!--[if !IE]>--><object data='"+ moviename +"' type='video/quicktime' height='"+ qtheight +"' width='"+ width +"'></object><!--<![endif]--></object>";
		break;
		case "peg":
		;
		case "mpg":
		cond = document.getElementById && (PluginDetect.isMinVersion('QuickTime', '6.4') >= 0 ? 'true' : 'false');
		movietext="<object classid='clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B' height='"+ qtheight +"' width='"+ width +"'><param name='src' value='"+ moviename +"' /><!--[if !IE]>--><object data='"+ moviename +"' type='video/quicktime' height='"+ qtheight +"' width='"+ width +"'></object><!--<![endif]--></object>";
		break;
		case "avi":
		cond = document.getElementById && (PluginDetect.isMinVersion('QuickTime', '3.0') >= 0 ? 'true' : 'false');
		movietext="<object classid='clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B' height='"+ qtheight +"' width='"+ width +"'><param name='src' value='"+ moviename +"' /><!--[if !IE]>--><object data='"+ moviename +"' type='video/quicktime' height='"+ qtheight +"' width='"+ width +"'></object><!--<![endif]--></object>";
		break;
		case "mov":
		cond = document.getElementById && (PluginDetect.isMinVersion('QuickTime', '3.0') >= 0 ? 'true' : 'false');
		movietext="<object classid='clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B' height='"+ qtheight +"' width='"+ width +"'><param name='src' value='"+ moviename +"' /><!--[if !IE]>--><object data='"+ moviename +"' type='video/quicktime' height='"+ qtheight +"' width='"+ width +"'></object><!--<![endif]--></object>";
		break;
	}
	
	// This executes the replacement
	if (cond) {
		document.getElementById(id).innerHTML=movietext;
		link = false;
	}
}

//Functions related to FLV movies

// Stopping the movie when another is started
var currentItem;

function getUpdate(typ,pr1,pr2,pid) {

	if (typ == "state") {
	
		// Play 
		if (pr1 == 2) {
		
			// Pause active movie if it is playing.
			if (currentItem != null && currentItem != pid) {
				thisMovie(currentItem).sendEvent('playpause');
			}
			
			// Save current movie
			currentItem = pid;	
					
		// Flush active movie var on Stop (3) and Pause (0).
		} else if(pr1 == 3 || pr1 == 0) {                               
			currentItem = null;
		} 
	}
};

// This is a javascript handler for the player and is always needed.
function thisMovie(movieName) {
    if(navigator.appName.indexOf("Microsoft") != -1) {
		return window[movieName];
	} else {
		return document[movieName];
	}
};

// Replacing the jpeg with the movie
var link = true;
function playvideo(id,moviename,width,height) {
	if (document.getElementById) {
		var flvheight = height + 20;
		var so = new SWFObject('/movies/mediaplayer.swf','js'+id,width,flvheight,'7');  
		so.useExpressInstall('/movies/expressinstall.swf'); 
		so.addParam('allowfullscreen','true');
		so.addParam('salign','lt');
		so.addParam('quality','high');
		so.addParam('scale','noscale');
		so.addVariable('file',moviename);                               
		so.addVariable('autostart','true');
		so.addVariable('showdigits','false');
		so.addVariable('useaudio','false');
		so.addVariable('usefullscreen','true');
		so.addVariable('showicons','false');
		so.addVariable('enablejs','true');
		so.addVariable('javascriptid','js'+id);                                       
		so.addVariable('width',width);
		so.addVariable('height',flvheight);
		so.write(id);
		link = false;
	}
}

/**
 * SWFObject v1.5: Flash Player detection and embed - http://blog.deconcept.com/swfobject/
 *
 * SWFObject is (c) 2007 Geoff Stearns and is released under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 *
 */
if(typeof deconcept=="undefined"){var deconcept=new Object();}if(typeof deconcept.util=="undefined"){deconcept.util=new Object();}if(typeof deconcept.SWFObjectUtil=="undefined"){deconcept.SWFObjectUtil=new Object();}deconcept.SWFObject=function(_1,id,w,h,_5,c,_7,_8,_9,_a){if(!document.getElementById){return;}this.DETECT_KEY=_a?_a:"detectflash";this.skipDetect=deconcept.util.getRequestParameter(this.DETECT_KEY);this.params=new Object();this.variables=new Object();this.attributes=new Array();if(_1){this.setAttribute("swf",_1);}if(id){this.setAttribute("id",id);}if(w){this.setAttribute("width",w);}if(h){this.setAttribute("height",h);}if(_5){this.setAttribute("version",new deconcept.PlayerVersion(_5.toString().split(".")));}this.installedVer=deconcept.SWFObjectUtil.getPlayerVersion();if(!window.opera&&document.all&&this.installedVer.major>7){deconcept.SWFObject.doPrepUnload=true;}if(c){this.addParam("bgcolor",c);}var q=_7?_7:"high";this.addParam("quality",q);this.setAttribute("useExpressInstall",false);this.setAttribute("doExpressInstall",false);var _c=(_8)?_8:window.location;this.setAttribute("xiRedirectUrl",_c);this.setAttribute("redirectUrl","");if(_9){this.setAttribute("redirectUrl",_9);}};deconcept.SWFObject.prototype={useExpressInstall:function(_d){this.xiSWFPath=!_d?"expressinstall.swf":_d;this.setAttribute("useExpressInstall",true);},setAttribute:function(_e,_f){this.attributes[_e]=_f;},getAttribute:function(_10){return this.attributes[_10];},addParam:function(_11,_12){this.params[_11]=_12;},getParams:function(){return this.params;},addVariable:function(_13,_14){this.variables[_13]=_14;},getVariable:function(_15){return this.variables[_15];},getVariables:function(){return this.variables;},getVariablePairs:function(){var _16=new Array();var key;var _18=this.getVariables();for(key in _18){_16[_16.length]=key+"="+_18[key];}return _16;},getSWFHTML:function(){var _19="";if(navigator.plugins&&navigator.mimeTypes&&navigator.mimeTypes.length){if(this.getAttribute("doExpressInstall")){this.addVariable("MMplayerType","PlugIn");this.setAttribute("swf",this.xiSWFPath);}_19="<embed type=\"application/x-shockwave-flash\" src=\""+this.getAttribute("swf")+"\" width=\""+this.getAttribute("width")+"\" height=\""+this.getAttribute("height")+"\" style=\""+this.getAttribute("style")+"\"";_19+=" id=\""+this.getAttribute("id")+"\" name=\""+this.getAttribute("id")+"\" ";var _1a=this.getParams();for(var key in _1a){_19+=[key]+"=\""+_1a[key]+"\" ";}var _1c=this.getVariablePairs().join("&");if(_1c.length>0){_19+="flashvars=\""+_1c+"\"";}_19+="/>";}else{if(this.getAttribute("doExpressInstall")){this.addVariable("MMplayerType","ActiveX");this.setAttribute("swf",this.xiSWFPath);}_19="<object id=\""+this.getAttribute("id")+"\" classid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\" width=\""+this.getAttribute("width")+"\" height=\""+this.getAttribute("height")+"\" style=\""+this.getAttribute("style")+"\">";_19+="<param name=\"movie\" value=\""+this.getAttribute("swf")+"\" />";var _1d=this.getParams();for(var key in _1d){_19+="<param name=\""+key+"\" value=\""+_1d[key]+"\" />";}var _1f=this.getVariablePairs().join("&");if(_1f.length>0){_19+="<param name=\"flashvars\" value=\""+_1f+"\" />";}_19+="</object>";}return _19;},write:function(_20){if(this.getAttribute("useExpressInstall")){var _21=new deconcept.PlayerVersion([6,0,65]);if(this.installedVer.versionIsValid(_21)&&!this.installedVer.versionIsValid(this.getAttribute("version"))){this.setAttribute("doExpressInstall",true);this.addVariable("MMredirectURL",escape(this.getAttribute("xiRedirectUrl")));document.title=document.title.slice(0,47)+" - Flash Player Installation";this.addVariable("MMdoctitle",document.title);}}if(this.skipDetect||this.getAttribute("doExpressInstall")||this.installedVer.versionIsValid(this.getAttribute("version"))){var n=(typeof _20=="string")?document.getElementById(_20):_20;n.innerHTML=this.getSWFHTML();return true;}else{if(this.getAttribute("redirectUrl")!=""){document.location.replace(this.getAttribute("redirectUrl"));}}return false;}};deconcept.SWFObjectUtil.getPlayerVersion=function(){var _23=new deconcept.PlayerVersion([0,0,0]);if(navigator.plugins&&navigator.mimeTypes.length){var x=navigator.plugins["Shockwave Flash"];if(x&&x.description){_23=new deconcept.PlayerVersion(x.description.replace(/([a-zA-Z]|\s)+/,"").replace(/(\s+r|\s+b[0-9]+)/,".").split("."));}}else{if(navigator.userAgent&&navigator.userAgent.indexOf("Windows CE")>=0){var axo=1;var _26=3;while(axo){try{_26++;axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash."+_26);_23=new deconcept.PlayerVersion([_26,0,0]);}catch(e){axo=null;}}}else{try{var axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");}catch(e){try{var axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");_23=new deconcept.PlayerVersion([6,0,21]);axo.AllowScriptAccess="always";}catch(e){if(_23.major==6){return _23;}}try{axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash");}catch(e){}}if(axo!=null){_23=new deconcept.PlayerVersion(axo.GetVariable("$version").split(" ")[1].split(","));}}}return _23;};deconcept.PlayerVersion=function(_29){this.major=_29[0]!=null?parseInt(_29[0]):0;this.minor=_29[1]!=null?parseInt(_29[1]):0;this.rev=_29[2]!=null?parseInt(_29[2]):0;};deconcept.PlayerVersion.prototype.versionIsValid=function(fv){if(this.major<fv.major){return false;}if(this.major>fv.major){return true;}if(this.minor<fv.minor){return false;}if(this.minor>fv.minor){return true;}if(this.rev<fv.rev){return false;}return true;};deconcept.util={getRequestParameter:function(_2b){var q=document.location.search||document.location.hash;if(_2b==null){return q;}if(q){var _2d=q.substring(1).split("&");for(var i=0;i<_2d.length;i++){if(_2d[i].substring(0,_2d[i].indexOf("="))==_2b){return _2d[i].substring((_2d[i].indexOf("=")+1));}}}return "";}};deconcept.SWFObjectUtil.cleanupSWFs=function(){var _2f=document.getElementsByTagName("OBJECT");for(var i=_2f.length-1;i>=0;i--){_2f[i].style.display="none";for(var x in _2f[i]){if(typeof _2f[i][x]=="function"){_2f[i][x]=function(){};}}}};if(deconcept.SWFObject.doPrepUnload){if(!deconcept.unloadSet){deconcept.SWFObjectUtil.prepUnload=function(){__flash_unloadHandler=function(){};__flash_savedUnloadHandler=function(){};window.attachEvent("onunload",deconcept.SWFObjectUtil.cleanupSWFs);};window.attachEvent("onbeforeunload",deconcept.SWFObjectUtil.prepUnload);deconcept.unloadSet=true;}}if(!document.getElementById&&document.all){document.getElementById=function(id){return document.all[id];};}var getQueryParamValue=deconcept.util.getRequestParameter;var FlashObject=deconcept.SWFObject;var SWFObject=deconcept.SWFObject;


function getCookie(c_name)
{
    if (document.cookie.length > 0)
    {
        c_start = document.cookie.indexOf(c_name + "=");

        if (c_start != -1)
        {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);

            if (c_end == -1) c_end = document.cookie.length;
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
}



function changeThumbToJmol(file, type, id)
{
    switch (type) {
        case "pdb":
            document.getElementById("Jmol_pdb_thumbnail_" + id).style.display = "none"
            document.getElementById("Jmol_pdb_applet_" + id).style.display = "block"
            popInJmol('Jmol_pdb_applet_' + id, '' + file + '; cpk off; wireframe off;cartoon; color cartoon structure')
            break;
        case "cml":
            document.getElementById("Jmol_cml_thumbnail_" + id).style.display = "none"
            document.getElementById("Jmol_cml_applet_" + id).style.display = "block"
            popInJmol('Jmol_cml_applet_' + id, '' + file + '')
            break;
        case "mol":
            document.getElementById("Jmol_mol_thumbnail_" + id).style.display = "none"
            document.getElementById("Jmol_mol_applet_" + id).style.display = "block"
            popInJmol('Jmol_mol_applet_' + id, '' + file + '')
            break;
    }


}

function popInJmol(id, scr)
{

    jmolInitialize("/applets/jmol")
    jmolSetDocument(false)
    document.getElementById(id).innerHTML = jmolApplet(500, 'load' + scr)
}




