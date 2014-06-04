/**
*Module that manages register operation for user.
*@module regmanager
*/
define([
    'jquery',
], function($) {
        /**Class constructor*/
        var regManager = (function() {
            /**Default register path*/
            var defaultPath = {
             url: '/auth/signup',    //registration address
            };
            /**Register path variable*/
            var registerUrl = defaultPath.url;
            /**Handles register action*/
            var register = function(un, p, opt) {
                var regUrl = "/auth/signup";
                $.ajax(regUrl, {
                    type: 'POST',
                    cache: false,
                    data: {email: un, password: p,},
                    error : opt.error,
                    success : opt.success,
                });
            };
            
            return {
                register: register,
            };
        })();

    return regManager;
});

