/**
*Module that manages search view.
*@module SearchView
*/
define([
    'jquery',
    'underscore',
    'backbone',

    'util/SearchManager',

    'views/Spinner',
    'views/StarsView',

    'text!templates/results.html',
    'text!templates/results_spinner.html',
    'text!templates/page_selector.html',
], function ($, _, Backbone, SearchManager, Spinner, StarsView,
        resultsTemplate, resultsSpinnerTemplate, pageSelectorTemplate) {
    /**Returns new URL*/
    var getUrlForPage = function (newPage) {
        var parts = window.location.hash.split('/');
        parts[parts.length - 1] = newPage;

        return parts.join('/');
    };
    /**Holds recipe sort possibilities*/
    var SortingKeys = {
        ID: 'id',
        RANK: 'rate',
        DATE: 'date_added',
    };
    var elementString = '#main_left ';
    /**Result View object*/
    var ResultsView = Backbone.View.extend({
        /**Default values*/
        _options_defaults: {
            page: 1,
            limit: 30,
            query: null,
            tagList: null,
            sortBy: SortingKeys.ID,
            shortJson: false,
        },

        options: {},
        /**Initialises view*/
        initialize: function (options) {
            $.extend(this.options, this._options_defaults);
            $.extend(this.options, options);
            this.options.page = parseInt(this.options.page);    // page may not be an integer
        },

        el: elementString,
        /**Renders view*/
        render: function() {
            var searchManager = SearchManager();
            var resultsSpinnerCompiledTemplate = _.template(resultsSpinnerTemplate, {});
            var spin = Spinner().spin();

            // remove older content
            // and set loading view (spinner)
            this.$el.children().remove();
            this.$el.html(resultsSpinnerCompiledTemplate);
            this.$el.find('div').first().attr('id', 'recipe-search');

            // this is to properly place a spinner
            spin.el.style['position'] = null;
            $(elementString + ".spinner-center")
                .html(spin.el)
                .css('position', 'relative');

            var that = this;
            var successCallback = function (collection, response, status) {
                var getRankStars = function (model) {
                    return new StarsView({
                        rank: parseFloat(model.get('rank'))
                    }).getCompiledTemplate();
                };
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

                    getImageUrl: function (imgId) {
                        return window.app.restapiAddr + "/photos/" + imgId;
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

                // append stars
                for (var i = 0; i < collection.models.length; i++) {
                    that.$el
                        .find('.data')
                            .find('.stars:eq(' + i + ')')
                            .html(getRankStars(collection.models[i]));
                }
            };
            var errorCallback = function (error, response, status) {
                alert('Error retrieving search results');
                console.log(response);
            }

            if (this.options.query) {
                searchManager.searchByText(
                    this.options.advanced,
                    atob(this.options.query),
                    this.options.page,
                    this.options.limit,
                    successCallback,
                    errorCallback);
            } else if (this.options.tagList) {
                searchManager.searchByTags(
                    this.options.tagList,
                    this.options.page,
                    this.options.limit,
                    successCallback,
                    errorCallback);
            } else {
                searchManager.search({
                        short: this.options.shortJson,
                        page: this.options.page,
                        limit: this.options.limit,
                        sort_by: this.options.sortBy,
                    },
                    successCallback,
                    errorCallback);
            }
        },
        /**Page change events*/
        events: {
            'click #recipe-search .leftarrow': function () {
                Backbone.history.navigate(getUrlForPage(this.options.page - 1));
            },

            'click #recipe-search .rightarrow': function () {
                Backbone.history.navigate(getUrlForPage(this.options.page + 1));
            },
        },

        clear: function () {
            $.extend(this.options, this._options_defaults);
            return this;
        },
        /**Sets page to chosen value*/
        setPage: function (page) {
            this.options.page = page;
            return this;
        },
        /**Sets advanced options*/
        setAdvanced: function (advanced) {
            this.options.advanced = advanced;
            return this;
        },
        /**Sets query*/
        setQuery: function (query) {
            this.options.query = query;
            this.options.tagList = null;
            return this;
        },
        /**Sets tags*/
        setTags: function (tagList) {
            this.options.tagList = tagList;
            this.options.query = null;
            return this;
        },
        /**Sets sorting option*/
        setSortingKey: function (key) {
            this.options.sortBy = key;
            return this;
        },

        setShortJsonEnabled: function (b) {
            this.options.shortJson = b;
            return this;
        },

        SortingKeys: SortingKeys,
    });

    return ResultsView;
});

