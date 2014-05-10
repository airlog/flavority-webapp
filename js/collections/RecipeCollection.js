
define([
    'jquery',
    'underscore',
    'backbone',
], function($, _, Backbone){
    var RecipeCollection = Backbone.Collection.extend({
        url: '/recipes/?limit=4&sort_by=date_added&short',
    });

    return RecipeCollection;
});

