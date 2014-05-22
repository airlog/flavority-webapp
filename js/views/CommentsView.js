
define([
    'jquery',
    'underscore',
    'backbone',

    'collections/CommentCollection',

    'views/Spinner',

    'text!templates/comments.html',
    'text!templates/page_selector.html',

], function($, _, Backbone, CommentCollection, Spinner, commentsTemplate, pageSelectorTemplate) {
    var CommentsView = Backbone.View.extend({
        // default values
        options: {
            page: 0,
            limit: 3,
        },

        initialize: function (options) {
            $.extend(this.options, options);
        },

        setRecipeId: function(id) {
            this.options.recipe_id = id;
        },
        
        setPage: function(page) {
            this.options.page = page;
        },
        
        el: '#main_left',

        render: function() {
            var spin = new Spinner().spin();

            spin.el.style['position'] = null;
            $('#recipe_comments').children().remove();
            $('#recipe_comments')
                .append("<div style='height: 100px;'><span id='recipe_comments_spinner' style='position: absolute; display: block; top: 50%;left: 50%;'></span></div>");
            $("#recipe_comments_spinner").html(spin.el).css('position', 'relative');
            
            this._fetchPage();
        },
        
        events: {
            'click #comments_page_selector .leftarrow': '_get_previous',

            'click  #comments_page_selector .rightarrow': '_get_next',
        },

         _get_previous: function() {
            this.options.page = this.options.page-1;
            this._fetchPage();
        },
        
        _get_next: function() {
            this.options.page = this.options.page+1;
            this._fetchPage();
        },

        _fetchPage : function() {
            var comments = new CommentCollection();
            var that = this;
            
            comments.fetch({
                data: {
                    recipe_id: that.options.recipe_id,
                    page: that.options.page,
                    limit: that.options.limit,
                },
                success: function (collection, response, status) {
                    $('#recipe_comments').children().remove();
                    
                    var compiledCommentsTemplate = _.template(commentsTemplate, {
                        comments: collection.models,
                    });
                    
                    $('#recipe_comments').html(compiledCommentsTemplate);
                    
                    var compiledPageSelectorTemplate = _.template(pageSelectorTemplate, {
                        currentPage: that.options.page+1,
                        maxPage: Math.ceil(response.all / that.options.limit),
                    });
                    $('#comments_page_selector').html(compiledPageSelectorTemplate);
                },

                error: function (collection, response, status) {
                    alert('Retrieving comments failed: '+ response);
                },
            }); 
        } 
    });

    return CommentsView;
});
