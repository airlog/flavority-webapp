
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
], function($, _, Backbone,
        PanelTopView, TagsView, ResultsView, LastAddedView,
        BestRatedView, RecipeView, CommentsView) {
    var Router = Backbone.Router.extend({
        routes: {
            '': 'home',
            'search/lastadded/page/:page/': 'searchResults',
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

            this.on('route:getRecipe', function(id) {
                $("#main_left").empty();

                var recipeView = new RecipeView();
                var commentsView = new CommentsView({
                    recipe_id:id,
                    page: 0,
                });

                recipeView.render(id);
                commentsView.render();
            });

            Backbone.history.start();
        },
    });

    return Router;
});

