/*
 * @projectDescription adds event listeners to the content 
 *
 * @author Frantisek Musil - frantisek.musil@wips.cz
 * @version 1.0
 *
 */

var Listener = (function () { 

	// Dynamically update last screenshow url
	var _lastScreenshot = "",
		_prevScreenshot = "";

	/* 
	 * Receives the message and according to it initializes toolbar and 
	 * module or updates the canvas
	 *
	 * @param { object }
	 * @return none
	 *
	 */
	var init = function ( message ) {

		if(message.usage !== undefined) {

			_prevScreenshot = _lastScreenshot;

			_lastScreenshot = message.img;

			return;

		}

		// Update _lastscreenshot variable
		_lastScreenshot = undefined ? _lastScreenshot : message.img;

		// Check if any module needs to be initialized
		if(message.module !== undefined) {

			// Create toolbar 
			Content.createOverlay(message.img);

			// Create canvas
			Canvas.create(message.img);

			// Attach scroll event listenter to the document
			_onScrolling();

			// Inilize correct module
			initModule(message.module);

			//////// TODO : change to [data-state] \\\\\\\
			//console.log($("li").hasAttribute("data-state"))

		} else {

			// Update canvas image
			Canvas.create(message.img);

		}

		

	};

	var setScreenshot = function () {

		_lastScreenshot = _prevScreenshot;

	}

	/* 
	 * Runs proper function according to the name of module it 
	 * receives
	 *
	 * @param { string }
	 * @return { function }
	 *
	 */
	initModule = function ( name ) {

		if(name === "picker") {

			return ColorPicker.init();

		} else if(name === "ruller") {

			return Ruller.init();

		} else if(name === "crop") {

			return Crop.init();

		} else if(name === "zoom") {

			return Zoom.init();

		}

	}

	/* 
	 * Attaches the scroll and remove toolbar events to the window
	 *
	 * Resource : http://stackoverflow.com/questions/4620906/how-do-i-know-when-ive-stopped-scrolling-javascript#answer-4620986
	 *
	 * @param { none }
	 * @return { none }
	 *
	 */
	var _onScrolling = function () {

		$(".wdt-overlay").css("display", "none");

		var timer = null;

		function onScrollEvent () {

	    	if(timer !== null) { 

	        	clearTimeout(timer);   

				$("#canvas").remove();

				$(".wdt-overlay").hide();
			
				//Module.removeListener(Module.getCurrentModule(), "current");

				Ruller.setCreated();

	    	} 

    		timer = setTimeout(function() {
          		
          		Port.send({
          			behaviour : "screenshot"
          		});

   	 		}, 300);

		};

		$(window).on("scroll", onScrollEvent, false);

		_removeToolbar(onScrollEvent);

	};

	/* 
	 * Initializes exit click event
	 *
	 * @param { event }
	 * @return { none }
	 *
	 */
	var _removeToolbar = function ( evt ) {

		$("#exit").on("click", function () {

			// Remove toolbar
			$("#web-developer-tools").remove();

			// Remove scroll event listener
			$(window).off("scroll");

			// Change body height to the default size
			$("body").css("height", ($("body").height() - 35) + "px");

			Zoom.removeListener();
			Ruller.removeListener();
			ColorPicker.removeListener();
			Crop.removeListener();

		}, false)

	}

	var getLastScreenshot = function () {

		return _lastScreenshot;

	}

	return {

		init : init,
		initModule : initModule,
		getLastScreenshot : getLastScreenshot,
		setScreenshot : setScreenshot

	}

})();