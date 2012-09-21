var com = com || {};
com.nature = com.nature || {};

(function($){
	com.nature.Configuration = {
		_data: {},
	
		//Add only, prevents accidental overwriting unless explicitly using change()
		add: function(data) {
			var that = this;
			jQuery.each(data, function(k, v) {
				if (!that._data[k] && v != "") {
					that._data[k] = v;
				}
			});
		},
		//Update a declared config setting, assume add if it's not set for some reason
		change: function(data) {
			var that = this;
			jQuery.each(data, function(k, v) {
				that._data[k] = v;
			});
		},
		//Remove a stored setting if you ever need to
		remove: function(name) {
			if (this._data[name]) {
				delete this._data[name];
			}
		},
		get: function(name) {
			return this._data[name] || false;
		}
	};	
})(jQuery);