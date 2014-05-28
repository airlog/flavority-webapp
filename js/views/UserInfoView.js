
define([
    'jquery',
    'underscore',
    'backbone',

    'models/UserModel',

    'views/Spinner',
    'views/StarsView',

    'text!templates/user_info.html',
], function($, _, Backbone, RecipeModel, Spinner, StarsView, userInfoTemplate) {
    var UserInfoView = Backbone.View.extend({
        el: '#panel_right',
        render: function(userId) {

            var getRankStars = function (user, name) {
                return new StarsView({
                    rank: parseFloat(user.get(name))
                }).getCompiledTemplate();
            };

            var recipe = new RecipeModel({id:userId});
            
            this.$el.empty();
            
            var spin = new Spinner().spin();

            spin.el.style['position'] = null;
            this.$el.append("<div style='height: 100px;'><span id='panel_right_spinner' style='position: absolute; display: block; top: 50%;left: 50%;'></span></div>");
            $("#panel_right_spinner").html(spin.el).css('position', 'relative');

            var that = this;
            recipe.fetch({
                success: function (user, response, options) {
                    var compiledUserInfoTemplate = _.template(userInfoTemplate, {
                        user: user,
                    });
                    that.$el.html(compiledUserInfoTemplate);    

                    that.$('.stars_average_rate').html(getRankStars(user, "average_rate"));

                },

                error: function (collection, response, options) {
                    alert('Retrieving user info failed: '+ response);
                    console.log(response);
                },

            }); 
        },
    });

    return UserInfoView;
});
