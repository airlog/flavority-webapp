
define([
    'jquery',
    'underscore',
    'backbone',

    'collections/RecipeCollection',

    'views/Spinner',
    'views/StarsView',

    'text!templates/results.html',
    'text!templates/bestrated_window.html',
], function ($, _, Backbone, RecipeCollection,
        Spinner, StarsView,
        resultsTemplate, bestRatedTemplate) {
    var elementString = "#main_left ";
    var LastAddedView = Backbone.View.extend({
        el: elementString,

        render: function () {
            var divClass = '.recipe-best-rated ';
            var recipes = new RecipeCollection();
            var spin = Spinner().spin();

			// create a container div
			this.$el.append(_.template(bestRatedTemplate, {}));

            // this is to properly place a spinner
            spin.el.style['position'] = null;
            $(elementString + divClass + " .spinner-center")
                .html(spin.el)
                .css('position', 'relative');

            var that = this;
            recipes.fetch({
                data: {
                    limit: 4,               // how much elements to retrieve
                    short: true,            // short JSON (see API)
                    sort_by: 'rate',        // sort by rate, best - on top
                },

                success: function (collection, response, options) {
                    var getRankStars = function (model) {
                        return new StarsView({
                            rank: parseFloat(model.get('rank'))
                        }).getCompiledTemplate();
                    };
                    var compiledTemplate = _.template(resultsTemplate, {
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

                    // stop the spinner
                    $(elementString + divClass + '.spinner').remove();
                    spin.stop();

                    // append compiled template
                    $(elementString + divClass + ".data ").html(compiledTemplate);

                    // append stars
                    for (var i = 0; i < collection.models.length; i++) {
                        $(elementString + divClass)
                            .find('.stars:eq(' + i + ')')
                            .html(getRankStars(collection.models[i]));
                    }
                },

                error: function (collection, response, options) {
                    alert('Error retrieving last added recipes');
                    console.log(response);
                },
            });
        },
    });

    return LastAddedView;
});

