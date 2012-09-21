(function($){
	$(function() {
		if($(".deep-dyve").length != 0){
			var source = $(".deep-dyve a").attr("href");
			source = source.replace("doc-view", "rental-link")
		     $.getJSON(source+"&format=jsonp&callback=?", function(data) {
		         if (data.status === 'ok') {
		            $(".deep-dyve a").attr("href", data.url);
		            $(".deep-dyve a").text('Rent for $' + data.price + ' at DeepDyve');
					$(".deep-dyve").css("display","inline");
		         }
		     });
		}
	});
})(jQuery);
