var Module = (function () {

	var _active = undefined,
		_previous = undefined;

	var setActive = function ( module ) {

		_previous = _active;

		_active = module;

	};

	var getActive = function () {

		return _active;

	};

	var getPrevious = function () {

		return _previous;

	}

	var initModule = function ( module ) {

		if(module === "picker") {

			ColorPicker.init();

		} else if(module === "ruller") {

			Ruller.init();

		} else if(module === "zoom") {

			Zoom.init();

		} else if(module === "crop") {

			Crop.init();

		}

	}

	// if {type} = current => listener of current {module} will be removed
	// if {type} = others => listeners of all other modules excetp {module} will be removed
	var removeListener = function ( type, module ) {

		var listeners = [
			{ picker : ColorPicker.removeListener }, 
			{ zoom : Zoom.removeListener },
			{ ruller : Ruller.removeListener },
			{ crop : Crop.removeListener }
		];

		for(var i = 0; i < listeners.length; i++) {

			var moduleName = Object.keys(listeners[i])[0];

			if(type === "current" && moduleName === module) {

				listeners[i][moduleName]();

			} else if(type === "others" && moduleName !== module) {

				listeners[i][moduleName]();

			}

		}

	};

	return {

		getActive : getActive,
		setActive : setActive,
		getPrevious : getPrevious,
		initModule : initModule,
		removeListener : removeListener

	}

})();