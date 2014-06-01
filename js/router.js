
define([
    // These are path alias that we configured in our bootstrap
    'jquery',
    'underscore',
    'backbone',

    'views/panelTop',
    'views/TagsView',
    'views/LastAddedView',
    'views/BestRatedView',
    'views/RecipeView',
    'views/CommentsView',
    'views/UserInfoView',
    'views/UserRecipesView',
    'views/SearchView',
], function($, _, Backbone,
        PanelTopView, TagsView, LastAddedView, BestRatedView, RecipeView,
        CommentsView, UserInfoView, UserRecipesView, SearchView) {
    var Router = Backbone.Router.extend({
        routes: {
            '': 'home',
            'search/lastadded/page/:page': 'lastAddedSearch',
            'search/bestrated/page/:page': 'bestRatedSearch',
            'search/query/:query/:page': 'simpleSearch',
            'search/tag/:tag/:page': 'tagSearch',
            'search/advanced/:ingredients/:page': 'advancedSearch',
            'recipes/:id/': 'getRecipe',
            'users/:id/': 'getUser',
        },

        initialize: function () {
//            $.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
//                options.url = 'http://addressToRestfulServer' + options.url;
//            });

            var panelTopView = new PanelTopView();
            var tagsView = new TagsView();
            var lastAddedRecipeView = new LastAddedView();
            var bestRatedRecipeView = new BestRatedView();
            var recipeView = new RecipeView();
            var commentsView = new CommentsView();
            var searchView = new SearchView();
            var userInfoView = new UserInfoView();
            var userRecipesView = new UserRecipesView();

            panelTopView.render();
            tagsView.render();

            this.on('route:home', function() {
                $("#main_left").empty();

                lastAddedRecipeView.render();
                bestRatedRecipeView.render();
            });

            this.on('route:lastAddedSearch', function(page) {
                $("#main_left").empty();

                searchView
                    .clear()
                    .setPage(parseInt(page))
                    .setShortJsonEnabled(true)
                    .setSortingKey(searchView.SortingKeys.DATE)
                    .render();
           });

            this.on('route:bestRatedSearch', function (page) {
                $('#main_left').empty();

                searchView
                    .clear()
                    .setPage(parseInt(page))
                    .setShortJsonEnabled(true)
                    .setSortingKey(searchView.SortingKeys.RANK)
                    .render();
            });

           this.on('route:getRecipe', function(id) {
                commentsView.setRecipeId(id);
                commentsView.setPage(0);
                
                recipeView.render(id);
                commentsView.render();
            });

            this.on('route:simpleSearch', function(query, page) {
                $("#main_left").empty();

                searchView
                    .clear()
                    .setQuery(query)
                    .setPage(parseInt(page))
                    .setAdvanced(false)
                    .render();
            });

            this.on('route:tagSearch', function (tag, page) {
                $("#main_left").empty();

                searchView
                    .clear()
                    .setTags([parseInt(tag)])
                    .setPage(parseInt(page))
                    .render();
            });

            this.on('route:advancedSearch', function(ingredients, page) {
                $("#main_left").empty();
                console.log("advanced: " + ingredients);
                searchView
                    .clear()
                    .setQuery(ingredients)
                    .setPage(parseInt(page))
                    .setAdvanced(true)
                    .render();
            });

            this.on('route:getUser', function(id) {
                userRecipesView.setUserId(id);
                userRecipesView.setPage(1);
                
                userInfoView.render(id);
                userRecipesView.render();
            });

            Backbone.history.start();
        },
    });

    return Router;
});
