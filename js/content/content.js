/*
 * @projectDescription adds general toolbar functions 
 *
 * @author Frantisek Musil - frantisek.musil@wips.cz
 * @version 1.0
 *
 */

var Content = (function () {

	/* 
     * Creates the toolbar overlay
     *
     * @param { string }
     * @return none
     *
     */
	var createOverlay = function () {

		// Add toolbar height to total height of the document
		$("body").css("height", $("body").height() + 35);

		// Create wrapper element 
		var $wrapper = $("<div></div>");

		// Set wrapper attributes
		$wrapper.attr({
			"id" : "web-developer-tools",
			"class" : "web-developer-tools"
		});
		
		// Add wrappers content
		$wrapper.html('' +
		'<div class="wdt-overlay" id="wdt-overlay"></div>' +
		'<div class="wdt-toolbar" id="toolbar">' + 
			'<span id="exit" class="wdt-exit"></span>' +
			'<div class="wdt-wrapper">' +
				'<div id="module-content" class="wdt-module-content">' +
					// Module content 
				'</div>' +
				'<ul class="wdt-navigation" id="navigation">' +
					'<li class="wdt-color-picker-icon" id="color-picker-icon" data-module="picker"></li>' +
					'<li class="wdt-ruller-icon" id="ruller-icon" data-module="ruller"></li>' +
					'<li class="wdt-zoom-icon" id="zoom-icon" data-module="zoom"></li>' +
					'<li class="wdt-crop-icon" id="crop-icon" data-module="crop"></li>' +
				'</ul>' +
			'</div>' +
		'</div>' +
		'<div id="canvas-wrapper" class="wdt-canvas-wrapper">' +
		'</div>');

		// Append wrapper to the body element
		$("body").append($wrapper);

		// WARNING : Find better solution !!!
		$("li[data-module='" + Module.getActive() + "']").attr("data-state", "active");

		// Attach event listeners
		$("#navigation").children("li").on("click", Event.changeModule);
		$("#exit").on("click", Event.exitExtension);

	};

	changeActiveNavigationItem = function ( element ) {

		element.attr("data-state", "active").siblings().removeAttr("data-state");

	};

	var createCanvas = function ( url ) {

		// Create canvas element with DOM attributes
        var $canvas = $("<canvas></canvas>")
        $canvas.attr({
            "id" : "canvas",
            "class" : "wdt-canvas",
            "height" : $(window).height(),
            "width" : $(window).width()
        });

     	// Apend canvas to the end of body element
        $("#canvas-wrapper").append($canvas);

        $(window).on("scroll", Event.pageScroll);

        // Update canvas content
        updateCanvas(url);

	};

	var updateCanvas = function ( url ) {

		// Create screenshot image
		var image = new Image();
        image.src = url;

        // Set position and height of the canvas wrapper element
        $("#canvas-wrapper").css({
            "top" : window.pageYOffset + "px",
            "height" : ($(window).height() - 35) + "px"
        });

        // Draw image onto the canvas
        var ctx = document.getElementById("canvas").getContext("2d");
        ctx.drawImage(image, 0, 0);

        Content.showCanvas();

        //$(".wdt-overlay").show();

	};

	var showCanvas = function () {

		$("#canvas").show();

	};

	var hideCanvas = function () {

		$("#canvas").hide();

	};

	var disableScroll = function () {

		$("body").css("overflow-y", "hidden");		

	};

	var enableScroll = function () {

		$("body").css("overflow-y", "scroll");

	}

	return {

		changeActiveNavigationItem : changeActiveNavigationItem,
		createOverlay : createOverlay,
		createCanvas : createCanvas,
		updateCanvas : updateCanvas,
		showCanvas : showCanvas,
		hideCanvas : hideCanvas,
		disableScroll : disableScroll,
		enableScroll : enableScroll

	}

})();