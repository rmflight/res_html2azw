com.nature.DraggablePopup = (function($) {
	var DraggablePopup = function(dragEl, handle_selector, options){
		var defaults = {};
		// merge in any options
		options = $.extend(defaults, options);
		for (var prop in options) {
			this['_' + prop] = options[prop];
		}
		this._handle_selector = handle_selector;
	}
	DraggablePopup.prototype = {
		attachDrag: function(dragEl, handle) {
			this._dragEl = document.getElementById(dragEl);
			if(handle)
				this._handle = handle;
			else
				this._handle = this._dragEl;

		    $(this._handle).hitch('mousedown', function(e){
				this.dragBegin(e);
				return false;
			}, this);
		    this._dragEl.style.left = $(this._dragEl).position().left+'px';
		    this._dragEl.style.top = $(this._dragEl).position().top+'px';
		},
		dragBegin: function(e) {
		    this._dragEl.mouseX = e.clientX;
		    this._dragEl.mouseY = e.clientY;
		    $(document.body).hitch('mousemove.modal', function(e){
				this.drag(e);
				return false;
			}, this);
		    $(document.body).hitch('mouseup.modal', function(e){
				this.dragEnd();
			}, this);
		},
		drag: function(e) {
		    var x = parseInt(this._dragEl.style.left),
		        y = parseInt(this._dragEl.style.top);
    
		    this._dragEl.style.left = x + e.clientX - this._dragEl.mouseX + 'px';
		    this._dragEl.style.top = y + e.clientY - this._dragEl.mouseY + 'px';
		    this._dragEl.mouseX = e.clientX;
		    this._dragEl.mouseY = e.clientY;
		},
		
		pos: function(e) {
        		var dialogTop  = ($(window).height() - this._$popup.height())/2 + $(window).scrollTop();  
    			var dialogLeft = ($(window).width() - this._$popup.width())/2;
				this._$popup.css({
					top: dialogTop,
					left: dialogLeft
				});
				
		},
		onOpen: function(ev, popup) {
			if(!this._dragEl){
				var drag_id = 'drag-'+this.id,
					drag_str = '<span class="drag" id="'+drag_id+'">Drag</span>';
				
				if (this._hasTitle || this._hasCloseButton) {
					$(popup._$popup).find('.title-bar').prepend(drag_str);
				} else {
					$(popup._$popup).prepend(drag_str);
				}
				this.attachDrag(this.id, $(popup._$popup).find(this._handle_selector));
			}
		},
		dragEnd: function() {
		    var x = parseInt(this._dragEl.style.left),
		        y = parseInt(this._dragEl.style.top);
    
		    $(document.body).unbind('mousemove.modal');
		    $(document.body).unbind('mouseup.modal');
		}
	}
	return DraggablePopup;
})(jQuery);
