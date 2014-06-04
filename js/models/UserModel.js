/**
*Module that represents User model.
*@module UserModel
*/
define([
    'jquery',
    'underscore',
    'backbone',
], function($, _, Backbone){
    /**Class constuctor*/
    var UserModel = Backbone.Model.extend({
        urlRoot: '/users',
        defaults: {}
    });

    return UserModel;
});
