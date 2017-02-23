/*
 * @projectDescription adds color picker module content and behaviour
 *
 * @author Frantisek Musil - frantisek.musil@wips.com
 * @version 1.0
 *
 */

var ColorPicker = (function () {

	/* 
     * Adds module content
     *
     * @param none
     * @return none
     *
     */
	var _addContent = function () {

		$("#module-content").html( '' +
		'<div class="wdt-color-picker wdt-module" id="color-picker">' +
			'<div class="wdt-icon">' +
				'<span class="wdt-module-name">Color picker</span>' +
			'</div>' +
			'<div class="wdt-content">' +
				'<div class="wdt-color-type wdt-current-color">' +
					'<span id="current-color-thumbnail" class="wdt-thumbnail"></span>' +
					'<span id="current-color-hex" class="wdt-hex">Current color</span>' +
				'</div>' +
				'<div class="wdt-color-type wdt-saved-color">' +
					'<span id="saved-color-thumbnail" class="wdt-thumbnail"></span>' +
					'<span id="saved-color-hex" class="wdt-hex">Saved color</span>' +
				'</div>' +
			'</div>' +
		'</div>');

	};

  	/* 
     * Adds mousemove and click events to the canvas element
     *
     * @param none
     * @return none
     *
     */
	var _addListener = function () {

		// Save current context to variable
		var ctx = document.getElementById("canvas").getContext("2d");

		// Attach mousemove event listner to the element
		$("#canvas").on("mousemove", function () { _pickCurrentColor(ctx) });

		// Attach event listeners to canvas element
		$("#canvas").on("click", _savePickedColor);

	};

	var _pickCurrentColor = function ( ctx ) {

			// Get data at current mouse position relatively to window offset position
			var colors = ctx.getImageData($(event).get(0).pageX, ($(event).get(0).pageY - window.pageYOffset), 1, 1).data;

			// Update thumbnail background color to color at current mouse position
			$("#current-color-thumbnail").css("background-color", "rgb(" + colors[0] + "," + colors[1] + "," + colors[2] + ")");

			// Update text to hex at current mouse position
			$("#current-color-hex").text("#" + _rgbToHex([colors[0], colors[1], colors[2]]));

	};

	var _savePickedColor = function () {

		// Set color of saved thumbnail to current mouse position
		$("#saved-color-thumbnail").css("background-color", $("#current-color-hex").text());

		// Set text saved color hex to current mouse position
		$("#saved-color-hex").text($("#current-color-hex").text());

		// Send message to copy text at #saved-color-text
		Message.send({

			behaviour : "copy",
			text : $("#saved-color-hex").text()

		});

	}

	/* 
     * Converts RGB color to hex
     *
     * Resource : http://www.javascripter.net/faq/rgbtohex.htm
     *
     * @param { array }
     * @return { string }
     *
     */
	var _rgbToHex = function ( rgb ) {

		var hex = "";

		for(var i = 0; i < 3; i++){

			var a = parseInt(rgb[i], 10);
			a = Math.max(0, Math.min(a, 255));
			hex += "0123456789ABCDEF".charAt((a-a%16)/16) + "0123456789ABCDEF".charAt(a%16);

		}

		return hex;

  	};

  	/* 
     * Remove all module event listeners (those are usually located in the module's addListener function)
     *
     * @param none
     * @return none
     *
     */
	var removeListener = function () {

		$("#canvas").off("mousemove");

		$("#canvas").off("click");

	};

	/* 
     * Initializes color picker module
     *
     * @param none
     * @return none
     *
     */
	var init = function () {

		Content.showCanvas();

		// Add module content
		_addContent();

		// Add module's event listeners
		_addListener();

	};

	return {

		init : init,
		removeListener : removeListener

	}

})();