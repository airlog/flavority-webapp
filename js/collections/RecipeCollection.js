
define([
    'jquery',
    'underscore',
    'backbone',
], function($, _, Backbone){
    var RecipeCollection = Backbone.Collection.extend({
        url: '/recipes/',
        
        // out API gives a dictionary with a key 'recipes' which contains the proper elements
        // this method is invoked by Backbone after each fetch
        parse: function (response, options) {
            if (response.recipes) return response.recipes;  // if 'recipe' key is in the response
            else return response;                           // otherwise, for backward compatibility
        },
    });

    return RecipeCollection;
});

