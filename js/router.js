
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
    'views/RecipeView',
    'views/CommentsView',
    'views/SearchView',
], function($, _, Backbone,
        PanelTopView, TagsView, ResultsView, LastAddedView,
        BestRatedView, RecipeView, CommentsView, SearchView) {
    var Router = Backbone.Router.extend({
        routes: {
            '': 'home',
            'search/lastadded/page/:page/': 'searchResults',
            'search/query/:query/:page': 'simpleSearch',
            'recipes/:id/': 'getRecipe',
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
                $("#main_left").empty();

                var lastAddedRecipeView = new LastAddedView();
                var bestRatedRecipeView = new BestRatedView();

                lastAddedRecipeView.render();
                bestRatedRecipeView.render();
            });

            this.on('route:searchResults', function(page) {
                $("#main_left").empty();

                var resultsView = new ResultsView({
                    page: page,
                });
                resultsView.render();
            });
            
            this.on('route:simpleSearch', function(query, page) {
                $("#main_left").empty();

                var searchView = new SearchView({
                    query: query,
                    page: page,
                });

                searchView.render();
            });

            this.on('route:getRecipe', function(id) {
                $("#main_left").empty();

                var recipeView = new RecipeView();
                var commentsView = new CommentsView();

                recipeView.render(id);
                commentsView.render(id);
            });

            Backbone.history.start();
        },
    });

    return Router;
});

