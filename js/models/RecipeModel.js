/**
*Module that represents Recipe model.
*@module RecipeModel
*/
define([
    'jquery',
    'underscore',
    'backbone',
], function($, _, Backbone){
    var RecipeModel = Backbone.Model.extend({
        urlRoot: '/recipes',
        defaults: {}
    });

    return RecipeModel;
});
