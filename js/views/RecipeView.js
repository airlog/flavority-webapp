
define([
    'jquery',
    'underscore',
    'backbone',

    'models/FavoriteModel',
    'models/RecipeModel',
    'util/loginmanager',

    'views/Spinner',
    'views/StarsView',

    'text!templates/recipe.html',
], function($, _, Backbone, FavoriteModel, RecipeModel, loginManager, Spinner, StarsView, recipeTemplate) {
    var RecipeView = Backbone.View.extend({
        el: '#main_left',

        options: {},

        render: function(recipeId) {
            this.options.recipe_id = recipeId;

            $('#main_left').children().remove();
            $('#main_left').append("<div id='recipe_details'></div>");
            $('#main_left').append("<div id='recipe_comments'></div>");

            this._fetchRecipe();
        },

        events: {
            'click .recipe_view_remove_favorite': function () {
                recipe = new FavoriteModel({id: this.options.recipe_id});

                var headers = {};
                if (!loginManager.isLogged()) {
                    alert("You are not logged!");
                    return;
                } else {
                    token = loginManager.getToken();
                    headers = {'X-Flavority-Token': token};
                }

                that = this;

                recipe.destroy({
                    headers: headers,

                    success: function (model, response, options) {
                        that._fetchRecipe();
                    },

                    error: function (response, status, options) {
                        alert('Error while removing a recipe!');
                        console.log(response);
                    },
                })
            },

            'click .recipe_view_add_favorite': function () {
                recipe = new FavoriteModel({recipe_id: this.options.recipe_id});

                var headers = {};
                if (!loginManager.isLogged()) {
                    alert("You are not logged!");
                    return;
                } else {
                    token = loginManager.getToken();
                    headers = {'X-Flavority-Token': token};
                }

                that = this;

                recipe.save({}, {
                    headers: headers,

                    success: function (model, response, options) {
                        that._fetchRecipe();
                    },

                    error: function (response, status, options) {
                        alert('Error while removing a recipe!');
                        console.log(response);
                    },
                })
            },

            'click .recipe_view_remove': function () {
                recipe = new RecipeModel({id: this.options.recipe_id});

                var headers = {};
                if (!loginManager.isLogged()) {
                    console.log("You are not logged!");
                } else {
                    token = loginManager.getToken();
                    headers = {'X-Flavority-Token': token};
                }

                that = this;
                if (!confirm('Are you sure you want to remove this recipe?')) {
                    return;
                }

                recipe.destroy({
                    headers: headers,

                    success: function (model, response, options) {
                        Backbone.history.navigate('#/myrecipes', {trigger: true,});
                    },

                    error: function (response, status, options) {
                        alert('Error while removing a recipe!');
                        console.log(response);
                    },
                })
            },
        },

        _fetchRecipe : function() {
            var getRankStars = function (recipe, name, color) {
                return new StarsView({
                    color: color,
                    rank: parseFloat(recipe[name])
                }).getCompiledTemplate();
            };

            var recipe = new RecipeModel({id:this.options.recipe_id});

            var spin = new Spinner().spin();

            spin.el.style['position'] = null;
            $('#recipe_details').empty();
            $('#recipe_details').append("<div style='height: 100px;'><span id='recipe_details_spinner' style='position: absolute; display: block; top: 50%;left: 50%;'></span></div>");
            $("#recipe_details_spinner").html(spin.el).css('position', 'relative');

            var headers = {};
            if (loginManager.isLogged()) {
                token = loginManager.getToken();
                headers = {'X-Flavority-Token': token};
            }

            var that = this;
            recipe.fetch({
                headers: headers,

                success: function (recipe, response, options) {
                    recipe_ = recipe.get('recipe')
                    length = recipe_['ingredients'].length
                    ingredients1 = recipe_['ingredients'].slice(0,length/2)
                    ingredients2 = recipe_['ingredients'].slice(length/2,length)
                    var compiledRecipeTemplate = _.template(recipeTemplate, {
                        favorite: recipe.get('favorite'),
                        my_recipe: recipe.get('my_recipe'),
                        recipe: recipe_,
                        ingredients1: ingredients1,
                        ingredients2: ingredients2,
                        getDefaultImage: function () {
                            var images = [
                                'http://images6.fanpop.com/image/photos/32900000/Sisters-applejack-my-little-pony-friendship-is-magic-32995815-300-300.jpg',
                                'http://www.polyvore.com/cgi/img-thing?.out=jpg&size=l&tid=37434267',
                                'http://www.polyvore.com/cgi/img-thing?.out=jpg&size=l&tid=42240617',
                            ];
                            var randint = function (min, max) {
                                return Math.floor((Math.random() * max) + min);
                            };

                            return images[randint(0, images.length)];
                        },

                        getImageUrl: function (imgId) {
                            return window.app.restapiAddr + "/photos/" + imgId;
                        },

                    });
                    this.$('#recipe_details').html(compiledRecipeTemplate);

                    this.$('.stars_difficulty').html(getRankStars(recipe_, "difficulty", "red"));
                    this.$('.stars_difficulty_comments').html(getRankStars(recipe_, "difficulty_comments", "red"));
                    this.$('.stars_taste_comments').html(getRankStars(recipe_, "taste_comments", "yellow"));
                },

                error: function (collection, response, options) {
                    alert('Retrieving recipe failed: '+ response);
                },
            });
        },

    });

    return RecipeView;
});
