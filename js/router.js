
define([
    // These are path alias that we configured in our bootstrap
    'jquery',
    'underscore',
    'backbone',
    
	'views/panelTop',
	'views/TagsView',
	'views/ResultsView',
	'views/LastAddedView',
	'views/BestRatedView',
], function($, _, Backbone,
        PanelTopView, TagsView, ResultsView, LastAddedView, BestRatedView) {
    var Router = Backbone.Router.extend({
        routes: {
            '': 'home',
            'search/lastadded/page/:page/': 'searchResults',
        },
        
        initialize: function () {
//          $.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
//              options.url = 'http://addressToRestfulServer' + options.url;
//          });
	
            var panelTopView = new PanelTopView();
            var tagsView = new TagsView();

            panelTopView.render();
            tagsView.render();
            		
            this.on('route:home', function() {
                var lastAddedRecipeView = new LastAddedView();
                var bestRatedRecipeView = new BestRatedView();

                lastAddedRecipeView.render();
                bestRatedRecipeView.render();
            });
            
            this.on('route:searchResults', function(page) {
                var resultsView = new ResultsView({
                    page: page,
                });
                resultsView.render();
            });
            
            Backbone.history.start();
        },
    });

    return Router;
});

