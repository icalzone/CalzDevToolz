/*
 * @projectDescription manipulates the extension canvas element (creates or updates it) 
 *
 * @author Frantisek Musil - frantisek.musil@wips.cz
 * @version 1.0
 *
 */

var Canvas = (function () {

    /* 
     * Creates the canvas element, sets its attributes and appends it to the wrapper
     *
     * @param { string }
     * @return none
     *
     */
	var create = function ( imageURL ) {

        // Create canvas element with DOM attributes
        var $canvas = $("<canvas></canvas>")
        $canvas.attr({
            "id" : "canvas",
            "class" : "canvas",
            "height" : $(window).height(),
            "width" : $(window).width()
        });

     	// Apend canvas to the end of body element
        $("#canvas-wrapper").append($canvas);

        // Update canvas content
        update(imageURL);

	};

    /* 
     * Creates the canvas element, sets its attributes and appends it to the wrapper
     *
     * @param { string }
     * @return none
     *
     */
	var update = function ( imageURL ) {

		// Create screenshot image
		var image = new Image();
        image.src = imageURL;

        // Set position and height of the canvas wrapper element
        $("#canvas-wrapper").css({
            "top" : window.pageYOffset + "px",
            "height" : ($(window).height() - 35) + "px"
        });

        // Draw image onto the canvas
        var ctx = document.getElementById("canvas").getContext("2d");
        ctx.drawImage(image, 0, 0);

        console.log($("#canvas").height() - 35)

        $(".wdt-overlay").show();

        Module.addModuleListener(Module.getCurrentModule());
        
	};

	return {

		create : create,
		update : update
	}

})();