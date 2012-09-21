// requires jquery cookie plugin: $common/scripts/jquery/plugins/cookie.js
// this code enables persistent messages to retain state across pages/sessions
(function($) {
	$(document).ready(function () {
		
		$(".visible.global-message .persistent").text("Minimise this message");
	//	$(".visible.global-message a.remove").hide();
		
		$(".minimised.global-message .persistent").html("Find out more<span class='hidden'> about this message</span>");
		
		// message currently visible
		$(".visible.global-message .persistent").toggle(function() {
			hideMessage();
			$(".message-control").fadeIn("slow");
			return false;
		}, function() {
			showMessage();
			$(".message-control").fadeIn("slow");
			return false;
		});
		
		// message already minimised
		$(".minimised.global-message .persistent").toggle(function() {
			showMessage();
			$(".message-control").fadeIn("slow");
			return false;}
		, function() {
			hideMessage();
			$(".message-control").fadeIn("slow");
			return false;
		});
		$(".minimised.global-message .content h1").clone().insertAfter(".global-message .content").addClass("minimised");	
		
		function hideMessage() {
			$(".message-control").hide();
			com.nature.Cookie.set('minimised','true', 10, '/');
			$(".global-message .content").slideUp('slow', function() {
				$(".global-message").removeClass("visible");
				$(".global-message").addClass("minimised");
				$(".message-control a.remove").show();
				$(".global-message .content h1").clone().insertAfter(".global-message .content").addClass("minimised");
			});
			$(".message-control a.persistent").html("Find out more<span class='hidden'> about this message</span>");
		}

		function showMessage() {
			$(".message-control").hide();
			com.nature.Cookie.set('minimised','false', 10, '/');
			$(".global-message h1.minimised").remove();
			$(".global-message .content").slideDown('slow');
		//	$(".message-control a.remove").hide();
			$(".message-control a.persistent").text("Minimise this message");
			$(".global-message").removeClass("minimised");
			$(".global-message").addClass("visible");
		}
		
		$(".global-message .action a").click(function() {
			com.nature.Cookie.set('message','remove', 30, '/');
		});
		
		$(".global-message .h1 a").click(function() {
			com.nature.Cookie.set('message','remove', 30, '/');
		});
		
	});
}) (jQuery);