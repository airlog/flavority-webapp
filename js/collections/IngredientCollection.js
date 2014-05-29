
define([
    'jquery',
    'underscore',
    'backbone',
], function($, _, Backbone){
    var IngredientCollection = Backbone.Collection.extend({
        url: '/ingredients/',
    });

    return IngredientCollection;
});

