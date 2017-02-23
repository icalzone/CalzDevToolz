/*
 * @projectDescription adds ruller module content and behaviour
 *
 * @author Frantisek Musil - frantisek.musil@wips.cz
 * @version 1.0
 *
 */

var Ruller = (function () {

	/* 
     * Adds module content
     *
     * @param none
     * @return none
     *
     */
	var _addContent = function () {

		$("#module-content").html( '' +
		'<div class="wdt-ruller wdt-module" id="ruller-tool">' +
			'<div class="wdt-icon">' +
				'<span class="wdt-module-name">Ruler tool</span>' +
			'</div>' +
			'<div class="wdt-content">' +
				'<span id="ruller-width"></span>' +
				'<span id="ruller-height"></span>' +
				'<span id="page-width"></span>' + 
				'<span id="page-height"></span>' + 
			'</div>' +
		'</div>');

	};

	var _addListener = function () {

		$("body").on("mousedown", _initSelection);

	};

	var _createRullerWrapper = function () {

		$wrapper = $("<div></div>");

		$wrapper.attr({
			"class" : "wdt-ruller-wrapper",
			"id" : "ruller-wrapper"
		});

		$wrapper.appendTo($("#web-developer-tools"));

	}

	var _initSelection = function () {

		if(Zoom.getZoomAmount === 0) Content.disableZoom();
		
		// Declare event variable
		var e = $(event)[0];

		// Check if #selection element is clicked and if so prevent page from any behaviour
		if($(e.toElement).attr("id") === "selection") return;

		// Check if #selection element already exists and if so remove it (new one will be created immediately)
		if($("#selection").attr("id") !== undefined) $("#selection").remove();

		$("body").addClass("disable-user-select");

		// Declare selection variable
		var $selection = $("<div></div>");

		// Declare selection's variable attributes
		$selection.attr({
			"id" : "selection",
			"class" : "selection"
		});

		// Declare selection's variable style
		$selection.css({
			"left" : e.x,
			"top" : e.y + $(window).scrollTop(),
			"height" : 0,
			"width" : 0
		});

		// Append selection to body element
		$selection.appendTo($("#web-developer-tools"));

		var startingTop = $(window).scrollTop();

		$("body").on("mousemove", function () {
			_createSelection(e.x, e.y, startingTop)
		});

		$("body").on("mouseup", _finishSelection);

		$(document).on("mouseout", _onMouseOut);

	};

	var _createSelection = function ( x, y, a ) {

		// Declare event variable
		var e = $(event)[0];

		var new_width = (e.x > x) ? e.x - x : x - e.x,
			new_height = (e.y > y) ? e.y - y : y - e.y,
			new_left = (e.x > x) ? x : e.x,
			new_top = (e.y > y) ? y + a : e.y + a;

		$("#selection").css({
			"height" : new_height,
			"width" : new_width,
			"top" : new_top,
			"left" : new_left
		});

		_updateInfo();

	}

	var _finishSelection = function () {

		$("body").off("mousemove");

		$("body").off("mouseup");

		if($("#selection").height() === 2 || $("#selection").width() === 2) $("#selection").remove();

		$(document).off("mouseout", _onMouseOut)

		if(Zoom.getZoomAmount === 0) Content.enableZoom();

		if(getNumericCSSValue("height") !== 2 && getNumericCSSValue("width") !== 2) _updateSelectionCoordinates();

	};

	var _updateSelectionCoordinates = function () {

		if($("#selection").css("top") === undefined) return;

		var dataY = parseInt($("#selection").attr("data-y")) || 0,
			dataX = parseInt($("#selection").attr("data-x")) || 0;

		var top = getNumericCSSValue("top") + dataY - $(window).scrollTop(),
			left = getNumericCSSValue("left") + dataX,
			bottom = top + getNumericCSSValue("height"),
			right = left + getNumericCSSValue("width");

		var coordinates = {

			top : top,
			left : left,
			bottom : bottom,
			right : right

		}

		Crop.setCoordinates({

			top : top,
			left : left,
			bottom : bottom,
			right : right

		})

	}

	var getNumericCSSValue = function ( value ) {

		if($("#selection").attr("id") === "selection") {

			return parseInt($("#selection").css(value).split("px")[0]);

		}
		
	}

	var _onMouseOut = function () {

	    var from = event.relatedTarget || event.toElement;

	    if (!from || from.nodeName == "HTML") {

	        _finishSelection();

	    }

	}

	var removeListener = function () {

		// Remove event listeners from #canvas-wrapper element
		$("body").off("mousedown");

		$("#ruller-wrapper").remove();

		// Remove #square element if any exists
		if($("#selection").attr("id") === "selection") $("#selection").remove();

		// Request screen shot
		if(Zoom.getZoomAmount() === 0) {

			Message.send({

				behaviour : "screenshot"

			});

		}

		Content.showCanvas();

	}

	/* 
     * Update measured information in the toolbar and count percentage according to the total width 
     * of the document
     *
     * @param none
     * @return none
     *
     */
	var _updateInfo = function () {	

		// Current selection
		var currentSelectionWidth = Math.round(Math.round($("#selection").width()) / (Math.pow(1.1, Zoom.getZoomAmount()) * 100) * 100),
			currentSelectionHeight = Math.round(Math.round($("#selection").height()) / (Math.pow(1.1, Zoom.getZoomAmount()) * 100) * 100);

		// Count percentage according to the total width of the document
		var squarePercentWidth = Math.round(currentSelectionWidth /  $(document).width() * 100),
			squarePercentHeight = Math.round(currentSelectionHeight /  $(document).height() * 100);

		// Update toolbar information
		$("#ruller-width").html(currentSelectionWidth + "px (" + squarePercentWidth + "%)");
	    $("#ruller-height").html(currentSelectionHeight + "px (" + squarePercentHeight + "%)");

	};

	var _getCurrentSelectionSize = function () {

		return [Math.round(Math.round($("#selection").width()) / (Math.pow(1.1, Zoom.getZoomAmount()) * 100) * 100),
				Math.round(Math.round($("#selection").height()) / (Math.pow(1.1, Zoom.getZoomAmount()) * 100) * 100)]

	};

	/* 
     * Add default value to the toolbar 
     *
     * @param none
     * @return none
     *
     */
	var _defaultInfo = function () {

		// Add default toolbar information
		$("#ruller-width").html("0px");
	    $("#ruller-height").html("0px");

	    // Add document information to the toolbar
	    $("#page-width").html("Page width: " + $(document).width() + "px");
		$("#page-height").html("Page height: " + ($(document).height() - 35) + "px");

	};

	/* 
     * Initializes the square draggable and resizable features
     *
     * Resource : http://interactjs.io/
     *
     * @param none
     * @return none
     *
     */
	var _initSelectionFeatures = (function () {

		// Init interactJS
		interact('#selection')

			// Add dragable feature
			.draggable({

		    	// Enable inertial throwing
		   		inertia: true,

			    // Add onmove to the square element
			    onmove: function (event) {

			    	// Define target of the listener and store the dragged postion in data-n attributes
			    	var target = $(event.target),
			        	x = (parseFloat(target.attr("data-x")) || 0) + event.dx,
			        	y = (parseFloat(target.attr("data-y")) || 0) + event.dy;

			    	// Translate the element
			    	target.css("transform", "translate(" + x + "px, " + y + "px)");

			    	// Update the position attributes
			    	target.attr({
			    		"data-x" : x,
			    		"data-y" : y
			    	});

			    }

			  })

			// Add resizable feature
			.resizable(true)

				// Add onresizemove event listener to the selection element
				.on("resizemove", function (event) {

					// Define target of the listener
				    var target = $(event.target);

				    // Add the change in coords to the previous width of the target element
				    var newWidth  = target.width() + event.dx,
				        newHeight = target.height() + event.dy;

				    // Update the targets element styles
				    target.css({
				    	"width" : newWidth,
				    	"height" : newHeight
					});

					_updateSelectionCoordinates();

					_updateInfo();

			  	});

	})();

	/* 
     * Initializes ruller module
     *
     * @param none
     * @return none
     *
     */
	var init = function () {

		// Hide canvas if view if 100%
		if(Zoom.getZoomAmount() === 0) Content.hideCanvas();

		// Add module content
		_addContent();

		// Create wrapper for ruller tool
		_createRullerWrapper();

		// Add module default values
		_defaultInfo();

		// Creates are to make measuring square
		_addListener();

	}


	return {

		init: init,
		removeListener : removeListener,
		getSelection : getSelection

	}

})();