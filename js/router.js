
define([
    // These are path alias that we configured in our bootstrap
    'jquery',
    'underscore',
    'backbone',
    
	'views/panelTop',
	'views/tags',
	'views/results',
], function($, _, Backbone, PanelTopView, TagsView, ResultsView) {
    var AppRouter = Backbone.Router.extend({
        routes: {
            '': 'home',
            'search/results': 'searchResults',
        }
    });
    
    var initialize = function() {
//        $.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
//            options.url = 'http://addressToRestfulServer' + options.url;
//        });
        
        var router = new AppRouter;
		
		var panelTopView = new PanelTopView();
		var tagsView = new TagsView();

		panelTopView.render();
		tagsView.render();
				
        router.on('route:home', function() {
        });

        router.on('route:searchResults', function() {

		var resultsView = new ResultsView();
			resultsView.render();
        });
        
        Backbone.history.start();
    };
    
    return {
        initialize: initialize,
    };
});

