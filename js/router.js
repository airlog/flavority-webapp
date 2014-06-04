/**
*Module that defines routing paths for actions
*@module router
*/
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
    'views/UserCommentsView',
    'views/SearchView',
], function($, _, Backbone,
        PanelTopView, TagsView, LastAddedView, BestRatedView, RecipeView,
        CommentsView, UserInfoView, UserRecipesView, UserCommentsView, SearchView) {
	/**
	*Represents router and its routing routines in specific address variants
	*/
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
            'myrecipes': 'myRecipes',
            'mycomments': 'myComments',
        },
		
		/**
		*Initialises all application views.
		*/
        initialize: function () {
			/**Upper panel view*/
            var panelTopView = new PanelTopView();
			/**Tags view*/
            var tagsView = new TagsView();
			/**Newest recipes view*/
            var lastAddedRecipeView = new LastAddedView();
			/**Best rated recipes view*/
            var bestRatedRecipeView = new BestRatedView();
			/**Recipes view*/
            var recipeView = new RecipeView();
			/**Comments view*/
            var commentsView = new CommentsView();
			/**Search view*/
            var searchView = new SearchView();
			/**User's information view*/
            var userInfoView = new UserInfoView();
			/**User's recipes view*/
            var userRecipesView = new UserRecipesView();
			/**User's comments view*/
            var userCommentsView = new UserCommentsView();

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
                userRecipesView.setUserId(id);
                userRecipesView.setPage(1);
                
                userInfoView.render(id);
                userRecipesView.render();
            });

            this.on('route:myRecipes', function() {
                userRecipesView.setPage(1);
                userInfoView.setSearchId(true);
                userRecipesView.setSearchId(true);
                
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
