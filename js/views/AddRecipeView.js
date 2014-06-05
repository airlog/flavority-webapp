
define([
    'jquery',
    'underscore',
    'backbone',

    'collections/IngredientCollection',
    'collections/UnitCollection',
    'models/RecipeModel',
    'util/FileUploadManager',
    'util/loginmanager',

    'text!templates/addrecipe.html',
    'text!templates/addrecipe_ingredientlist_item.html',
    'text!templates/addrecipe_taglist_item.html',
    'text!templates/addrecipe_filelist_item.html',
], function ($, _, Backbone,
        IngredientCollection, UnitCollection, RecipeModel, FileUploadManager, loginManager,
        addRecipeTemplate, ingredientlistItemTemplate, taglistItemTemplate, filelistItemTemplate) {
    var RecipeData = function () {
        return {
            _next_ingredient_key: 0,

            dishname: null,
            time: null,
            servings: null,
            difficulty: null,
            text: null,
            ingredients: {},
            tags: [],
            photos: [],
            removedPhotos: [],

            nextIngredientKey: function () {
                return this._next_ingredient_key++;
            },

            validate: function (successCallback, errorCallback) {
                if (successCallback == null) successCallback = function () { return true; };
                if (errorCallback == null) errorCallback = function () { return false; };

                if (this.dishname == null || this.dishname.length == 0) return errorCallback('name field is not valid');
                if (this.time == null || !_.isNumber(this.time) || !_.isFinite(this.time)) return errorCallback('time field is not valid');
                if (this.servings == null || !_.isNumber(this.servings) || !_.isFinite(this.servings)) return errorCallback('servings field is not valid');
                if (this.difficulty == null || !_.isNumber(this.difficulty) || !_.isFinite(this.difficulty)) return errorCallback('difficulty field is not valid');
                if (_.size(this.ingredients) == 0) return errorCallback('not enough ingredients');
                if (this.text == null || this.text.length == 0) return errorCallback('text field is not valid');

                return successCallback();
            },

            ingredientsToList: function () {
                var ingr = [];
                for (var key in this.ingredients) {
                    ingr.push(this.ingredients[key]);
                }
                return ingr;
            },
        };
    };

    var elementString = '#main_left ';
    var AddRecipeView = Backbone.View.extend({
        recipeData: RecipeData(),

        uploadManager: FileUploadManager('/photos/'),

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
                var tagName = parent.find('input[name=in-tag-name]').first().val();
                if (tagName == null || tagName.length == 0) return;

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

            // select file for upload
            'change #form-add-recipe-upload-photo input[name=file]': function (ev) {
                var filename = $(ev.currentTarget).val().split(/[\\\/]/).pop();

                var validateFileInput = function (successCallback, errorCallback) {
                    if ( ['jpg', 'jpeg', 'png', 'bmp'].indexOf(filename.split('.').pop().toLowerCase()) == -1 ) {
                        return errorCallback('unsupported extension');
                    }

                    return successCallback();
                }

                var that = this;
                validateFileInput(function () {
                    $('#list-files').append(_.template(filelistItemTemplate, {filename: filename}));
                    var item = $('#list-files')
                        .children()
                        .last();

                    item.find('.photo-remove').hide();
                    that.uploadManager.upload($(ev.currentTarget).parent(), {
                        progress: function (ev) {
                            item.find('.text-progress').text( ((ev.loaded * 100) / ev.total).toFixed(0) );
                        },

                        error: function () {
                            alert('Error!');
                        },

                        success: function (data, status, xhr) {
                            that.recipeData.photos.push(parseInt(data.id));
                            item.find('input[name=in-photo-id]').val(data.id);
                            item.find('.photo-remove').show();
                        },
                    });
                }, function (err) {
                    alert('File validation failed: ' + err + '!');
                });

                $(ev.currentTarget).parent()[0].reset();
            },

            // remove added photo
            'click #list-files .photo-remove': function (ev) {
                var pid = parseInt(
                    $(ev.currentTarget)
                        .parent()
                        .find('input[name=in-photo-id]')
                        .first()
                        .text());
                this.recipeData.photos = _.reject(this.recipeData.photos, function (ele) { return pid == ele; });
                this.recipeData.removedPhotos.push(pid);
                $(ev.currentTarget).parent().remove();
            },

            // submit new recipe
            'submit #form-add-recipe': function (ev) {
                // TODO: user can now submit the form during file upload which shouldn't be possible
                ev.preventDefault();

                // prohibit submitting form when files are being uploaded
                if (this.uploadManager.getActiveCount() != 0) {
                    alert('Can\'t submit new recipe when files are being uploaded!');
                    console.log('active uploads' + this.uploadManager.getActiveCount());

                    return false;
                }

                this.recipeData.dishname = $($('#form-add-recipe')[0][0]).val();
                this.recipeData.time = parseInt($($('#form-add-recipe')[0][1]).val());
                this.recipeData.servings = parseInt($($('#form-add-recipe')[0][2]).val());
                this.recipeData.difficulty = parseFloat($($('#form-add-recipe')[0][3]).val());
                this.recipeData.text = $($('#form-add-recipe')[0][4]).val()

                var data = this.recipeData;
                this.recipeData.validate(function () {
                    var recipe = new RecipeModel({
                        // this fields are valid backbone representation
                        dish_name: data.dishname,
                        preparation_time: data.time,
                        recipe_text: data.text,
                        portions: data.servings,
                        difficulty: data.difficulty,

                        // this fields are specific to the remote destination parameters
                        tags: data.tags,
                        ingredients: data.ingredientsToList(),
                        photos: data.photos,
                    });

                    var headers = {};
                    if (loginManager.isLogged()) {
                        token = loginManager.getToken();
                        headers = {'X-Flavority-Token': token};
                    }
                    else {
                        alert("Jesteś nie zalogowany.");
                        return;
                    }

                    recipe.save({}, {
                        headers: headers,

                        wait: true,

                        success: function (model, status, xhr) {
                            // navigate to just added recipe's page
                            Backbone.history.navigate('#/recipes/' + model.get('id') + '/', {trigger: true});
                        },

                        error: function (err, status, xhr) {
                            alert('Error saving!');
                            console.log(err);
                        },
                    });
                }, function (err) {
                    alert('Validating form data failed!\nError: ' + err);
                });

                return false;
            },
        },

        clear: function () {
            this.recipeData = RecipeData();
            this.uploadManger = FileUploadManager('/photos/');
            return this;
        },
    });

    return AddRecipeView;
});

