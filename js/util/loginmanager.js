/**
*Module that manages login operation for user.
*@module loginmanager
*/
define([
    'jquery',
], function($) {
    /**Will return sessionStorage if needed*/
    var Storage = (function() {
        return {
            getInstance: function () {
                return sessionStorage;
            },
        };
    })();
    
    /*Login manager constructor*/
    var loginManager = (function(settings) {
        /**Default path to login in api*/
        var defaults = {
            loginUrl: '/auth/signin',
        };
        /**Login path variable*/
        var mLoginUrl = defaults.loginUrl;
        /**Will store given data in JSON format*/
        var storeData = function(data) {
            Storage.getInstance().flavority = JSON.stringify(data);
        };
        /**Should restore some previously stored data*/
        var restoreData = function() {
            var data = Storage.getInstance().flavority;
            if (data != null && data != '') {
                return JSON.parse(data);
            }
            
            return null;
        };
        /**Removes data*/
        var removeData = function() {
            Storage.getInstance().removeItem('flavority');
        };
        /**Handles login action with given email and password*/
        var login = function(username, password, params) {
            $.ajax(mLoginUrl, {
                type: 'POST',
                cache: false,
                data: {
                    email: username,
                    password: password,
                },
                error: params.error,
                success: function(data, status, jx) {
                    storeData({
                        token: data.token,
                        name: data.user,
                    });
                    
                    if (params.success != null) params.success(data, status, jx);
                },
            });
        };
        /**Handles logout action*/
        var logout = function() {
            removeData();
        };
        /**Returns True if user is logged and False if not*/
        var isLogged = function() {
            var data = restoreData();
            if (data == null || data.token == null) return false;
            return true;
        };
        /**Returns name*/
        var getName = function() {
            var data = restoreData();
            return data.name;
        };
        /**Returns token*/
        var getToken = function () {
            return restoreData().token;
        };

        return {
            login: login,
            logout: logout,
            isLogged: isLogged,
            getName: getName,
            getToken: getToken,
        };
    })();

    return loginManager;
});

