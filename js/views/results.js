
define([
    'jquery',
    'underscore',
    'backbone',

    'collections/RecipeCollection',

    'views/Spinner',

    'text!templates/results.html',
    'text!templates/results_spinner.html',
    'text!templates/page_selector.html',
], function ($, _, Backbone, RecipeCollection, Spinner,
        resultsTemplate, resultsSpinnerTemplate, pageSelectorTemplate) {
    var getUrlForPage = function (newPage) {
        var parts = window.location.hash.split('/');
        parts[parts.length - 2] = newPage;

        return parts.join('/');
    };

    var elementString = '#main_left ';
    var ResultsView = Backbone.View.extend({
        // default values
        options: {
            page: 1,
            limit: 30,
        },

        initialize: function (options) {
            $.extend(this.options, options);
            this.options.page = parseInt(this.options.page);    // page may not be an integer
        },

        el: elementString,

        render: function() {
            var recipes = new RecipeCollection();
            var resultsSpinnerCompiledTemplate = _.template(resultsSpinnerTemplate, {});
            var spin = Spinner().spin();

            // remove older content
            // and set loading view (spinner)
            this.$el.children().remove();
            this.$el.html(resultsSpinnerCompiledTemplate);

            // this is to properly place a spinner
            spin.el.style['position'] = null;
            $(elementString + ".spinner-center")
                .html(spin.el)
                .css('position', 'relative');

            var that = this;
            recipes.fetch({
                data: {
                    limit: that.options.limit,
                    short: true,
                    page: that.options.page,
                    sort_by: 'date_added',
                },

                success: function (collection, response, status) {
                    var compiledResultsTemplate = _.template(resultsTemplate, {
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
                    });

                    var compiledPageSelectorTemplate = _.template(pageSelectorTemplate, {
                        currentPage: that.options.page,
                        maxPage: Math.ceil(response.totalElements / that.options.limit),
                    });

                    // stop the spinner
                    $(elementString + '.spinner').remove();
                    spin.stop();

                    that.$el.find('.data').html(compiledResultsTemplate);
                    that.$el.find('.page-selector').html(compiledPageSelectorTemplate);
                },

                error: function (error, response, status) {
                    alert('Error retrieving recipes');
                    console.log(response);
                },
            });
        },

        events: {
            'click .leftarrow': function () {
                window.app.router.navigate(getUrlForPage(this.options.page - 1));
            },

            'click .rightarrow': function () {
                window.app.router.navigate(getUrlForPage(this.options.page + 1));
            },
        },
    });
	
    return ResultsView;
});
