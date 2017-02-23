var Listener = (function () {

	var init = function ( message ) {

		if(message.behaviour === "screenshot") {

			takeScreenshot(message);

		} else if (message.behaviour === "copy") {

			copy(message);

		} else if (message.behaviour === "crop") {

			crop(message);

		}

	}

	var takeScreenshot = function ( message ) {

		var crop = (message.recieve !== undefined) ? "crop" : undefined;

		console.log(crop)

		chrome.tabs.captureVisibleTab(null, { format : "png", quality : 100 }, 

			function ( dataUrl ) {

				Port.send({

					img : dataUrl, 
					module : message.module,
					usage : crop

				})

			}

		);

	};

	var copy = function ( message ) {

		var clipboardCopier = document.createElement('textarea');
   
        document.body.appendChild(clipboardCopier);

        clipboardCopier.value = message.text;

        clipboardCopier.select();

        document.execCommand("copy", false, null);

        document.body.removeChild(clipboardCopier);

	}

	var crop = function ( message ) {

		var canvas = document.createElement('canvas');
		canvas.setAttribute("width", message.right - message.left);
		canvas.setAttribute("height", message.bottom - message.top);

		var image = new Image;
		image.src = message.lastScreenshot;

		var sourceX = message.left,
            sourceY = message.top,
            sourceWidth = message.right - message.left,
            sourceHeight = message.bottom - message.top,
            destWidth = sourceWidth,
            destHeight = sourceHeight,
            destX = 0,
            destY = 0;
	
		canvas.getContext("2d").drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
		console.log(canvas.toDataURL());

		var link = document.createElement("a");
		link.setAttribute("href", canvas.toDataURL());
		link.setAttribute("download", "screenshot.png");
		link.click();


	} 

	return {

		init : init,
		takeScreenshot : takeScreenshot

	}

})();