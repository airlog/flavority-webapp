
define([
    'jquery',
    'underscore',
    'backbone',

    'collections/CommentCollection',

    'views/Spinner',

    'text!templates/comments.html',
], function($, _, Backbone, CommentCollection, Spinner, commentsTemplate) {
    var CommentsView = Backbone.View.extend({
        el: '#recipe_comments',
        render: function(recipeId) {
            var comments = new CommentCollection();
			
			this.$el.empty();
			
            var that = this;
            comments.fetch({
                data: {
                    recipe_id: recipeId,
                },
                success: function (collection, response, options) {
                    var compiledCommentsTemplate = _.template(commentsTemplate, {
                        comments: collection.models,
                    });
                    console.log(compiledCommentsTemplate);
                    $('#recipe_comments').html(compiledCommentsTemplate);    
                },

                error: function (collection, response, options) {
                    alert('Retrieving comments failed: '+ response);
                    console.log(response);
                },

            }); 
        },
    });

    return CommentsView;
});
