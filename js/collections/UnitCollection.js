
define([
    'jquery',
    'underscore',
    'backbone',
], function($, _, Backbone){
    var UnitCollection = Backbone.Collection.extend({
        url: '/units/',
    });

    return UnitCollection;
});

