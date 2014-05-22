define([
    'jquery',
], function($) {
        var regManager = (function() {
            var defaultPath = {
             url: '/auth/signup',	//registration address
            };
            
            var registerUrl = defaultPath.url;
            
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

