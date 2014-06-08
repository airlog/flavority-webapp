define([
    'jquery',
    'underscore',
    'backbone',
], function($, _, Backbone){
    var FavoriteModel = Backbone.Model.extend({
        urlRoot: '/favorite/',
        defaults: {},
    });

    return FavoriteModel;
});
