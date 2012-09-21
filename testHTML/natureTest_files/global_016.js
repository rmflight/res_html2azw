var com = com || {};
com.nature = com.nature || {};

(function($){
	// check if a css feature is implemented
	com.nature.Css = {
		isImplemented: function(prop) {
			// create a fake element to test the style on
			var d = document.createElement('div');
			if (!d.style) return false;
			// is the property supported?
			if (typeof d.style[prop] == 'string') return true;

			// if not, is it supported with a vendor prefix?
			var prefixes = ['Ms', 'Moz', 'Webkit', 'O', 'Khtml'];
			var n = prefixes.length;
			prop = prop.substr(0, 1).toUpperCase() + prop.substring(1);
			while (n--) {
				if (typeof d.style[prefixes[n] + prop] == 'string') {
					return true;
				}
			}
			return false;
		}
	};	
})(jQuery);