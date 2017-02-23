var on = true;

// listening for an event / one-time requests coming from the popup
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {

    switch(request.type) {
        case "show-viewport":
          if(on) on=false;
          else on=true;
          showViewport();
        break;
        case "show-grid":
          showGrid();
        break;
        case "run-bootlint":
          runBootlint();
        break;
      }
    return true;
});

// send a message to the content script
var showViewport = function() {
    chrome.tabs.getSelected(null, function(tab){
        chrome.tabs.sendMessage(tab.id, {type: "show-viewport", status: on });
    });
}
var showGrid = function() {
    chrome.tabs.insertCSS({
      file: 'grid.css'
    });

    chrome.tabs.getSelected(null, function(tab){
        chrome.tabs.sendMessage(tab.id, {type: "show-grid" });
    });
}
var runBootlint = function() {
    chrome.tabs.getSelected(null, function(tab){
        chrome.tabs.sendMessage(tab.id, {type: "run-bootlint" });
    });
}