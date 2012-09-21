/* Include this to have mathjax initiated
* call on onload to perform decoding of element tags
* get mathjax element 
* parse thru the element and replace the encoded elements with element tags
*/

$(document).ready(function() {
	/* Call decoding for MathJAX */
	decodeMathML();
	$(".mathjax").parent(".disp-formula").addClass("mj")
});

function decodeMathML() {
//alert('decodeMathML: ');
	// MathJAX requires the namespace be defined on the <html> element and nowhere else. Annoying.
	$("html").attr("xmlns:mml", "http://www.w3.org/1998/Math/MathML");
   
    var mjcode = $(".mathjax.mml-math code.mathjax-code");
    if(mjcode.length) {
       for(var i=0; i<mjcode.length; i++) {
           var codetxt = mjcode.eq(i).text();
           mjcode.eq(i).parent("span").html(codetxt.replace(/&lt;/,'<').replace(/&gt;/,'>'));
       }
    }

    $(".mathjax.mml-math").show();
}
