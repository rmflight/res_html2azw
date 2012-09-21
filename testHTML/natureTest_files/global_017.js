var com = com || {};
com.nature = com.nature || {};

(function($){
	com.nature.Cookie = {
		set: function(name, value, days, path) {
			var params = [name + '=' + value];
			if (days) {
				var d = new Date();
				d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
				params.push('expires=' + d.toGMTString());
			}
			if (path) {
				params.push('path=' + path);
			}
			document.cookie = params.join(';');
		},
		get: function(name) {
			if (name) {
				var regex = new RegExp('(^|;| )' + name + '=([^;]*)', 'ig');
				var match = regex.exec(document.cookie);		
				if (match) {
					return match[2];
				}
				return false;
			}
		},
		raw: function() {
			return document.cookie;
		},
		remove: function(name) {
			for (var i = 0; arguments[i]; ++i) {
				this.set(arguments[i], '', -1);
			}
		}
	};
})(jQuery);
