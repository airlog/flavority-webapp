
define([
    'jquery',
    'underscore',
    'backbone',

    'models/RecipeModel',

    'views/Spinner',

    'text!templates/recipe.html',
], function($, _, Backbone, RecipeModel, Spinner, recipeTemplate) {
    var RecipeView = Backbone.View.extend({
        el: '#recipe_details',
        render: function(recipeId) {
            var recipe = new RecipeModel({id:recipeId});
            
            $('#main_left').empty();
            $('#main_left').append("<div id='recipe_details'></div>");
            $('#main_left').append("<div id='recipe_comments'></div>");

            var spin = new Spinner().spin();

            spin.el.style['position'] = null;
            $('#recipe_details')
                .append("<div style='height: 100px;'><span id='recipe_details_spinner' style='position: absolute; display: block; top: 50%;left: 50%;'></span></div>");
            $("#recipe_details_spinner").html(spin.el).css('position', 'relative');

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
                    this.$('#recipe_details').html(compiledRecipeTemplate);    
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
