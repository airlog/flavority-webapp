
define([
    // These are path alias that we configured in our bootstrap
    'jquery',       // lib/jquery/jquery
    'underscore',   // lib/underscore/underscore
    'backbone',     // lib/backbone/backbone
    'router',       // request router.js
], function($, _, Backbone, Router){    
    return {
        initialize: function () {},
        router: new Router(),
    };
});

