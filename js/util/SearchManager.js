
define([
    'jquery',
    'collections/RecipeCollection',
], function ($, RecipeCollection) {
    var SearchManager = function () {
        var _recipes = new RecipeCollection();

        return {
            /**
             * Sends an AJAX request to the server which should search for a given text
             * in the recipes database.
             */
            // FIXME: advanced search should be another method
            searchByText: function (advanced, text, page, limit, successCallback, errorCallback) {
                console.log("searching by text");
                _recipes.fetch({
                    data: {
                        advanced: advanced,
                        limit: limit,
                        short: true,
                        sort_by: 'rate',
                        query: text,
                        page: page,
                    },

                    success: successCallback,

                    error: errorCallback,
                });
            },

            /**
             * Sends an AJAX request to the server which should search for recipes marked
             * with tags identified by given id list.
             */
            searchByTags: function (tagIds, page, limit, successCallback, errorCallback) {
                console.log("searching by tags");
                _recipes.fetch({
                    data: {
                        tag_id: tagIds,
                        page: page,
                        limit: limit,
                        sort_by: 'rate',
                        short: true,
                    },

                    traditional: true,	// stacking tag_id

                    success: successCallback,

                    error: errorCallback,
                });
            },

            search: function (data, successCallback, errorCallback, opts) {
                console.log("custom search, opts = " + opts);
                var options = {
                    data: data,
                    success: successCallback,
                    error: errorCallback,
                };

                $.extend(options, opts);
                _recipes.fetch(options);
            },
        };
    };

    return SearchManager;
});
