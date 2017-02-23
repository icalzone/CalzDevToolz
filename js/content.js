var timeout = null;
var delayToHide = 3000;
var $sHelper = null;
var currentBreakpoint = null;
var helperPosition = 'tr';
window.onload = function() {
    // Get options
    chrome.storage.sync.get({
        bootstrapHelperIndicatorPosition: 'top-right',
    }, function(items) {
        var pos = items.bootstrapHelperIndicatorPosition;
        if (pos == 'top-left') {
            helperPosition = 'tl';
        }
        else if (pos == 'top-right') {
            helperPosition = 'tr';
        }
        else if (pos == 'bottom-left') {
            helperPosition = 'bl';
        }
        else if (pos == 'bottom-right') {
            helperPosition = 'br';
        }
    });


    var request = {
        action: 'isBootstraped',
        message: false
    };

    if (isBootstraped()) {
        // Wait to get Options
        setTimeout(function(){
            displaySimpleHelper();
        }, 500);

        currentBreakpoint = getBreakpoint(window.innerWidth);
        console.log('currentBreakpoint', currentBreakpoint);
        chrome.extension.sendRequest({
            action: 'changeIcon',
            message: currentBreakpoint
        });

        request.message = true;
    }
};



chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
    switch(message.type) {
        case "show-viewport":
            if (message.status) {
                hideDetail();
            } else {
                showDetail();
            }
        break;
        case "show-grid":
            showGrid();
        break;
        case "run-bootlint":
            bootlintThisPage();
        break;    }
});

    function bootlintThisPage() {
    //chrome.tabs.executeScript(null, { file: 'runbootlint.js' });
    var s = document.createElement('script');
    s.src = chrome.extension.getURL('runbootlint.js');
    s.onload = function() {
    this.parentNode.removeChild(this);
    };
    (document.head || document.documentElement).appendChild(s);
}

function showDetail() {
    $(window).unbind("resize");
    $('body, html').css('overflow', 'hidden');
    var width = $(window).width() + 'px';
    $('body, html').css('overflow', 'auto');
    $('div#windowInfo').remove();
    var bs = findBootstrapEnvironment();
    if (bs == undefined) { bs = 'N/A' };
    $('body').append('<div title="hide" alt="hide" id="windowInfo" style="font-size: 11px; padding: 5px; line-height: 12px; cursor: none; border: solid 1px #333; background-color: #553d7a; border-bottom-left-radius: 8px; position: fixed; top: 0px; text-align: center; right: 0px; z-index: 999999; color: #fff;">' + width + '<br/>' + bs + '</div>')
    $('body').scrollTop($('body').scrollTop() - 1, function () { $('body').scrollTop() + 1 });
    $(window).resize(function () { showDetail() });
}
function findBootstrapEnvironment() {
    var envValues = ["xs", "sm", "md", "lg"];
    var $el = $('<div>');
    $el.appendTo($('body'));

    for (var i = envValues.length - 1; i >= 0; i--) {
        var envVal = envValues[i];
        $el.addClass('hidden-' + envVal);
        if ($el.is(':hidden')) {
            $el.remove();
            return envVal
        }
    };
}
function hideDetail(){
    $('div#windowInfo').remove();
    $(window).unbind("resize");
}
function showGrid(){
    if (document.getElementsByClassName('cb-grid-lines').length){
        document.body.removeChild(document.getElementsByClassName('cb-grid-lines')[0]);
    }
    else
    {
        document.body.innerHTML += '<div class="cb-grid-lines"> \
          <div class="container"> \
            <div class="row"> \
                <div class="span1 col-xs-1"></div> \
                <div class="span1 col-xs-1"></div> \
                <div class="span1 col-xs-1"></div> \
                <div class="span1 col-xs-1"></div> \
                <div class="span1 col-xs-1"></div> \
                <div class="span1 col-xs-1"></div> \
                <div class="span1 col-xs-1"></div> \
                <div class="span1 col-xs-1"></div> \
                <div class="span1 col-xs-1"></div> \
                <div class="span1 col-xs-1"></div> \
                <div class="span1 col-xs-1"></div> \
                <div class="span1 col-xs-1"></div> \
            </div> \
          </div> \
        </div>';

    }
}

function isBootstraped() {
    // If website use col-*-* classes, considere it use bootstrap
    if ($('[class*="col-xs-"], [class*="col-sm-"], [class*="col-md-"], [class*="col-lg-"]').length > 0) {
        return true;
    } else {
        false;
    }
}

/////in process
function displaySimpleHelper() {
    if ($sHelper == null) {
        $sHelper = buildSimpleHelper();
    }

    $sHelper.addClass('active');

    if (timeout != null) {
        clearTimeout(timeout);
    }
    timeout = setTimeout(function(){
        $('#bh-simple-helper').removeClass('active');
    }, delayToHide);
}

function buildSimpleHelper() {
    var $sHelper = $(
        '<div id="bh-simple-helper" class="bh-'+ helperPosition +' active">' +
        '   <div class="visible-xs">XS</div>' +
        '   <div class="visible-sm">SM</div>' +
        '   <div class="visible-md">MD</div>' +
        '   <div class="visible-lg">LG</div>' +
        '</div>');
    $('body').append($sHelper);

    $(window).resize(function(){
        displaySimpleHelper();
        var newBp = getBreakpoint(window.innerWidth);
        if (currentBreakpoint != newBp) {
            currentBreakpoint = newBp;
            //console.log('currentBreakpoint', currentBreakpoint);
            // TODO Tips but not clear, admit background manage this request by change icon
            chrome.extension.sendRequest({
                action: 'changeIcon',
                message: currentBreakpoint
            });
        }
    });

    return $sHelper;
}