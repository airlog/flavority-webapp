
define([
    'jquery',
    'underscore',
    'backbone',
    
    'collections/RecipeCollection',
    
    'views/Spinner',
    
    'text!templates/last_added_recipes.html',
], function ($, _, Backbone, RecipeCollection, Spinner, lastAddedRecipesTemplate) {    
    var elementString = ".recipe-last-added ";
    var LastAddedView = Backbone.View.extend({
        el: elementString + '.data',
        render: function () {
            var recipes = new RecipeCollection();
            var spin = Spinner().spin();
            
            // this is to properly place a spinner
            spin.el.style['position'] = null;
            $(elementString + ".spinner-center")
                .html(spin.el)
                .css('position', 'relative');
            
            var that = this;
            recipes.fetch({
                data: {
                	limit: 4,               // how much elements to retrieve
                	short: true,            // short JSON (see API)
                	sort_by: 'date_added',  // sort by addition date, most recent - on top
                },
                
                success: function (collection, response, options) {                    
                    var compiledTemplate = _.template(lastAddedRecipesTemplate, {
                        random: function (min, max) {
                            return Math.floor((Math.random() * max) + min);  
                        },
                        recipes: collection.models,
                        default_images: [
                            // paths to default images (when no image for recipe)
                            // TODO: use our images
                            'http://images6.fanpop.com/image/photos/32900000/Sisters-applejack-my-little-pony-friendship-is-magic-32995815-300-300.jpg',
                            'http://www.polyvore.com/cgi/img-thing?.out=jpg&size=l&tid=37434267',
                            'http://www.polyvore.com/cgi/img-thing?.out=jpg&size=l&tid=42240617',
                        ],
                    });
                    
                    // stop the spinner
                    $(elementString + '.spinner').remove();
                    spin.stop();
                    
                    // append compiled template
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

