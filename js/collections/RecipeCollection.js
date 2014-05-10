
define([
    'jquery',
    'underscore',
    'backbone',
], function($, _, Backbone){
    var RecipeCollection = Backbone.Collection.extend({
        url: '/recipes/',
    });

    return RecipeCollection;
});

