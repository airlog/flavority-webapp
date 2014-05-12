define([
    'jquery',
    'underscore',
    'backbone',
], function($, _, Backbone){
    var CommentCollection = Backbone.Collection.extend({
        url: '/comments/',
    });

    return CommentCollection;
});

