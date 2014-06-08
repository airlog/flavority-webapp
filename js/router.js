
define([
    // These are path alias that we configured in our bootstrap
    'jquery',
    'underscore',
    'backbone',

    'views/PanelTopView',
    'views/TagsView',
    'views/LastAddedView',
    'views/BestRatedView',
    'views/RecipeView',
    'views/CommentsView',
    'views/UserInfoView',
    'views/UserRecipesView',
    'views/UserCommentsView',
    'views/SearchView',
    'views/AddRecipeView',
], function($, _, Backbone,
        PanelTopView, TagsView, LastAddedView, BestRatedView, RecipeView,
        CommentsView, UserInfoView, UserRecipesView, UserCommentsView, SearchView, AddRecipeView) {
    var Router = Backbone.Router.extend({
        routes: {
            '': 'home',
            'search/lastadded/page/:page': 'lastAddedSearch',
            'search/bestrated/page/:page': 'bestRatedSearch',
            'search/query/:query/:page': 'simpleSearch',
            'search/tag/:tag/:page': 'tagSearch',
            'search/advanced/:ingredients/:page': 'advancedSearch',
            'recipes/:id/': 'getRecipe',
            'recipes/new': 'addRecipe',
            'users/:id/': 'getUser',
            'myrecipes': 'myRecipes',
            'mycomments': 'myComments',
            'favorite': 'favoriteRecipes',
        },

        initialize: function () {
            var panelTopView = new PanelTopView();
            var tagsView = new TagsView();
            var lastAddedRecipeView = new LastAddedView();
            var bestRatedRecipeView = new BestRatedView();
            var recipeView = new RecipeView();
            var commentsView = new CommentsView();
            var searchView = new SearchView();
            var userInfoView = new UserInfoView();
            var userRecipesView = new UserRecipesView();
            var userCommentsView = new UserCommentsView();
            var addRecipeView = new AddRecipeView();

            panelTopView.render();

            this.on('route:home', function() {
                $("#main_left").empty();

                lastAddedRecipeView.render();
                bestRatedRecipeView.render();
                tagsView.render();
            });

            this.on('route:lastAddedSearch', function(page) {
                $("#main_left").empty();

                searchView
                    .clear()
                    .setPage(parseInt(page))
                    .setShortJsonEnabled(true)
                    .setSortingKey(searchView.SortingKeys.DATE)
                    .render();
                tagsView.render();
            });

            this.on('route:bestRatedSearch', function (page) {
                $('#main_left').empty();

                searchView
                    .clear()
                    .setPage(parseInt(page))
                    .setShortJsonEnabled(true)
                    .setSortingKey(searchView.SortingKeys.RANK)
                    .render();
                tagsView.render();
            });

            this.on('route:getRecipe', function(id) {
                commentsView.setRecipeId(id);
                commentsView.setPage(1);

                recipeView.render(id);
                commentsView.render();
                tagsView.render();
            });

            this.on('route:addRecipe', function () {
                $('#main_left').empty();

                userInfoView.setSearchId(true);
                userInfoView.render(null);

                addRecipeView
                    .clear()
                    .render();
            });

            this.on('route:simpleSearch', function(query, page) {
                $("#main_left").empty();

                searchView
                    .clear()
                    .setQuery(query)
                    .setPage(parseInt(page))
                    .setAdvanced(false)
                    .render();
                tagsView.render();
            });

            this.on('route:tagSearch', function (tag, page) {
                $("#main_left").empty();

                searchView
                    .clear()
                    .setTags([parseInt(tag)])
                    .setPage(parseInt(page))
                    .render();
                tagsView.render();
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
                tagsView.render();
            });

            this.on('route:getUser', function(id) {
                userInfoView.setSearchId(false);
                userRecipesView.setSearchId(false);
                userRecipesView.setFavorite(false);
                userRecipesView.setUserId(id);
                userRecipesView.setPage(1);

                userInfoView.render(id);
                userRecipesView.render();
            });

            this.on('route:myRecipes', function() {
                userRecipesView.setPage(1);
                userInfoView.setSearchId(true);
                userRecipesView.setSearchId(true);
                userRecipesView.setFavorite(false);

                userRecipesView.render();
                userInfoView.render(null);
            });

            this.on('route:favoriteRecipes', function() {
                userRecipesView.setPage(1);
                userInfoView.setSearchId(true);
                userRecipesView.setSearchId(true);
                userRecipesView.setFavorite(true);

                userRecipesView.render();
                userInfoView.render(null);
            });

            this.on('route:myComments', function() {
                userCommentsView.setPage1(1);
                userCommentsView.setPage2(1);
                userInfoView.setSearchId(true);

                userCommentsView.render();
                userInfoView.render(null);
            });

            Backbone.history.start();
        },
    });

    return Router;
});

