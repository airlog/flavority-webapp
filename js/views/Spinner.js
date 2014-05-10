
define([
    'spin',
], function (Spin) {
    var Spinner = function (jqelement) {
        var spin = new Spin({
            lines: 13,              // The number of lines to draw
            length: 14,             // The length of each line
            width: 3,               // The line thickness
            radius: 15,             // The radius of the inner circle
            corners: 1,             // Corner roundness (0..1)
            rotate: 0,              // The rotation offset
            direction: 1,           // 1: clockwise, -1: counterclockwise
            color: '#000',          // #rgb or #rrggbb or array of colors
            speed: 0.8,             // Rounds per second
            trail: 60,              // Afterglow percentage
            shadow: false,          // Whether to render a shadow
            hwaccel: true,          // Whether to use hardware acceleration
            className: 'spinner',   // The CSS class to assign to the spinner
            zIndex: 2e9,            // The z-index (defaults to 2000000000)
        });

        return spin;
    };

    return Spinner;
});

