
require.config({
    paths: {       
        // order of this group must not be changed
        jquery: '//code.jquery.com/jquery-2.1.0.min',
        underscore: '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore-min',
        backbone: '//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min',

        // the above group as local, need to manually download the libraries and adjust paths
//        jquery: 'libs/jquery/jquery',
//        underscore: 'libs/underscore/underscore',
//        backbone: 'libs/backbone/backbone',


        //
        // remote dependancies
        //
                
        text: '//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.10/text',  // plugin for require.js, allows loading text files

        //
        // local dependancies        
        //
               
        templates: '../templates',
    }
});

require([
    'app',
], function (App) {
    App.initialize();
});

