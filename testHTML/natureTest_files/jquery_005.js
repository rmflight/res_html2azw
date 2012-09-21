(function($) {
	$.fn.initPlaceholders = function() {
		var init, clear, $inputs;
	
		if ('placeholder' in document.createElement('input')) {
			return this;
		}
	
		init = function($el) {
			if (!$el.val().replace(/[\s]+/, '').length) {
				$el.val($el.attr('placeholder'));
				$el.addClass('placeholder');
			}
		};
		clear = function($el) {
			if ($el.val() == $el.attr('placeholder')) {
				$el.val('');
				$el.removeClass('placeholder');
			}
		};
		$inputs = this.find('input[placeholder]');

		$inputs.focus(function() {
			clear($(this));
		}).blur(function() {
			init($(this))
		}).each(function() {
			init($(this));
		});
		this.submit(function() {
			$inputs.each(function() {
				clear($(this));
			});
			setTimeout(function() {
				$inputs.each(function() {
					init($(this));
				});
			}, 100);
		});
		return this;
	};
})(jQuery);