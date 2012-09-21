
var com = com || {};
com.nature = com.nature || {};

// see http://www.useragentman.com/blog/2009/11/29/how-to-detect-font-smoothing-using-javascript/
com.nature.TypeHelper = (function($) {

    var TypeHelper = {
        hasSmoothing: function() {
            var canvas, ctx, pixel;
        
            if (typeof screen.fontSmoothingEnabled != 'undefined') {
                return screen.fontSmoothingEnabled;
            }
            try {
                canvas = document.createElement('canvas');
                canvas.width = '35';
                canvas.height = '35';
                canvas.style.display = 'none';
                document.body.appendChild(canvas);
                
                ctx = canvas.getContext('2d');
                ctx.textBaseline = 'top';
                ctx.font = '32px Arial';
                ctx.fillStyle = 'black';
                ctx.strokeStyle = 'black';
                ctx.fillText('O', 0, 0);
                
                for (var j = 8; j < 33; ++j) {
                    for (var i = 1; i < 33; ++i) {
                        pixel = ctx.getImageData(i, j, 1, 1).data;
                        if (pixel[3] != 255 && pixel[3] != 0) {
                            return true;
                        }
                    }
                }
                return false;
            } catch (e) {
                return null;
            }
        }
    };
    return TypeHelper;

})(jQuery);