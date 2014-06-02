define([
    'jquery',
    'underscore',
    'backbone',
], function($, _, Backbone){
    var RecipeModel = Backbone.Model.extend({
        urlRoot: '/recipes/',

        defaults: {
            dish_name: null,
            preparation_time: null,
            recipe_text: null,
            portions: null,
            difficulty: null,
            tags: [],
            ingredients: [],
            photos: [],
        },
    });

    return RecipeModel;
});
