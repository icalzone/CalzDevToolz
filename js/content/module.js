var Module = (function () {

	var setContext = function ( context ) {

		_ctx = context;

	}

	var getCurrentModule = function () {

		var currentModule = "";

		$("#navigation").children("li").each(function () {

			if($(this).attr("data-state")) {

				currentModule = $(this).attr("data-module");

			}

		});

		return currentModule;

	};

	var addModuleListener = function ( module ) {

		if(module === "picker") {

			removeListener("picker", "current");

            ColorPicker.addListener();
                    
        } else if (module === "ruller") {

        	removeListener("ruller", "current");

            Ruller.createArea();
            Ruller.recreateSquare();

        } else if (module === "zoom") {

        	Zoom._initVariables();
            Zoom.attachListeners();

        } else if (module === "crop") {

            /// TODO : add addListener method
        }

	};

	var addActiveState = function ( element ) {

		element.attr("data-state", "active");

	};

	// if {type} = current => listener of current {module} will be removed
	// if {type} = others => listeners of all other modules excetp {module} will be removed
	var removeListener = function ( module, type ) {

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

		getCurrentModule : getCurrentModule,
		addModuleListener : addModuleListener,
		addActiveState : addActiveState,
		removeListener : removeListener,
		setContext : setContext

	}

})();