jQuery.fn.delay = function(time,func){
	this.each(function(){
		setTimeout(func,time);
	});
	
	return this;
}; 

 
				 
				
// Wait for #link to be clicked...
 $(document).ready(function () {
  if($('#content-block > div').hasClass("abstract-view") || $('#content-block > div').hasClass("extract-view"))
	 {	
	 return true;
	 }
  
  // Delay 1 second...
  $(this).delay(2000,function(){

 
$("div#content-option-box li#content-toggle a").trigger('click');
    // Then delay another 3 seconds...

  });
});