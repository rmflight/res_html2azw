
(function($) {
	
	$.fn.ellipsis = function(ellipsis) {
		// helper class for truncating html text
		var HtmlString = function(txt) {
			this.IS_TEXT_NODE = 0;
			this.IS_START_ELEMENT_NODE = 1;
			this.IS_END_ELEMENT_NODE = 2;
			this.IS_ATTRIBUTE_NODE = 3;
			this.stack = this._parse(txt);
		};
		HtmlString.prototype = {
			hasText: function() {
				for (var i = 0; this.stack[i]; ++i) {
					if (this.stack[i].type == this.IS_TEXT_NODE && this.stack[i].content.length > 0) {
						return true;
					}
				}
				return false;
			},
			truncate: function(ellipsis) {
				var n = this._findLastTextNode();
				if (n == -1) {
					return '';
				}

				this.stack[n].content = this.stack[n].content.substr(0, this.stack[n].content.length - 1);
				if (this.stack[n].content.length == 0) {
					var prev = null;
					// if the parent of the text is now empty remove it
					if (n > 0 && this.stack[n].depth == this.stack[n - 1].depth) {
						this.stack.splice(n - 1, 3);
						prev = n - 2;
					} else { // otherwise, just remove the text node
						this.stack.splice(n, 1);
						prev = n - 1;
					}
					// clean out any nodes that are now empty due to removing this section
					while (this.stack[prev] && this.stack[prev + 1]) {
						if (this.stack[prev].type == this.IS_START_ELEMENT_NODE && this.stack[prev + 1].type == this.IS_END_ELEMENT_NODE) {
							this.stack.splice(prev, 2);
							--prev;
						} else {
							break;
						}
					}
				}
				var str = '';
				var len = this.stack.length;
				var j = this._findLastTextNode();
				for (var i = 0; i < len; ++i) {
					str += this.stack[i].content;
					if (i == j) {
						str = str.replace(/\s+$/, '');
						str += ellipsis;
					}
				}
				return str;
			},
			_parse: function(txt) {
				var state = this.IS_TEXT_NODE;
				var block = '';
				var depth = 0;
				var stack = [];
				var quote = '';

				var len = txt.length;
				for (var i = 0; i < len; ++i) {
					var ch = txt.substr(i, 1);
					if (state == this.IS_START_ELEMENT_NODE) {
						block += ch;
						if (ch == '>') {
							stack.push({content: block, depth: depth, type: state});
							block = '';
							state = this.IS_TEXT_NODE;
						} else if (ch == '"' || ch == "'") {
							quote = ch;
							state = this.IS_ATTRIBUTE_NODE;
						}
					} else if (state == this.IS_ATTRIBUTE_NODE) {
						block += ch;
						if (ch == quote) {
							state = this.IS_START_ELEMENT_NODE;
						}
					} else if (state == this.IS_TEXT_NODE) {
						if (ch == '<') {
							if (block != '') {
								stack.push({content: block, depth: depth, type: state});
							}

							block = '<';
							if (txt.substr(i + 1, 1) == '/') {
								state = this.IS_END_ELEMENT_NODE
							} else {
								state = this.IS_START_ELEMENT_NODE;
								++depth;
							}
						} else {
							block += ch;
						}
					} else if (state == this.IS_END_ELEMENT_NODE) {
						block += ch;
						if (ch == '>') {
							stack.push({content: block, depth: depth, type: state});
							block = '';
							state = this.IS_TEXT_NODE;
							--depth;
						}
					}
				}
				if (block != '') {
					stack.push({content: block, depth: depth, type: state});
				}
				return stack;
			},
			_findLastTextNode: function() {
				var n = this.stack.length;
				while (n--) {
					if (this.stack[n].type == this.IS_TEXT_NODE) {
						return n;
					}
				}
				return -1;
			}
		};
		
		
		var s = document.documentElement.style;
		var ellipsis = ellipsis || '...';
		if ('textOverflow' in s || 'OTextOverflow' in s) {
			// native support
			return this;
		}
		return this.each(function() {
			var el = $(this);
			if (el.css('overflow') == 'hidden') {
				// create a hidden copy of the node to see how much text will fit
				var tmp = $(this.cloneNode(true)).css({
					position: 'absolute', 
					visibility: 'hidden',
					width: 'auto',
					overflow: 'visible'
				});
				el.after(tmp);
				
				var text = el.html();
				var txt = new HtmlString(text);
				var w = el.width();
				while (txt.hasText() && tmp.width() > w) {
					tmp.html(txt.truncate(ellipsis));
				}
				el.html(tmp.html());
				tmp.remove();	
			}
		});
	};
	
})(jQuery);
