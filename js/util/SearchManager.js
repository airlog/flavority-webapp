
define([
    'jquery',
    'collections/RecipeCollection',
], function ($, RecipeCollection) {
    var SearchManager = function () {
        var _recipes = new RecipeCollection();

        return {
            /**
             * Sends a AJAX request to the server which should search for a given text
             * in the recipes database.
             */
            search: function (text, successCallback, errorCallback) {
                _recipes.fetch({
                    data: {
                        limit: 30,
                        short: true,
                        sort_by: 'rate',
                        query: text,
                    },

                    success: successCallback,

                    error: errorCallback,
                });
            },
        };
    };

    return SearchManager;
});

