

com.nature.Icb = (function($) {
	var Icb = function(id, datapack) {
		this.pm = com.nature.PageManager;
		this.isOpen = false;
		this.datapack = datapack;
		this.mediaId = id;
		this.currentversion = 112;
		this.enabled = this.isPluginEnabled();
		this.$content;
		this.$container;
		this.$icbObj;
		this.lastLeft, this.lastTop;
		this.dimensions = {
			smallWidth: $("#content").width(),
			smallHeight: (this.enabled && this.currentversion > 0) ? 400 : 70,
			largeWidth: $("#constrain").width(),
			largeHeight: 700
		}
		this.status = "";
	};
	Icb.prototype = {
		init: function() {
			var _self = this;
			this.build();
						
			//Attach events to the links
			$("span[class^=icb-" + this.mediaId.match(/\d+/)[0] + "-]").each(function() {
				$span = $(this);
				$span.linkify();		
				$span.find("a").click(function(e) {
					_self.show($(this));
				});
			});
		},
		build: function() {
			var _self = this;
			
			//Build up container and append
			var _container = "<div id='icb-container-" + this.mediaId + "' class='popup box icb-box'>";
			_container += "<div class='title-bar cleared'>";
			_container += "<button class='close'>close</button>";
			if(this.enabled && this.currentversion > 0) _container += "<button class='grow'>Enlarge</button>";
			if(this.enabled && this.currentversion > 0) _container += "<button class='shrink' style='display:none;'>Shrink</button></div>";
			_container += "<div class='arrow arrow-bottom'></div>";
			_container += "<div class='popup-content'></div></div>";
			$("body").append(_container);
			
			this.$container = $("#icb-container-" + this.mediaId);
		    this.$content = this.$container.find(".popup-content");

			//Attach close event
			this.$container.find("button.close").click(function() {
				_self.hide();
			});
			this.$container.find("button.grow").click(function() {
				_self.grow();
			});
			this.$container.find("button.shrink").click(function() {
				_self.shrink();
			});

		},
		show: function($trigger) {
			var _self = this;

            if (!this.icbObj) this.icbObj = document.getElementById("ActiveIcmCtl-" + this.mediaId);
            
			//Reset the popup
			this.$content.css({"width": this.dimensions.smallWidth,"height": this.dimensions.smallHeight});
			if(this.icbObj) {
				this.icbObj.width = (this.dimensions.smallWidth - 20) + 'px';
				this.icbObj.height = this.dimensions.smallHeight + 'px';
			}
			this.$container.find("button.grow").show();
			this.$container.find("button.shrink").hide();
			
			this.isOpen = true;
			this.position($trigger);
			
			//Insert datapack on first show
			if($("#ActiveIcmCtl-" + this.mediaId).size() == 0) {
			    setTimeout(function() { _self.composeICBdocument($trigger.parent().attr("class"), $trigger);},100);
		    } else {
		        this.runCommand($trigger);
		    }
		},
		runCommand: function($trigger) {
		    var _self = this;
		    if(this.icbObj) {
				//Run the command with a little delay as it locks the browser and we want the css to change above first
				//check if it's loaded else loop again
				setTimeout(function() {
					if('RunCommands' in _self.icbObj) {
						_self.icbObj.RunCommands($trigger.parent().attr("data-cmd"));            		    
					} else {
						setTimeout(arguments.callee, 200);
					}
				},100);
				this.pm.trackClick({
					action: 'iSee_view',
					source: $trigger.closest('.expanded, .collapsed').attr('id'),
					destination: $trigger.parent().attr("data-cmd")
				});
			} else {
				this.pm.trackClick({
					action: 'iSee_view',
					source: $trigger.closest('.expanded, .collapsed').attr('id'),
					destination: 'iSee download request'
				});
			}
		},
		runFirstCommand: function(trigger, mediaId) {
		    var _icbFile = document.getElementById("ActiveIcmCtl-" + mediaId);
		    var $trigger = $("." + trigger);  
		    
	    	setTimeout(function() {
    		    _icbFile.RunCommands($trigger.attr("data-cmd"));
			},100);
			    
		    com.nature.PageManager.trackClick({
				action: 'iSee_view',
				source: $trigger.closest('.expanded, .collapsed').attr('id'),
				destination: $trigger.attr("data-cmd")
			});
		},
		hide: function() {
			this.$container.css({"visibility":"hidden"});
			this.isOpen = false;
		},
		position: function($trigger) {
			var vHeight = $(window).height();
			var vWidth = $(window).width();
			var vPos,hPos;
			var left,top,width;
			var $arrow = this.$container.find(".arrow");
			($trigger.offset().top - $(document).scrollTop()) < (vHeight / 2) ? vPos = 'below' : vPos = 'above';
			($trigger.offset().left - $("#constrain").offset().left) < ($("#constrain").width() / 2) ? hPos = 'right' : hPos = 'left';
			
			left = $trigger.offset().left;
			if (hPos == 'left') {
				left -= this.dimensions.smallWidth - ($trigger.width() / 2);
				$arrow.addClass("arrow-right");
			} else {
				$arrow.removeClass("arrow-right");
			}
			this.lastLeft = left;
			top = $trigger.offset().top - this.dimensions.smallHeight - (this.$container.height() - this.$content.height()) - $trigger.height() - $arrow.height();
			if (vPos == 'below') {
				top += this.$container.height() + (3 * $arrow.height()) + $trigger.height();
				$arrow.swapClasses("arrow-bottom", "arrow-top");
			} else {
				$arrow.swapClasses("arrow-top", "arrow-bottom");
			}
			this.lastTop = top;
			width = this.$content.width();
			this.$container.css({"left": left, "top": top, "width": width, "visibility": "visible" });
		},
		grow: function() {
			newTop = this.$content.offset().top - (this.dimensions.largeHeight - this.dimensions.smallHeight) - 10;
			if (newTop < 0) newTop = 0;
			if ($(document).height() < (newTop + this.dimensions.largeHeight)) newTop = $(document).height() - this.dimensions.largeHeight;
			this.$content.css({"width": this.dimensions.largeWidth, "height": this.dimensions.largeHeight });
			this.$container.css({"top":newTop, "left": $("#constrain").offset().left - 10, "width": this.$content.width()});
			this.icbObj.width = (this.dimensions.largeWidth - 20) + 'px';
			this.icbObj.height = this.dimensions.largeHeight + 'px';
			this.$container.find("button.grow").hide();
			this.$container.find("button.shrink").show();
		},
		shrink: function() {
			this.$content.css({"width": this.dimensions.smallWidth, "height": this.dimensions.smallHeight });
			this.$container.css({"top":this.lastTop, "left": this.lastLeft, "width": this.$content.width()});
			this.icbObj.width = (this.dimensions.smallWidth - 20) + 'px';
			this.icbObj.height = this.dimensions.smallHeight + 'px';
			this.$container.find("button.grow").show();
			this.$container.find("button.shrink").hide();
		},
		composeICBdocument: function(triggerClass, $trigger) {
			if (this.enabled && this.currentversion > 0) {
            	this.insertDatapackObject(triggerClass);
            } else if(this.enabled && !this.currentversion && navigator.userAgent.indexOf("Safari") != -1) {
                this.$content.html("<p>You appear to have installed the Molsoft plugin but are running Safari in 64-bit mode which is not supported. Please run Safari in 32-bit mode as <a href='http://www.molsoft.com/install-acticm-mac.html'>detailed here</a> and reload the page.</p>")
			} else {
				this.$content.html("<p>In order to view this media you need to download the ActiveICM plugin from the <a href='http://www.molsoft.com/getbrowser.cgi?product=activeicm&act=list'>MolSoft downloads page</a> and restart your browser.</p><p>Please Note: this plugin may not work for versions of Mac OS X before 10.6</p>");
		    	this.pm.trackClick({
    				action: 'iSee_view',
    				source: $trigger.closest('.expanded, .collapsed').attr('id'),
    				destination: 'iSee download request'
    			});
			}
		},
		isPluginEnabled: function() {
		    if($.browser.msie){
				var control;
				try {
					control = new ActiveXObject('ActiveIcm.ActiveIcmCtl');
				} catch(e) {}
				if(control) {
					this.currentversion = control.pluginVersion;
				}
		        return !!control;
		    } else {
		        if (navigator.plugins && navigator.plugins.length > 0) {
		            for (i=0; i < navigator.plugins.length; i++ ) {
		                if (navigator.plugins[i].name.toLowerCase().indexOf('molsoft')!= -1){
                            var icbObjectVersion = document.createElement("div");
                            icbObjectVersion.setAttribute("style", "visibility:hidden");
                            icbObjectVersion.innerHTML = "<object id='icbObjectVersion' type='application/x-molsoft-icb' width='0%' height='0%'></object>";
                            $("body").append(icbObjectVersion);
                            this.currentversion = document.getElementById('icbObjectVersion').pluginVersion;
                            $("#icbObjectVersion").parent().remove();
		                    return true;
		                }
		            }
		        }
		        return false;
		    }
		},
		insertDatapackObject: function(triggerClass){
		    if(this.currentVersion <= 111){
		        this.$content.html('<object id="ActiveIcmCtl-' + this.mediaId + '" type="application/x-molsoft-icb" data="' + this.datapack + '" width="100%" height="100%" ></object>');
		    } else {
				this.$content.html('<object id="ActiveIcmCtl-' + this.mediaId + '" type="application/x-molsoft-icb" width="' + this.dimensions.smallWidth + '" height="' + this.dimensions.smallHeight + '"><param name="projectFile" value="' + this.datapack + '" /><param name="onLoad" value="icbInit(\'' + triggerClass + '\',\'' + this.mediaId + '\')"</object>');
		    }
		    this.icbObj = document.getElementById("ActiveIcmCtl-" + this.mediaId);
		},
		detectOS: function(){
		    var os = "other";
		    var userAgent = navigator.userAgent.toLowerCase();
		    if(userAgent.indexOf("windows") != -1){
		        os = "windows";
		    }
		    if(userAgent.indexOf("mac") != -1){
		        os = "mac";
		    }
		    if(userAgent.indexOf("linux") != -1){
		        os = "linux";
		    }
		    return os;
		}	
	};
	return Icb;
})(jQuery);
		