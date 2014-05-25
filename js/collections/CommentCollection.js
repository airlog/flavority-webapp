define([
    'jquery',
    'underscore',
    'backbone',
], function($, _, Backbone){
    var CommentCollection = Backbone.Collection.extend({
        url: '/comments/',

        parse: function (response, options) {
            if (response.comments) return response.comments;  // if 'recipe' key is in the response
            else return response;                           // otherwise, for backward compatibility
        },
    });

    return CommentCollection;
});

