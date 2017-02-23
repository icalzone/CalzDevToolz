var Options = (function () {

    var _saveOptions = function () {

        var stats = $("#stats").prop("checked") ? true : false;

        localStorage.setItem("stats", stats);

        window.close();

    }

    var init = (function () {

        $("#stats").prop("checked", JSON.parse(localStorage.getItem("stats")));
        
        $("#button").on("click", _saveOptions);

    })();

})();