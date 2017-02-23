/*
 * @projectDescription creates send and receive message features for easier communication
 * between background and content script
 *
 * Note : Version 1.0 was using Port.connect to provide communication, but this approach 
 * was causing an error on tab change. In version 2.0 extensio can run in multiple tabs
 * at the same time
 *
 * Usefull link : https://developer.chrome.com/extensions/messaging
 *
 * @author Frantisek Musil - frantisek.musil@wips.com
 * @version 2.0
 *
 */

var Message = (function () {

	/* 
	 * Sends message to the background page
	 *
	 * @param { object }
	 * @return none
	 *
	 */
	var send = function ( message ) {

		chrome.runtime.sendMessage(message);

	};

	/* 
	 * Attaches event listener for receiving messages and call function to proccess them
	 * 
	 * Note : Calling message module wouldn't be necessary but using this approach port file
	 * doesn't have to be changed at all so can be copied and maintained easily
	 *
	 * @param none
	 * @return none
	 *
	 */
	var _receive = (function () {

		chrome.runtime.onMessage.addListener(function(message) {

			console.log(message)

				// Check if new module needs to be initialized    
	  			if(message.behaviour === "init") {

	  				$("body").on("contextmenu", function () {

	  					Module.removeListener("current", Module.getActive());

	  				})

	  				// Set active module 
	  				Module.setActive(message.module);

	  				// Create content overlay and toolbar
					Content.createOverlay();

					// Create canvas with current screenshot
					Content.createCanvas(message.img);

					Zoom.setLastScreenshot(message.img);

					// Check if color picker needs to be initialized
					if(message.module === "picker") {

						// Init color picker
						ColorPicker.init();

					// Check if ruller tool needs to be initialized
					} else if(message.module === "ruller") {

						// Init ruller tool
						Ruller.init();

					// Check if zoom tool needs to be initialized
					} else if(message.module === "zoom") {

						// Init zoom tool
						Zoom.init();

					// Check if crop tool needs to be initialized
					} else if(message.module === "crop") {

						// Init crop tool
						Crop.init();

					}

				}

			if(message.type === "update") {

				//console.log(Zoom.getZoomAmount())

				// Remove listener from current active module
				//Module.removeListener("current", Module.getActive());

				//Update active module according to newly clicked item
				Module.setActive(message.reid);

				// Init current module
				Module.initModule(Module.getActive());

				// Change active navigation item
				changeActiveNavigationItem($("li[data-module='" + message.reid + "']"));

			}

			if(message.img !== undefined && message.receive === "crop") {

				Crop.processCrop(message.img);

			}

			// Check if message contains screenshot
			if(message.img !== undefined && message.behaviour !== "init" && message.receive !== "crop") {

				// Create canvas element and append screenshot onto it
				Content.updateCanvas(message.img);

				// Update canvas 
				Zoom.setLastScreenshot(message.img);

			} 

  		});

	})();

	return {

		send : send

	}

})();