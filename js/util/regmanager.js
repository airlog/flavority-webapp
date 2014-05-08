define([
    'jquery',
], function($) {
        var registermanager = (function() {        
            var defaultPath = {
    			url: '/auth/signup',	//registration address
            };
            
            var registerUrl = defaultPath.url;		
            
    		var register = function(username, password, opStatus) {
                $.ajax({
                    type: 'POST',
    				url: registerUrl,
                    cache: false,
                    data: {
                        email: username,
                        password: password,
                    },
                    error: opStatus.error,
                    success: opStatus.success,
                });
            };
            
            return {
                register: register,
            };
        })();

    return registermanager;
});

