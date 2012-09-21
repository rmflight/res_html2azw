var com = com || {};
com.nature = com.nature || {};

com.nature.Truncator = (function($) {
	
	var openTags = [];
	var closedTags = [];
	var selfClosingTags = {img: true, br: true,	hr: true};
	
	// we don't need an ellipsis if our selection reached the end of the content
	var reachedStart = false;
	var reachedEnd = false;
	
	var getLeading = function(context, pos, chars) {
		var inOpenTag = false;
		var inCloseTag = false;
		var inAttr = false;
		var inEntity = false;

		var out = [];
		var keepLooking = true;
		
		while (pos > -1 && keepLooking) {
			var c = context.charAt(pos);
			
			// working backwards...
			if (c == '>') {
				var tag = context.substring(context.lastIndexOf('<', pos), pos + 1).toLowerCase();
				var parts = /<\s*(\/)?([^\s>]+)/.exec(tag);
				
				var isCloseTag = !!parts[1];
				var tagName = parts[2];
				
				if (!isCloseTag) {
					if (closedTags.length) {
						closedTags.pop();
					} else {
						if (!(tagName in selfClosingTags)) {
							openTags.unshift(tagName);
						}
					}
					inOpenTag = true;
				} else {
					closedTags.push(tagName);
					inCloseTag = true;
				}
			} else if (c == '<') {
				inOpenTag = false;
				inCloseTag = false;
			} else if (c == '"' && inOpenTag && !inAttr) {
				inAttr = true;
			} else if (c == '"' && inOpenTag && inAttr) {
				inAttr = false;
			} else if (c == '&' && inEntity) {
				inEntity = false;
			} else if (!inOpenTag && !inCloseTag && !inAttr && !inEntity) {
				if (c == ';' && pos > 0) {
					var entity = context.substring(context.lastIndexOf('&', pos), pos + 1);
					if(entity.match(/^&[#0-9a-z]+;$/)) {
						inEntity = true;
					}
				}
				
				if (chars) {
					--chars;
					if (chars == 0) {
						keepLooking = false;
					}
				} else {
					if (c == '.') {
						if (pos > 2) {
							var prev = context.substring(0, pos);
							if (!prev.match(/((et al(<\/i>)?)|(fig)|(ref))$/i)) {
								keepLooking = false;
							}
						} else {
							keepLooking = false;
						}
					} else if (c == '!' || c == '?') {
						keepLooking = false;
					}
				}
			}
			out.unshift(c);
			--pos;
		}
		if (keepLooking) {
			reachedStart = true;
		}
		if (out[0] == '.' || out[0] == '?' || out[0] == '!') {
			out.shift();
		}
		return out.join('');
	};
	
	var getTrailing = function(context, pos, chars) {
		var inOpenTag = false;
		var inCloseTag = false;
		var inAttr = false;
		var inEntity = false;
		
		var out = [];
		var len = context.length;
		
		var keepLooking = true;
		while (pos < len && keepLooking) {
			var c = context.charAt(pos);
			
			if (c == '<') {
				var tag = context.substring(pos, context.indexOf('>', pos) + 1).toLowerCase();
				var parts = /<\s*(\/)?([^\s>]+)/.exec(tag);
				
				var isCloseTag = !!parts[1];
				var tagName = parts[2];
				
				if (isCloseTag) {
					if (openTags.length) {
						openTags.pop();
					} else {
						closedTags.unshift(tagName);
					}
					inCloseTag = true;
				} else {
					if (!(tagName in selfClosingTags)) {
						openTags.push(tagName);
					}
					inOpenTag = true;
				}
			} else if (c == '>') {
				inOpenTag = false;
				inCloseTag = false;
			} else if (c == '"' && inOpenTag && !inAttr) {
				inAttr = true;
			} else if (c == '"' && inOpenTag && inAttr) {
				inAttr = false;
			} else if (c == ';' && inEntity) {
				inEntity = false;
			} else if (!inOpenTag && !inCloseTag && !inAttr && !inEntity) {
				if (c == '&') {
					inEntity = true;
				}
				if (chars) {
					--chars;
					if (chars == 0) {
						keepLooking = false;
					}
				} else {
					if (c == '.') {
						if (pos > 2) {
							var prev = context.substring(0, pos);
							if (!prev.match(/((et al(<\/i>)?)|(fig)|(ref))$/i)) {
								keepLooking = false;
							}
						} else {
							keepLooking = false;
						}
					} else if (c == '!' || c == '?') {
						keepLooking = false;
					}
				}
			}
			out.push(c);
			++pos;
		}
		var n = out.length - 1;
		if (out[n] == '.' || out[n] == '?' || out[n] == '!') {
			out.pop();
		}
		if (keepLooking) {
			reachedEnd = true;
		}
		return out.join('');
	};
	
	var getContextSnippet = function($haystack, $needle, chars) {
		openTags = [];
		closedTags = [];
		reachedStart = false;
		reachedEnd = false;
		
		if (typeof chars == 'undefined') {
			chars = null;
		}
		
		var needle = $needle.html();
		$needle.html('__' + needle + '__');
		var haystack = $haystack.html();
		$needle.html(needle);
		
		var pos = haystack.indexOf('__' + needle + '__') - 1;
		var leading = getLeading(haystack, pos, chars);
		var trailing = getTrailing(haystack, pos + needle.length + 5, chars);

		var txt = '';
		if (closedTags.length) {
		 	txt = '<' + closedTags.join('><') + '>';
		}
		txt += leading;
		txt += needle;
		txt += trailing;
		if (openTags.length) {
			txt += '</' + openTags.reverse().join('></') + '>'; 
		}
		
		if (!reachedStart) {
			txt = txt.replace(/^((\s*<[^>]+>\s*)*)/i, '$1&hellip;');
		}
		if (!reachedEnd) {
			txt = txt.replace(/((\s*<\/[^>]+>\s*)*)$/i, '&hellip;$1');
		}
		return txt;
	};
	var truncate = function(str, chars) {
		openTags = [];
		closedTags = [];
		reachedStart = false;
		reachedEnd = false;
		
		if (str.length <= chars) {
			return str;
		}
		var txt = getTrailing(str, 0, chars);
		if (openTags.length) {
			txt += '</' + openTags.reverse().join('></') + '>'; 
		}	
		if (!reachedEnd) {
			txt = txt.replace(/((\s*<\/[^>]+>\s*)*)$/i, '&hellip;$1');
		}
		return txt;
	};
	
	return {
		truncate: truncate,
		getContextSnippet: getContextSnippet,
		toString: function() {
			return '[object com.nature.Truncator]';
		}
	};
	
})(jQuery);
