define([
    'jquery',
    'underscore',
    'backbone',

    'util/loginmanager',

    'collections/RecipeCollection',

    'views/Spinner',
    'views/StarsView',

    'text!templates/user_recipes.html',
    'text!templates/page_selector.html',

], function($, _, Backbone, loginManager, RecipeCollection, Spinner, StarsView, userRecipesTemplate, pageSelectorTemplate) {
    var UserRecipesView = Backbone.View.extend({
        el: '#main_left',
        // default values
        options: {
            page: 1,
            limit: 15,
            searchId: false,
        },

        initialize: function (options) {
            $.extend(this.options, options);
        },

        setSearchId: function(search) {
            this.options.searchId = search;
        },

        setUserId: function(id) {
            this.options.user_id = id;
        },

        setPage: function(page) {
            this.options.page = page;
        },

        render: function() {

            var getRankStars = function (comment, name, color) {
                return new StarsView({
                    color: color,
                    rank: parseFloat(comment.get(name))
                }).getCompiledTemplate();
            };

            var headers = {};
            var title = "User's recipes";
            var data = {
                    short: true,
                    user_id: this.options.user_id,
                    page: this.options.page,
                    limit: this.options.limit,
                };

            if (this.options.searchId) {
                if (!loginManager.isLogged()) {
                    console.log("Niezalogowany!");
                    //TO DO niezalogowany wszedł na strone myrecipes
                }
                token = loginManager.getToken();
                headers = {'X-Flavority-Token': token};
                title = "Your recipes";
                data = {
                    myrecipes: this.options.searchId,
                    short: true,
                    page: this.options.page,
                    limit: this.options.limit,
                };
            }

            var recipes = new RecipeCollection();
            var spin = new Spinner().spin();
            this.$el.empty()
            this.$el.append("<div id='user_recipes'></div>")
            spin.el.style['position'] = null;
            $('#user_recipes')
                .append("<div style='height: 100px;'><span id='user_recipes_spinner' style='position: absolute; display: block; top: 50%;left: 50%;'></span></div>");
            $("#user_recipes_spinner").html(spin.el).css('position', 'relative');
            var that = this;
            recipes.fetch({
                headers: headers,
                data: data,
                success: function (collection, response, status) {
                    $('#user_recipes').empty();

                    var compiledUserRecipesTemplate = _.template(userRecipesTemplate, {
                        title: title,
                        recipes: collection.models,
                        getDefaultImage: function () {
                            var images = [
                                // paths to default images (when no image for recipe)
                                // TODO: use our images
                                'http://images6.fanpop.com/image/photos/32900000/Sisters-applejack-my-little-pony-friendship-is-magic-32995815-300-300.jpg',
                                'http://www.polyvore.com/cgi/img-thing?.out=jpg&size=l&tid=37434267',
                                'http://www.polyvore.com/cgi/img-thing?.out=jpg&size=l&tid=42240617',
                            ];
                            var randint = function (min, max) {
                                return Math.floor((Math.random() * max) + min);
                            };

                            return images[randint(0, images.length)];
                        },

                        getImageUrl: function (imgId) {
                            return window.app.restapiAddr + "/photos/" + imgId;
                        },
                    });

                    $('#user_recipes').html(compiledUserRecipesTemplate);

                    var compiledPageSelectorTemplate = _.template(pageSelectorTemplate, {
                        currentPage: that.options.page,
                        maxPage: Math.ceil(response.totalElements / that.options.limit),
                    });
                    $('#user_recipes_page_selector1').html(compiledPageSelectorTemplate);
                    $('#user_recipes_page_selector2').html(compiledPageSelectorTemplate);

                    for (var i = 0; i < collection.models.length; i++) {
                        $("#user_recipes").find('.stars_taste:eq(' + i + ')')
                            .html(getRankStars(collection.models[i],"rank","yellow"));
                    }

                },

                error: function (collection, response, status) {
                    alert('Retrieving user recipes failed: '+ response);
                    console.log(response);
                },
            });
        },

        events: {
            'click #user_recipes_page_selector1 .leftarrow': function () {
                this.options.page = this.options.page-1;
                this.render();
            },

            'click #user_recipes_page_selector1 .rightarrow': function () {
                this.options.page = this.options.page+1;
                this.render();
            },
            'click #user_recipes_page_selector2 .leftarrow': function () {
                this.options.page = this.options.page-1;
                this.render();
            },

            'click #user_recipes_page_selector2 .rightarrow': function () {
                this.options.page = this.options.page+1;
                this.render();
            },
        },
    });

    return UserRecipesView;
});
