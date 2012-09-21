
(function($) {

	$.fn.colorFade = function(props, options) {
		var getRGB = function(colour) {
			var bits;
			if (bits = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(colour)) {
				return [parseInt(bits[1], 16), parseInt(bits[2], 16), parseInt(bits[3], 16)];
			}
			if (bits = /^#?([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec(colour)) {
				return [parseInt(bits[1] + bits[1], 16), parseInt(bits[2] + bits[2], 16), parseInt(bits[3] + bits[3], 16)];
			}
			if (bits = /^rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)$/i.exec(colour)) {
				return [parseInt(bits[1], 10), parseInt(bits[2], 10), parseInt(bits[3], 10)];
			}
			return false;
		};
		
		options = options || {};
		
		var el = this;
		
		var duration = options.duration || 1000;
		var delay = options.delay || 1000;
		var iterations = duration / 20;
		
		var animations = [];
		for (var prop in props) {
			animations.push({prop: prop, from: getRGB(el.css(prop)), to: getRGB(props[prop])});
		}
		
		setTimeout(function() {
			var count = 1;
			var timer = setInterval(function() {
				for (var i = 0; animations[i]; ++i) {
					var animation = animations[i];
					if (!animation.from || !animation.to) {
						continue;
					}
					
					var colour = [
						Math.min(Math.max(parseInt(count * ((animation.to[0] - animation.from[0]) / iterations) + animation.from[0], 10), 0), 255),
						Math.min(Math.max(parseInt(count * ((animation.to[1] - animation.from[1]) / iterations) + animation.from[1], 10), 0), 255),
						Math.min(Math.max(parseInt(count * ((animation.to[2] - animation.from[2]) / iterations) + animation.from[2], 10), 0), 255)
					];
					el.css(animation.prop, 'rgb(' + colour.join(',') + ')');
				}
				if (++count > iterations) {
					clearInterval(timer);
					el.trigger('fadeComplete');
				}
			}, 20);
		}, delay);
		
		return this;
	};

})(jQuery);
