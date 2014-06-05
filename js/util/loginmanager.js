
define([
    'jquery',
], function($) {
    var Storage = (function() {
        return {
            getInstance: function () {
                return sessionStorage;
            },
        };
    })();

    var loginManager = (function(settings) {
        var defaults = {
            loginUrl: '/auth/signin',
        };

        var mLoginUrl = defaults.loginUrl;

        var storeData = function(data) {
            Storage.getInstance().flavority = JSON.stringify(data);
        };

        var restoreData = function() {
            var data = Storage.getInstance().flavority;
            if (data != null && data != '') {
                return JSON.parse(data);
            }

            return null;
        };

        var removeData = function() {
            Storage.getInstance().removeItem('flavority');
        };

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

        var logout = function() {
            removeData();
        };

        var isLogged = function() {
            var data = restoreData();
            if (data == null || data.token == null) return false;
            return true;
        };

        var getName = function() {
            var data = restoreData();
            return data.name;
        };

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

