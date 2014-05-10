
define([
    'jquery',
    'underscore',
    'backbone',
], function($, _, Backbone){
    var TagCollection = Backbone.Collection.extend({
        url: '/tags/',
    });

    return TagCollection;
});

