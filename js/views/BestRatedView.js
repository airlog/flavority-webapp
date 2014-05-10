
define([
    'jquery',
    'underscore',
    'backbone',
    
    'collections/RecipeCollection',
    
    'text!templates/best_rated_recipes.html',
], function ($, _, Backbone, RecipeCollection, bestRatedRecipesTemplate) {
    var LastAddedView = Backbone.View.extend({
        el: '.recipe-best-rated',
        render: function () {
            var recipes = new RecipeCollection();
            
            var that = this;
            recipes.fetch({
                data: {
                	limit: 4,               // how much elements to retrieve
                	short: true,            // short JSON (see API)
                	sort_by: 'rate', 		// sort by rate, best - on top
                },
                
                success: function (collection, response, options) {                    
                    var compiledTemplate = _.template(bestRatedRecipesTemplate, {
                        random: function (min, max) {
                            return Math.floor((Math.random() * max) + min);  
                        },
                        default_images: [
                            // paths to default images (when no image for recipe)
                            // TODO: use our images
                            'http://images6.fanpop.com/image/photos/32900000/Sisters-applejack-my-little-pony-friendship-is-magic-32995815-300-300.jpg',
                            'http://www.polyvore.com/cgi/img-thing?.out=jpg&size=l&tid=37434267',
                            'http://www.polyvore.com/cgi/img-thing?.out=jpg&size=l&tid=42240617',
                        ],
                        recipes: collection.models,
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

