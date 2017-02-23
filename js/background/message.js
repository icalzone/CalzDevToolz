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
	 * Sends message to active tab in current window
	 *
	 * @param { object }
	 * @return none
	 *
	 */
	var send = function ( message ) {

		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
 
 			chrome.tabs.sendMessage(tabs[0].id, message);

		});

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
    
  			if(message.behaviour === "screenshot") {

				Background.takeScreenshot(message);

			} else if (message.behaviour === "copy") {

				Background.copyToClipboard(message);

			} else if (message.behaviour === "crop") {

				Background.saveCroppedImage(message);

			} else if(message.type === "kill") {

				Context.setInitialized(false);

			}

  		});

	})();

	return {

		send : send

	}

})();