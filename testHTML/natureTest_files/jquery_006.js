(function($) {

	var PlainTextParser = function() { };
	PlainTextParser.prototype = {
		parse: function(txt) {
			var str = com.nature.StringUtils;
			return '<p>' + str.br(str.entities(txt)) + '</p>';
		}
	};
	var TextileParser = function() { };
	TextileParser.prototype = {
		parse: function(txt) {
			/*
		 	 * This function is based on work by Jeff Minard at http://www.creatimation.net/
			 * which was itself originally from Stuart Langridge at http://www.kryogenix.org/
		 	 */
			
			if (!txt) return '';
			txt = com.nature.StringUtils.entities(txt);
			
			var re;
			if (txt.indexOf('*')) {
				re = new RegExp('\\*([^ ][^\\r\\n]*?)\\*', 'g');
				txt = txt.replace(re, '<b>$1</b>');
			}
			if (txt.indexOf('_') != -1) {
				re = new RegExp('_(.+?)_', 'g');
				txt = txt.replace(re, '<i>$1</i>');
			}
			if (txt.indexOf('~') != -1) {
				re = new RegExp('~([^ ][^\\r\\n]*?)~', 'g');
				txt = txt.replace(re, '<sub>$1</sub>');
			}
			if (txt.indexOf('^') != -1) {
				re = new RegExp('\\^([^ ][^\\r\\n]*?)\\^', 'g');
				txt = txt.replace(re, '<sup>$1</sup>');
			}
			// links
			if (txt.indexOf('"') != -1) {
				re = new RegExp('"\\b(.+?)\\(\\b(.+?)\\b\\)":([^\\s]+)', 'g');
				txt = txt.replace(re, '<a href="$3" title="$2">$1</a>');
				re = new RegExp('"\\b(.+?)\\b":([^\\s]+)', 'g');
				txt = txt.replace(re, '<a href="$2">$1</a>');
			}
			if (txt.indexOf('\n') != -1) {
				re = new RegExp('(.*)\n([^#\*\n].*)', 'gi');
				txt = txt.replace(re, '$1<br />$2');
				re = new RegExp('\n*<br */>', 'gi');
				txt = txt.replace(re, '\n');
			}
			
			var lines = txt.split('\n');
			var l = lines.length;
			for (var i = 0; i < l; ++i) {
				var line = lines[i].replace(/\s*$/, '');
				var changed = false;
				if (line.search(/^\s*bq\.\s+/) != -1) { 
					line = line.replace(/^\s*bq\.\s+/,'\t<blockquote>') + '</blockquote>';
					changed = true; 
				}
				if (line.search(/^\s*\*\s+/) != -1) {
					line = line.replace(/^\s*\*\s+/, '\t<liu>') + '</liu>';
					changed = true;
				}
				if (line.search(/^\s*#\s+/) != -1) {
					line = line.replace(/^\s*#\s+/, '\t<lio>') + '</lio>';
					changed = true;
				}
				if (!changed && (line.replace(/\s/g,'').length > 0)) {
					line = '<p>' + line + '</p>';
				}
				lines[i] = line + '\n';
			}

			var inlist = false; 
			var listtype = '';
			for (var i = 0; i < l; ++i) {
				line = lines[i];
				if (inlist && listtype == 'ul' && !line.match(/^\t<liu/)) {
					line = '</ul>\n' + line;
					inlist = false;
				}
				if (inlist && listtype == 'ol' && !line.match(/^\t<lio/)) {
					line = '</ol>\n' + line;
					inlist = false;
				}
				if (!inlist && line.match(/^\t<liu/)) {
					line = '<ul>' + line;
					inlist = true;
					listtype = 'ul';
				}
				if (!inlist && line.match(/^\t<lio/)) {
					line = '<ol>' + line;
					inlist = true;
					listtype = 'ol';
				}
				lines[i] = line;
			}

			txt = lines.join('\n');
			txt = txt.replace(/li[o|u]>/g, 'li>');
			
			return txt;
		}
	};
	
	$.fn.preview = function(target, mode) {
		var getParser = function(mode) {
			switch (mode) {
				case 'textile':
					return new TextileParser();
				default:
					return new PlainTextParser();
			}
		};
		var update = function(force) {
			var tmp = this.val();
			if (tmp == text && !force) {
				return;
			}
			el.html(parser.parse(tmp));
			text = tmp;
		};

		var el = (typeof target == 'string') ? $(target) : target;
		var parser = getParser(mode);
		var updater = null;
		var self = this;
		var text = this.val();

		this.bind('focus', function() {
			updater = setInterval(function() {
				update.call(self);
			}, 200);
		});
		this.bind('blur', function() {
			clearInterval(updater);
			update.call(self);
		});
		update.call(this, true);
		
		return this;
	};
 	
})(jQuery);
