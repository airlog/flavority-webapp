
define([
    'jquery',
    'underscore',
    'backbone',

    'models/RecipeModel',

    'views/Spinner',

    'text!templates/recipe.html',
], function($, _, Backbone, RecipeModel, Spinner, recipeTemplate) {
    var RecipeView = Backbone.View.extend({
        el: '#main_left',
        render: function(recipeId) {
            var recipe = new RecipeModel({id:recipeId});
			
			this.$el.empty();
			
            var that = this;
            recipe.fetch({
                success: function (recipe, response, options) {
					
					length = recipe.get('ingredients').length
					ingredients1 = recipe.get('ingredients').slice(0,length/2)
					ingredients2 = recipe.get('ingredients').slice(length/2,length)
					
                    var compiledRecipeTemplate = _.template(recipeTemplate, {
                        recipe: recipe,
                        ingredients1: ingredients1,
                        ingredients2: ingredients2,
                    });
                    that.$el.html(compiledRecipeTemplate);    
                },

                error: function (collection, response, options) {
                    alert('Retrieving recipe failed: '+ response);
                    console.log(response);
                },

            }); 
        },
    });

    return RecipeView;
});
