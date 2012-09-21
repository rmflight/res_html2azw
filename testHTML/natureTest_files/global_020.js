var com = com || {};
com.nature = com.nature || {};

(function($){
	com.nature.Broadcaster = function() {
		var listeners = {};
	
		var hasSubscribedEvents = function(ev) {
			return typeof listeners[ev] != 'undefined';
		};
	
		this.subscribe = function(ev, fn, scope) {
			if (!hasSubscribedEvents(ev)) {
				listeners[ev] = [];
			}
			listeners[ev].push({fn: fn, scope: scope || null});
		};
		this.unsubscribe = function(ev, fn, scope) {
			if (!hasSubscribedEvents(ev)) {
				return;
			}
			scope = scope || null;
			var n = listeners[ev].length;
			while (n--) {
				if (listeners[ev][n].fn == fn && listeners[ev][n].scope == scope) {
					listeners[ev].splice(n, 1);
					return;
				}
			}
		};
		this.notify = function(ev) {
			if (!hasSubscribedEvents(ev)) {
				return;
			}
			var n = listeners[ev].length;
			var args = Array.prototype.slice.call(arguments, 1);
			args.unshift(this);
			args.unshift(ev);
			while (n--) {
				listeners[ev][n].fn.apply(listeners[ev][n].scope, args);
			}
		};
		this.toString = function() {
			return '[object com.nature.Broadcaster]';
		};
	};
})(jQuery);
