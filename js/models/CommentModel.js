
define([
    'jquery',
    'underscore',
    'backbone',
], function ($, _, Backbone) {
    var CommentModel = Backbone.Model.extend({
        urlRoot: '/comments/',

        defaults: {
            author_id: null,
            author_name: null,
            date: null,
            difficulty: 0.0,
            recipe_id: null,
            taste: 0.0,
            text: null,
        },

        validate: function (attrs) {
            if (attrs.taste == null || attrs.difficulty == null || attrs.text == null) return 'null exception';

            if (!isFinite(attrs.taste) || attrs.taste <= 0.0) return 'bad taste exception';
            if (!isFinite(attrs.difficulty) || attrs.difficulty <= 0.0) return 'bad difficulty exception';
            if (attrs.text.length <= 0) return 'text not long enough';
        },
    });

    return CommentModel;
});

