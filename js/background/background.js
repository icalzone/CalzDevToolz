var Background = (function () {

	chrome.runtime.onInstalled.addListener(function(details){

	    if(details.reason == "install"){

	        localStorage.setItem("stats", true);

	    }

	});

	var takeScreenshot = function ( module ) {

		chrome.tabs.captureVisibleTab(null, { format : "png", quality : 100 }, 

			function ( dataUrl ) {

				if(module.receive === undefined) {

					var message = {

						img : dataUrl, 
						module : module.name,
						behaviour : module.behaviour

					}

				} else {

					var message = {

						img : dataUrl,
						receive : module.receive

					}

				}

				Message.send(message);

			}

		);

	};

	var copyToClipboard = function ( message ) {

		// Create text area element
		var clipboard = document.createElement('textarea');
   
   		// Append it to the body element
        document.body.appendChild(clipboard);

        // Add message text to the text area
        clipboard.value = message.text;

        // Select the text
        clipboard.select();

        // Copy to clipboard
        document.execCommand("copy", false, null);

        // Remove the textarea
        document.body.removeChild(clipboard);

	}

	/// TODO : revise
	var saveCroppedImage = function ( message ) {

		var canvas = document.createElement('canvas');
		canvas.setAttribute("width", message.right - message.left);
		canvas.setAttribute("height", message.bottom - message.top);

		var image = new Image;
		image.src = message.img;

		var sourceX = message.left,
            sourceY = message.top,
            sourceWidth = message.right - message.left,
            sourceHeight = message.bottom - message.top,
            destWidth = sourceWidth,
            destHeight = sourceHeight,
            destX = 0,
            destY = 0;
	
		canvas.getContext("2d").drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);

		var link = document.createElement("a");
		link.setAttribute("href", canvas.toDataURL());
		link.setAttribute("download", "screenshot.png");
		link.click();


	} 

	return {

		takeScreenshot : takeScreenshot,
		copyToClipboard : copyToClipboard,
		saveCroppedImage : saveCroppedImage

	}

})();