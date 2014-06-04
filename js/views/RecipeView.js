/**
*Module that manages single recipe view.
*@module RecipeView
*/
define([
    'jquery',
    'underscore',
    'backbone',

    'models/RecipeModel',

    'views/Spinner',
    'views/StarsView',

    'text!templates/recipe.html',
], function($, _, Backbone, RecipeModel, Spinner, StarsView, recipeTemplate) {
    var RecipeView = Backbone.View.extend({
        el: '#recipe_details',
        /**Render view*/
        render: function(recipeId) {
            /**Represents amount of recipe's stars*/
            var getRankStars = function (recipe, name, color) {
                return new StarsView({
                    color: color,
                    rank: parseFloat(recipe.get(name))
                }).getCompiledTemplate();
            };
            /**Actual recipe*/
            var recipe = new RecipeModel({id:recipeId});
            
            $('#main_left').children().remove();
            $('#main_left').append("<div id='recipe_details'></div>");
            $('#main_left').append("<div id='recipe_comments'></div>");

            var spin = new Spinner().spin();

            spin.el.style['position'] = null;
            $('#recipe_details')
                .append("<div style='height: 100px;'><span id='recipe_details_spinner' style='position: absolute; display: block; top: 50%;left: 50%;'></span></div>");
            $("#recipe_details_spinner").html(spin.el).css('position', 'relative');

            var that = this;
            /**Will fetch actual recipe from database*/
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
                    

                    this.$('.stars_difficulty').html(getRankStars(recipe, "difficulty", "red"));
                    this.$('.stars_difficulty_comments').html(getRankStars(recipe, "difficulty_comments", "red"));
                    this.$('.stars_taste_comments').html(getRankStars(recipe, "taste_comments", "yellow"));
                },

                error: function (collection, response, options) {
                    alert('Retrieving recipe failed: '+ response);
                },

            }); 
        },
    });

    return RecipeView;
});
