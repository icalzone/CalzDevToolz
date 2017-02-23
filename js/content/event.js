var Event = (function () {

	var _scrollTimer = null;

	var changeModule = function () {

		// Return false on click on active module
		if($(this).attr("data-state")) return;

		// Remove listener from current active module
		Module.removeListener("current", Module.getActive());

		// Update active module according to newly clicked item
		Module.setActive($(this).attr("data-module"));

		// Init current module
		Module.initModule(Module.getActive());

		// Change active navigation item
		changeActiveNavigationItem($(this));

	};

	var exitExtension = function () {

		// Remove event listener from current module
		Module.removeListener("current", Module.getActive());

		// Remove event listener from navigation items
		$("#navigation").children("li").off("click");

		// Remove scroll listener
		$(window).off("scroll");

		// Remove extensions HTML
		$("#web-developer-tools").remove();

		// Set document height to default size
		$("body").css("height", $("body").get(0).offsetHeight - 35);

		Content.enableScroll();

		Message.send({

			type : "kill"

		})

	};

	var pageScroll = function () {

    	if(_scrollTimer !== null) { 

    		clearTimeout(_scrollTimer); 

    		// Set position and height of the canvas wrapper element
	        $("#canvas-wrapper").css({
	            "top" : window.pageYOffset + "px",
	            "height" : ($(window).height() - 35) + "px"
	        }); 

        	if(Module.getActive() === "zoom") $("#wdt-overlay").hide(); 

        	Content.hideCanvas();

    	} 

	    var delay = ($(window).scrollTop() + $(window).height() === $(document).height() || $(window).scrollTop() === 0) ? 750 : 200;
	   

	   _scrollTimer = setTimeout(function() {
	      		
      		var activeModule = Module.getActive();

      		if(activeModule !== "ruller" && activeModule !== "crop") { 

  				Message.send({

	      			behaviour : "screenshot"

	      		});

	      	}

	 	}, delay);

		

	};

	return {

		changeModule : changeModule,
		exitExtension : exitExtension,
		pageScroll : pageScroll

	}

})();