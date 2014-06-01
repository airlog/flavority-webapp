
define([
    'jquery',
    'underscore',
    'backbone',

    'collections/IngredientCollection',
    'collections/UnitCollection',

    'text!templates/addrecipe.html',
    'text!templates/addrecipe_ingredientlist_item.html',
    'text!templates/addrecipe_taglist_item.html',
], function ($, _, Backbone,
        IngredientCollection, UnitCollection,
        addRecipeTemplate, ingredientlistItemTemplate, taglistItemTemplate) {
    var RecipeData = function () {
        return {
            _next_ingredient_key: 0,
            
            name: null,
            time: null,
            servings: null,
            difficulty: null,
            ingredients: {},
            tags: [],
            photos: [],

            nextIngredientKey: function () {
                return this._next_ingredient_key++;
            },
        }; 
    };
    
    var elementString = '#main_left ';
    var AddRecipeView = Backbone.View.extend({
        recipeData: RecipeData(),
        
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

        events: {
            // add ingredient
            'click #btn-append-ingredient': function (ev) {
                var parent = $(ev.currentTarget).parent();
                var amount = parseInt(parent.find('input[name=in-ingr-amount]').val()),
                        unit = parent.find('input[name=in-ingr-unit]').val(),
                        ingredient = parent.find('input[name=in-ingr-ingredient]').val();
                if (amount == null
                        || !isFinite(amount) 
                        || unit == null
                        || ingredient == null
                        || ingredient.length == 0) return;
                
                // clear
                parent.find('input[name=in-ingr-amount]').val('');
                parent.find('input[name=in-ingr-unit]').val('');
                parent.find('input[name=in-ingr-ingredient]').val('');
                
                // add to view
                var key = this.recipeData.nextIngredientKey();
                $('#list-ingredients').append(_.template(ingredientlistItemTemplate, {
                    key: key,
                    amount: amount,
                    unit: unit,
                    ingredient: ingredient,
                }));

                // update state
        	    this.recipeData.ingredients[key] = [ingredient, amount, unit];
        	},

        	// remove ingredient 
        	'click .ingredient-remove': function (ev) {
                var key = parseInt($(ev.currentTarget).parent().find('input[name=in-ingr-key]').val());
                delete this.recipeData.ingredients[key];
                $(ev.currentTarget).parent().remove();
        	},

            // add tag
        	'click #btn-append-tag': function (ev) {
        	    var parent = $(ev.currentTarget).parent();
        	    var tagName = parent.find('input[name=in-tag-name]').val();
                if (tagName == null || name.length == 0) return;

                // clear
                parent.find('input[name=in-tag-name]').val('');

                // multiple tags at a time
                var that = this;
        	    tagName.split(/\s+/).forEach(function (name) {
        	        if (name == null || name.length == 0) return;

                    // add to view
                    $('#list-tags').append(_.template(taglistItemTemplate, {name: name}));

                    // update state                    
                    that.recipeData.tags.push(name);
        	    });
        	},

        	// remove tag
        	'click .tag-remove': function (ev) {
        	    var tag = $(ev.currentTarget)
        	        .find('span')
        	        .first()
        	        .text();

        	    this.recipeData.tags = _.reject(this.recipeData.tags, function (ele) { return tag == ele; });
        	    $(ev.currentTarget).parent().remove();
        	},
        },
    });

    return AddRecipeView;
});

