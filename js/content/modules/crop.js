var Crop = (function () {

	var _coordinates = {};

	var _addContent = function () { 

		$("#module-content").html( '' +
		'<div class="wdt-crop wdt-module" id="crop">' +
			'<div class="wdt-icon">' +
				'<span class="wdt-module-name">Color picker</span>' +
			'</div>' +
			'<div class="wdt-content">' +
				'<div class="wdt-crop-button" id="crop-button">Crop & save</div>' +
			'</div>' +
		'</div>');

	};

	var requestCrop = function () {

		Message.send({

			behaviour : "screenshot",
			receive : "crop"

		})

	};

	var processCrop = function ( img ) {

		Message.send({

			behaviour : "crop",
			img : img,
			top : _coordinates.top,
			left : _coordinates.left,
			bottom : _coordinates.bottom,
			right : _coordinates.right

		});

	}

	var setCoordinates = function ( coord ) {

		_coordinates = coord;

	}

	var addListener = function () {

		$("#crop-button").on("click", requestCrop);

	};

	var removeListener = function () {

		$("#crop-button").off("click");

		Ruller.removeListener();

	}

	var init = function () {

		Ruller.init();

		Content.showCanvas();

		_addContent();

		addListener();

	}

	return {

		init : init,
		removeListener : removeListener,
		processCrop : processCrop,
		requestCrop : requestCrop,
		setCoordinates : setCoordinates

	}

})();