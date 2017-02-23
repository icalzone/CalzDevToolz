/*
 * @projectDescription adds zoom tool module content and behaviour
 *
 * @note default resource for most of the methods in this module were taken from here: 
 * http://stackoverflow.com/questions/5189968/zoom-canvas-to-mouse-cursor/5526721#5526721
 * and this code was adjusted to Zepto.js syntax and also cut in multiple functions to make
 * it easier to maintain -> if any bug appears always check with this original code
 *
 * @author Frantisek Musil - frantisek.musil@wips.cz
 * @version 1.0
 *
 */

var Zoom = (function () {

	// Define global variables for zooming features funcionality
	// these variables are initialized on Zoom.init() by _initVariables function
	var _image, _ctx, _lastX, _lastY, _lastScreenshot, _dragStart, _dragged;

	// Define global variable to track amount of zooming (helps disable the zoom on less than 100%
	// of the viewport size)
	var _zoomAmount = 0,
		_zoomDirection = 1;


	/* 
     * Adds module content
     *
     * @param none
     * @return none
     *
     */
	var _addContent = function () {

		$("#module-content").html( '' +
		'<div class="wdt-zoom wdt-module" id="zoom-tool">' +
			'<div class="wdt-icon">' +
				'<span class="wdt-module-name">Zoom tool</span>' +
			'</div>' +
			'<div class="wdt-content">' +
				'<div class="wdt-zoom-in-box">' +
					'<span class="wdt-zoom-in active" id="zoom-in" data-state="active">Zoom in</span>' +
				'</div>' +
				'<div class="wdt-zoom-out-box">' +
					'<span class="wdt-zoom-out" id="zoom-out">Zoom out</span>' +
				'</div>' +
				'<div class="wdt-actual-size-box">' +
					'<span class="wdt-actual-size" id="actual-size">Actual size</span>' +
				'</div>' +
			'</div>' +
		'</div>');

	};

	var _viewNormalSize = function () {

		_ctx.setTransform(1, 0, 0, 1, 0, 0);

		_redrawCanvas();

		_zoomAmount = 0;

		Content.enableScroll();

	};

	var _changeZoomDirection = function () {

		if($(event).get(0).target.id === "zoom-in") {

			var clickedElement = $("#zoom-in"),
				prevElement = $("#zoom-out");

			_zoomDirection = 1;

		} else {

			var clickedElement = $("#zoom-out"),
				prevElement = $("#zoom-in");

			_zoomDirection = -1;

		}

		if(clickedElement.attr("data-state") === "active") return;

		prevElement.removeAttr("data-state");

		clickedElement.attr("data-state", "active");

	};

	var _startZoom = function () {

		// Prevent canvas from highlighting
		$("body").addClass("disable-user-select");

		// Update _lastX and _lastY variables
		_lastX = $(event).get(0).offsetX || ($(event).get(0).pageX - canvas.offsetLeft);
		_lastY = $(event).get(0).offsetY || ($(event).get(0).pageY - canvas.offsetTop);

		// Set value of _dragstart variable according to the last mouse position
		_dragStart = _ctx.transformedPoint(_lastX,_lastY);

		// Set _dragged variable to false for preventing from accidental zooming while moving the canvas
		_dragged = false;

		$("#canvas").on("mousemove", _moveOntoCanvas)

	};

	var _moveOntoCanvas = function () {

		if(_zoomAmount === 0) {

			_dragged = true; 

			return false;

		}

		// Update _lastX and _lastY variables
		_lastX = $(event).get(0).offsetX || ($(event).get(0).pageX - canvas.offsetLeft);
		_lastY = $(event).get(0).offsetY || ($(event).get(0).pageY - canvas.offsetTop);

		// Set _dragged variable to true for making it possible to zoom the canvas on click
		_dragged = true;

		// Check if _dragStart variable is a valid value 
		if (_dragStart){

			// Set the pt variable to the past mouse position
			var pt = _ctx.transformedPoint(_lastX, _lastY);

			// Remaps the context to correct possition
			_ctx.translate(pt.x - _dragStart.x, pt.y - _dragStart.y);

			// Redraw the canvas
			_redrawCanvas();

		}

	};

	var _finishZoom = function () {

		//if(_zoomAmount > 0) $("body").addClass("disable-scroll");

		$("#canvas").off("mousemove");

		// Set _dragStart variable to null to prevent from accidental dragging of the canvas
		_dragStart = null;

		// Check if canvas isnt beeing _dragged and if so zoom canvas
		/// TODO : add switching between the zoom in and out
		if (!_dragged) {

			/// TODO add comments
			// Zoom canvas in or out according to if shift is beeing pressed

			_zoomAmount += _zoomDirection;
			
			if(_zoomAmount >= 0 && _zoomAmount < 33) {

				_zoomCanvas(_zoomDirection);

				$("#wdt-overlay").show();

				if(_zoomAmount !== 0) Content.disableScroll();

			} else if (_zoomAmount === -1) {

				_ctx.setTransform(1, 0, 0, 1, 0, 0);

				_redrawCanvas();

				Content.enableScroll();

				_zoomAmount = 0;

			} else {

				_zoomAmount = 32;

				return;

			}

		}

	}

	var _addListener = function () {

		//$("body").addClass("disable-scroll");

		$("#actual-size").on("click", _viewNormalSize);

		$("#zoom-out").on("click", _changeZoomDirection);

		$("#zoom-in").on("click", _changeZoomDirection);

		$("#canvas").on("mousedown", _startZoom);

		//$("#canvas").on("mousemove", _moveOntoCanvas);

		$("#canvas").on("mouseup", _finishZoom);

	};

	/* 
     * Clears the canvas and draws new image onto in
     *
     * @param none
     * @return none
     *
     */
	var _redrawCanvas = function () {

		// Define clearing points
		var p1 = _ctx.transformedPoint(0, 0);
		var p2 = _ctx.transformedPoint($("#canvas").width(), $("#canvas").height());

		// Clear canvas context on the clearing points
		_ctx.clearRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);

		// Draw new image onto the canvas
		_ctx.drawImage(_image, 0, 0);

	};

	/* 
     * Zooms the canvas according to clicks value 
     *
     * @param { integer }
     * @return none
     *
     */
	var _zoomCanvas = function ( clicks ) {

		// Asing current position to the pt variable
		var pt = _ctx.transformedPoint(_lastX, _lastY);

		// Remaps the context to last mouse position
		_ctx.translate(pt.x, pt.y);

		// Set how much should be canvas zoomed
		var factor = Math.pow(1.1,clicks);

		// Zoom canvas according to the factor variable
		_ctx.scale(factor,factor);

		// Remaps the context to negative of last mouse position
		_ctx.translate(-pt.x,-pt.y);

		// Redraw the canvas 
		_redrawCanvas();

	};

	/* 
     * Adds tracking methods to the context
     *
     * Resource : http://stackoverflow.com/questions/5526486/clear-entire-transformed-html5-canvas-while-preserving-context-transform#answer-5527449
     *
     * @param { 2D context }
     * @return { function }
     *
     */
	var _trackTransforms = function ( ctx ) {
		var svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
		var xform = svg.createSVGMatrix();
		ctx.getTransform = function(){ return xform; };
		
		var savedTransforms = [];
		var save = ctx.save;
		ctx.save = function(){
			savedTransforms.push(xform.translate(0,0));
			return save.call(ctx);
		};
		var restore = ctx.restore;
		ctx.restore = function(){
			xform = savedTransforms.pop();
			return restore.call(ctx);
		};

		var scale = ctx.scale;
		ctx.scale = function(sx,sy){
			xform = xform.scaleNonUniform(sx,sy);
			return scale.call(ctx,sx,sy);
		};
		var rotate = ctx.rotate;
		ctx.rotate = function(radians){
			xform = xform.rotate(radians*180/Math.PI);
			return rotate.call(ctx,radians);
		};
		var translate = ctx.translate;
		ctx.translate = function(dx,dy){
			xform = xform.translate(dx,dy);
			return translate.call(ctx,dx,dy);
		};
		var transform = ctx.transform;
		ctx.transform = function(a,b,c,d,e,f){
			var m2 = svg.createSVGMatrix();
			m2.a=a; m2.b=b; m2.c=c; m2.d=d; m2.e=e; m2.f=f;
			xform = xform.multiply(m2);
			return transform.call(ctx,a,b,c,d,e,f);
		};
		var setTransform = ctx.setTransform;
		ctx.setTransform = function(a,b,c,d,e,f){
			xform.a = a;
			xform.b = b;
			xform.c = c;
			xform.d = d;
			xform.e = e;
			xform.f = f;
			return setTransform.call(ctx,a,b,c,d,e,f);
		};
		var pt  = svg.createSVGPoint();
		ctx.transformedPoint = function(x,y){
			pt.x=x; pt.y=y;
			return pt.matrixTransform(xform.inverse());
		}
	};

	var setLastScreenshot = function ( url ) {

		_lastScreenshot = url;

		_initVariables();

	};


	/* 
     * Initialize the global variables
     *
     * @param none
     * @return none
     *
     */
	var _initVariables = function () {

		// Warning : Find better solution
		setInterval(function () {
			_ctx.clearRect(
				0,
				$("#canvas").height() - 35,
				$("#canvas").width(),
				$("#canvas").height()
			)
		}, 5)

		// Store canvas context to the variable 
		_ctx = document.getElementById("canvas").getContext("2d");

		_trackTransforms(_ctx);

		// Create image and define its source
		_image = new Image;
		_image.src = _lastScreenshot;

		// Store middle of the canvas as last scolled mouse position (default value)
		_lastX = $("#canvas").width() / 2;
		_lastY = $("#canvas").height() / 2;

	};

	var removeListener = function () {

		$("#actual-size").off("click");

		$("#zoom-out").off("click");

		$("#zoom-in").off("click");

		$("#canvas").off("mousedown");

		$("#canvas").off("mousemove");

		$("#canvas").off("mouseup");

		if(_zoomAmount === 0) $("#wdt-overlay").hide();

	}

	var getZoomAmount = function () {

		return _zoomAmount;

	}

	var init = function () {

		_zoomDirection = 1;

		Content.showCanvas();

		_addContent();

		_addListener();

		//_initVariables();

	}

	return {

		init : init,
		removeListener : removeListener,
		getZoomAmount : getZoomAmount,
		setLastScreenshot : setLastScreenshot

	}

})();