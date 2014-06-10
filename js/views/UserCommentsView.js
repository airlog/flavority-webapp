define([
    'jquery',
    'underscore',
    'backbone',

    'collections/CommentCollection',

    'util/loginmanager',

    'views/Spinner',
    'views/StarsView',

    'text!templates/user_comments.html',
    'text!templates/comments_with_dishname.html',
    'text!templates/page_selector.html',

], function($, _, Backbone, CommentCollection, loginManager,
        Spinner, StarsView, userCommentsTemplate, commentsTemplate, pageSelectorTemplate) {
    var UserCommentsView = Backbone.View.extend({
        el: '#main_left',
        // default values
        options: {
            page1: 1,
            page2: 1,
            limit: 3,
        },

        initialize: function (options) {
            $.extend(this.options, options);
        },

        setPage1: function(page) {
            this.options.page1 = page;
        },

        setPage2: function(page) {
            this.options.page2 = page;
        },

        _getRankStars: function (comment, name, color) {
            return new StarsView({
                color: color,
                rank: parseFloat(comment.get(name))
            }).getCompiledTemplate();
        },

        _fetchComments: function(whichComments) {
            var comments = new CommentCollection();
            var spin = new Spinner().spin();
            var elementName = "#comments1";
            var elementName2 = "comments1";
            if (whichComments == 2) {
                 elementName = "#comments2";
                 elementName2 = "comments2";
            }
            $(elementName).empty();

            if (!loginManager.isLogged()) {
                //TO DO  niezalogowany na stronie mycomments
                console.log("Niezalogowany");
            }

            spin.el.style['position'] = null;
            $(elementName)
                .append("<div style='height: 100px;'><span id='"+elementName2+"_spinner' style='position: absolute; display: block; top: 50%;left: 50%;'></span></div>");
            $(elementName+"_spinner").html(spin.el).css('position', 'relative');
            var headers = { 'X-Flavority-Token': loginManager.getToken() };

            var about_me = false;
            var my_comments = false;
            if (whichComments == 1) about_me = true;
            if (whichComments == 2) my_comments = true;
            var page = this.options.page1;
            if (whichComments == 2) page = this.options.page2;

            var that = this;
            comments.fetch({
               headers: headers,
               data: {
                    about_me: about_me,
                    my_comments: my_comments,
                    page: page,
                    limit: that.options.limit,
                },
                success: function (collection, response, status) {
                    $(elementName).empty();

                    var compiledCommentsTemplate = _.template(commentsTemplate, {
                        comments: collection.models,
                        getImageUrl: function (imgId) {
                            if(imgId == "") {
                                return 'images/default_avatar.png';
                            } else {
                                return window.app.restapiAddr + "/photos/" + imgId;
                            }
                        },
                    });

                    $(elementName).html(compiledCommentsTemplate);

                    var compiledPageSelectorTemplate = _.template(pageSelectorTemplate, {
                        currentPage: page,
                        maxPage:  Math.ceil(response.totalElements / that.options.limit),
                    });
                    $('#user_comments_page_selector_'+whichComments).html(compiledPageSelectorTemplate);

                    for (var i = 0; i < collection.models.length; i++) {
                        $(elementName).find('.stars_taste:eq(' + i + ')')
                            .html(that._getRankStars(collection.models[i],"taste","yellow"));
                    }
                    for (var i = 0; i < collection.models.length; i++) {
                        $(elementName).find('.stars_difficulty:eq(' + i + ')')
                            .html(that._getRankStars(collection.models[i],"difficulty","red"));
                    }
                },

                error: function (collection, response, status) {
                    alert('Retrieving user comments failed: '+ response);
                    console.log(response);
                },
            });

        },

        render: function() {
            this.$el.empty()

            var compiledUserCommentsTemplate = _.template(userCommentsTemplate);

            $('#main_left').html(compiledUserCommentsTemplate);

            this._fetchComments(1);
            this._fetchComments(2);

        },

        events: {
            'click #user_comments_page_selector_1 .leftarrow': function () {
                this.options.page1 = this.options.page1-1;
                this._fetchComments(1);
            },

            'click #user_comments_page_selector_1 .rightarrow': function () {
                this.options.page1 = this.options.page1+1;
                this._fetchComments(1);
            },
            'click #user_comments_page_selector_2 .leftarrow': function () {
                this.options.page2 = this.options.page2-1;
                this._fetchComments(2);
            },

            'click #user_comments_page_selector_2 .rightarrow': function () {
                this.options.page2 = this.options.page2+1;
                this._fetchComments(2);
            },
        },
    });

    return UserCommentsView;
});
