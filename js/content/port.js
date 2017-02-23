/*
 * @projectDescription creates port for communicating with background script and 
 * adds send and receive messages features 
 *
 * @author Frantisek Musil - frantisek.musil@wips.cz
 * @version 1.0
 *
 */

var Port = (function () {

	// Creates new port 
	var _port = chrome.runtime.connect({name : "toolkit"});

	/* 
	 * Adds event listener to "toolkit" port 
	 *
	 * @param none
	 * @return none
	 *
	 */
	var _receive = (function () {

		_port.onMessage.addListener(function(message) {
  
	  		Listener.init(message);

		});

	})();

	/* 
	 * Send message through "toolkit" port to the background 
	 * script
	 *
	 * @param none
	 * @return none
	 *
	 */
	var send = function ( message ) {

		_port.postMessage(message);

	}

	return {

		send : send

	}

})();