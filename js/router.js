
define([
    // These are path alias that we configured in our bootstrap
    'jquery',
    'underscore',
    'backbone',
    
	'views/panelTop',
	'views/tags',
	'views/results',
	'views/LastAddedView',
	'views/BestRatedView',
], function($, _, Backbone,
        PanelTopView, TagsView, ResultsView, LastAddedView, BestRatedView) {
    var AppRouter = Backbone.Router.extend({
        routes: {
            '': 'home',
            'search/lastadded/page/:page/': 'searchResults',
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
            var lastAddedRecipeView = new LastAddedView();
            var bestRatedRecipeView = new BestRatedView();

            lastAddedRecipeView.render();
            bestRatedRecipeView.render();
        });
        
        router.on('route:searchResults', function(page) {
            var resultsView = new ResultsView();
            resultsView.render(page);
        });
        
        Backbone.history.start();
    };
    
    return {
        initialize: initialize,
    };
});

