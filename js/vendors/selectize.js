var Selectize = function ( element ) {

	if(element.charAt(0) === "#") {

		return document.getElementById(element.substring(1, element.length));

	} else {

		return document.getElementsByTagName(element)[0];

	}

};