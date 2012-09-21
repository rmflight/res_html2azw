var com = com || {};
com.nature = com.nature || {};

(function($){
	com.nature.StringUtils = {
		trim: function(str) {
			if (!str) return '';
			return str.replace(/^\s+/, '').replace(/\s+$/, '');
		},
		isEmpty: function(str) {
			return this.trim(str).length == 0;
		},
		entities: function(str) {
			if (!str) return '';
			var entities = [
				['>', '&gt;'],
				['<', '&lt;'],
				['&', '&amp;']
			];
			var n = entities.length;
			while (n--) {
				if (str.indexOf(entities[n][0]) != -1) {
					str = str.replace(new RegExp(entities[n][0], 'g'), entities[n][1]);
				}
			}
			return str;
		},
		br: function(str) {
			if (!str) return '';
			if (str.indexOf('\n') != -1 || str.indexOf('\r') != -1) {
				return str.replace(/\r\n|\r|\n/g, '<br />');
			}
			return str;
		}
	};
})(jQuery);
