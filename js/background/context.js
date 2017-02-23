/*
 * @projectDescription creates context menu and attaches event listener to it
 *
 * Usefull link : https://developer.chrome.com/extensions/contextMenus
 *
 * @author Frantisek Musil - frantisek.musil@wips.com
 * @version 1.0
 *
 */

var Context = (function () { 

	// Variable containing all menu items as an array items with title, access and id
	var _menuItems = [

		["Color Picker", ["all"], "picker"],

		["Ruler", ["all"], "ruller"],

		["Crop tool", ["all"], "crop"],

		["Zoom tool", ["all"], "zoom"]

	];

	var _initialized = false;

	/* 
	 * Creates menu items in context menu and adds them all important 
	 * properties
	 *
	 * @param none
	 * @return none
	 *
	 */
	var _createMenuItems = function () {

		for(var i = 0, j = _menuItems.length; i < j; i++){

			chrome.contextMenus.create({

				"title" : _menuItems[i][0],
				"contexts" : _menuItems[i][1],
				"id" : _menuItems[i][2]

			});

		};

	};

	/* 
	 * Attaches event listener to each menu item which send the info
	 * to content 
	 *
	 * @param none
	 * @return none
	 *
	 */
	var _addListener = function () {
		
		chrome.contextMenus.onClicked.addListener(function ( item ) {

			if(!_initialized) {

				Background.takeScreenshot({

					name : item.menuItemId, 
					behaviour : "init"

				});

				_initialized = true;

			} else {

				Message.send({

					type : "update",
					reid : item.menuItemId

				})

			}

		})

	};

	var setInitialized = function () {

		_initialized = false;

	};

	chrome.tabs.onUpdated.addListener(function () {

		_initialized = false;

	});

	/* 
	 * Initialize all functions for creating context menu 
	 *
	 * @param none
	 * @return none
	 *
	 */
	var init = (function () {

		_createMenuItems();

		_addListener();

	})();

	return {
		setInitialized : setInitialized
	}

})();