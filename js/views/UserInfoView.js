/**
*Module that manages user's info view.
*@module UserInfoView
*/
define([
    'jquery',
    'underscore',
    'backbone',

    'util/loginmanager',

    'models/UserModel',

    'views/Spinner',
    'views/StarsView',

    'text!templates/user_info.html',
], function($, _, Backbone, loginManager, UserModel, Spinner, StarsView, userInfoTemplate) {
    /**Variable that represents class object*/
    var UserInfoView = Backbone.View.extend({
        el: '#panel_right',
        options: {
            searchId: false,
        },
        /**Sets proper search ID*/
        setSearchId: function(search) {
            this.options.searchId = search;
        },
        /**Render view*/
        render: function(userId) {
            /**Returns stars amount*/
            var getRankStars = function (user, name) {
                return new StarsView({
                    rank: parseFloat(user.get(name))
                }).getCompiledTemplate();
            };
            /**Represents ser model*/
            var user = new UserModel({id:userId});
            var myHeaders = {};
            if (this.options.searchId) {
                if (!loginManager.isLogged()) {
                    console.log("Niezalogowany!");
                    //TO DO niezalogowany wszedł na strone mycomments lub myrecipes
                }
                user = new UserModel();
                token = loginManager.getToken();
                myHeaders = {'X-Flavority-Token': token};
            }
            
            this.$el.empty();
            
            var spin = new Spinner().spin();

            spin.el.style['position'] = null;
            this.$el.append("<div style='height: 100px;'><span id='panel_right_spinner' style='position: absolute; display: block; top: 50%;left: 50%;'></span></div>");
            $("#panel_right_spinner").html(spin.el).css('position', 'relative');

            var that = this;
            /**Fetch from database*/
            user.fetch({
                headers: myHeaders,
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
