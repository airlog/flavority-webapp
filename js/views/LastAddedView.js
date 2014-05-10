
define([
    'jquery',
    'underscore',
    'backbone',
    
    'collections/RecipeCollection',
    
    'text!templates/last_added_recipes.html',
], function ($, _, Backbone, RecipeCollection, lastAddedRecipesTemplate) {
    var LastAddedView = Backbone.View.extend({
        el: '.recipe-last-added',
        render: function () {
            var recipes = new RecipeCollection();
            
            var that = this;
            recipes.fetch({
                success: function (collection, response, options) {                    
                    var compiledTemplate = _.template(lastAddedRecipesTemplate, {
                        random: function (min, max) {
                            return Math.floor((Math.random() * max) + min);  
                        },
                        recipes: collection.models,
                        default_images: [
                            'http://images6.fanpop.com/image/photos/32900000/Sisters-applejack-my-little-pony-friendship-is-magic-32995815-300-300.jpg',
                            'http://www.polyvore.com/cgi/img-thing?.out=jpg&size=l&tid=37434267',
                            'http://www.polyvore.com/cgi/img-thing?.out=jpg&size=l&tid=42240617',
                        ],
                    });                    
                    that.$el.html(compiledTemplate);
                },
                
                error: function (collection, response, options) {
                    alert('Error retrieving last added recipes');
                    console.log(response);
                },
            });
        },
    });

    return LastAddedView;
});

