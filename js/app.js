
define([
    // These are path alias that we configured in our bootstrap
    'jquery',       // lib/jquery/jquery
    'underscore',   // lib/underscore/underscore
    'backbone',     // lib/backbone/backbone
    'router',       // request router.js
], function($, _, Backbone, Router){    
    return {
        initialize: function () {
            if (this.restapiAddr != null) {
                var remote = this.restapiAddr;
                $.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
                    options.url = remote + options.url;
                });
            } else this.restapiAddr = "";

            console.log("| Flavority Webapp\n| RESTful Server: " + this.restapiAddr);

            this.router = new Router();
        },
        router: null,
        restapiAddr: null,
    };
});

