
define([
    'jquery',
    'underscore',
    'backbone',

    'models/UserModel',

    'views/Spinner',

    'text!templates/user_info.html',
], function($, _, Backbone, RecipeModel, Spinner, userInfoTemplate) {
    var UserInfoView = Backbone.View.extend({
        el: '#panel_right',
        render: function(userId) {
            var recipe = new RecipeModel({id:userId});
            
            $('#panel_right').empty();
            
            var spin = new Spinner().spin();

            spin.el.style['position'] = null;
            $('#panel_right')
                .append("<div style='height: 100px;'><span id='panel_right_spinner' style='position: absolute; display: block; top: 50%;left: 50%;'></span></div>");
            $("#panel_right_spinner").html(spin.el).css('position', 'relative');

            var that = this;
            recipe.fetch({
                success: function (user, response, options) {
                    var compiledUserInfoTemplate = _.template(userInfoTemplate, {
                        user: user,
                    });
                    this.$('#panel_right').html(compiledUserInfoTemplate);    
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
