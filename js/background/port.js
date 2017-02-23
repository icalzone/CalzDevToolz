/*
 * @projectDescription opens port for communicating with content script and 
 * adds send and receive messages features 
 *
 * @author Frantisek Musil - frantisek.musil@wips.cz
 * @version 1.0
 *
 */

var Port = (function () {

	// Private property containing port information
	var _port = {};

	/* 
	 * Helpfull link: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise
	 * Javascript promise which connects port to content script and adds its 
	 * parametes to the _port variable
	 *
	 * @param { function }
	 * @return none
	 *
	 */
	var _connect = new Promise(function (resolve) {
	
		chrome.runtime.onConnect.addListener(function(port) {

			_port = port;	

			_receive();		

			resolve();

		});

	});


	/* 
	 * Sends message through port saved in private propery after connect promise
	 * is fullfilled
	 *
	 * @param { object }
	 * @return none
	 *
	 */
	var send = function ( message ) {

		_connect.then(function() {
			
			_port.postMessage(message);

		});

	};

	/* 
	 * Adds event listener to port saved in a private proparty after connect promise
	 * is fullfilled
	 *
	 * @param none
	 * @return none
	 *
	 */
	var _receive = function () {
		
		_connect.then(function () {

			_port.onMessage.addListener(function ( msg ) {

				Listener.init(msg);

			});

		});

	};

	/* 
	 * Refreshes the value of _port private property when new page is opened or page 
	 * is refreshed
	 *
	 * @param none
	 * @return none
	 *
	 */
	var _onUpdate = (function () {

		chrome.tabs.onUpdated.addListener(function () {

			chrome.runtime.onConnect.addListener(function(port) {

				_port = port;

			});

		})

	})();

	return {

		send : send

	}

})();