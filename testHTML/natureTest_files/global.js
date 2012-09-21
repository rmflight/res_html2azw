var com = com || {};

/** @namespace */
com.nature = com.nature || {};

	
/**
    Creates a new instance of the Bitstate class.
    This can be used to store true/false values for any configuration settings, globally or limited to a specific journal or page path.
    @constructor
    @param
    @example
    var b = new com.nature.Bitstate();
    b.init();
    
    b.isSet("highlightcompound"); //false
    b.set("highlightcompound"); //returns true
    b.isSet("highlightcompound"); //true
    b.clear("highlightcompound") //returns true
    b.isSet("highlightcompound"); //false

    b.set("bacon"); //returns false, undefined flag
*/
com.nature.Bitstate = (function($) {
    
    /**
        @ignore
    */
	var BitState = function() {
		
		this.flagmasks = {};
		this.flags;

		this.init = function() {
			//Define our flags
			//
			//Initial value is false for all flags
			//** ONLY ADD NEW FLAGS TO THE END OF THE ARRAY **
			flagNames = ["highlightcompound"];
			
			//Loop through each flag and assign its primative bitmask
			for(var i=0;i<flagNames.length;i++) {
				this.flagmasks[flagNames[i]] = Math.pow(2,i);
			}
			
			// Get the current settings of our bitstate flags - if there's a cookie present then use that, otherwise all false
			this.flags = parseInt(com.nature.Cookie.get("bitstate")) || 0x0;
		}	
	
		this.isSet = function(flag) {
			return !!(this.flags & this.flagmasks[flag]);
		}
		
		this.set = function(flag, path) {
			if (this.flagmasks[flag] && !this.isSet(flag)) {
				this.flags |= this.flagmasks[flag];
				this.save(path || '/');
			} else {
				return false;
			}
		}
		
		
        /** 
		    Clears a specified flag, thereby setting it to false
            @returns False if flag doesn't exist
            @param flag The ID of the flag to clear. This should match the defined flagNames in the init() method of this class.
            @param [path="/"] Optionally specify a URL path to limit the scope of this flag.
        */
         
		this.clear = function(flag, path) {
			if (this.flagmasks[flag]) {
				this.flags &= ~this.flagmasks[flag];
				this.save(path || '/');
			} else {
				return false;
			}
		}
		
		
        /**
            Saves the current flags to to the bitstate cookie. This is called automatically after calling set() or clear() so you shouldn't need
            to call this yourself.
            @returns {Bool} True once saved.
        */  
		this.save = function(path) {
			com.nature.Cookie.set("bitstate", this.flags, 365, path);
			return true;
		}

	};
	
	return BitState;

})(jQuery);

