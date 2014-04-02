
define([
    // These are path alias that we configured in our bootstrap
    'jquery',
    'underscore',
    'backbone',
    
    'text!templates/sample.html',
], function($, _, Backbone, template) {
    var AppRouter = Backbone.Router.extend({
        routes: {
            '': 'home',
        }
    });
    
    var initialize = function() {
//        $.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
//            options.url = 'http://addressToRestfulServer' + options.url;
//        });
        
        var router = new AppRouter;

        router.on('route:home', function() {
            // render '/'
            var compiledTemplate = _.template(template, {});
            $('#sample').html(compiledTemplate);
        });
        
        Backbone.history.start();
    };
    
    return {
        initialize: initialize,
    };
});

