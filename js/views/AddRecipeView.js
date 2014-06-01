
define([
    'jquery',
    'underscore',
    'backbone',

    'collections/IngredientCollection',
    'collections/UnitCollection',

    'text!templates/addrecipe.html',
], function ($, _, Backbone,
        IngredientCollection, UnitCollection,
        addRecipeTemplate) {
    var elementString = '#main_left ';
    var AddRecipeView = Backbone.View.extend({
        el: elementString,
        
        render: function () {
            var that = this;
            (new UnitCollection()).fetch({
                success: function (collection, response, status) {
                    that.$el.html(_.template(addRecipeTemplate, {
                        units: collection.models,

                        validMarks: [0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0],
                    }));

                    that.$el.find('.area').jqte({
                        sub: false,
                        sup: false,
                        remove: false,
                        rule: false,
                        source: false,
                    });
                },

                error: function (err, response, status) {
                    alert('Retrieving ingredients failed!');
                    console.log(err);
                },
            });
        },
    });

    return AddRecipeView;
});

