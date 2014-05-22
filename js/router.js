
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
    'views/UserInfoView',
    'views/UserRecipesView',
], function($, _, Backbone,
        PanelTopView, TagsView, ResultsView, LastAddedView, BestRatedView, RecipeView,
        CommentsView, UserInfoView, UserRecipesView) {

    var Router = Backbone.Router.extend({
        routes: {
            '': 'home',
            'search/lastadded/page/:page/': 'searchResults',
            'recipes/:id/': 'getRecipe',
            'users/:id/': 'getUser',
        },

        initialize: function () {

          $.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
              options.url = 'http://addressToRestfulServer' + options.url;
          });

            var panelTopView = new PanelTopView();
            var tagsView = new TagsView();
            var recipeView = new RecipeView();
            var commentsView = new CommentsView();
            var userInfoView = new UserInfoView();
            var userRecipesView = new UserRecipesView();

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
                commentsView.setRecipeId(id);
                commentsView.setPage(0);
                
                recipeView.render(id);
                commentsView.render();
            });

            this.on('route:getUser', function(id) {
                userRecipesView.setUserId(id);
                userRecipesView.setPage(0);
                
                userInfoView.render(id);
                userRecipesView.render();
            });

            Backbone.history.start();
        },
    });

    return Router;
});
