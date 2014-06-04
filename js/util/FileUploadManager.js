
define([
    'jquery',
    'underscore',
], function ($, _) {
    var FileUploadManager = function (url) {
        var _url = url;

        return {
            upload: function (fileInput, options) {
                if (options == null) options = {};
                var formData = new FormData(fileInput[0]);
                
                var progressCallback = function () {};
                if (options.hasOwnProperty('progress') == true) progressCallback = options.progress;

                var settings = {
                    url: _url,
                    type: 'POST',
                    xhr: function () {
                        var myXhr = $.ajaxSettings.xhr();
                        if (myXhr.upload) myXhr.upload.addEventListener('progress', progressCallback, false);
                        return myXhr;
                    },
                    data: formData,

                    success: null,
                    error: null,

                    cache: false,
                    contentType: false,
                    processData: false,
                };

                $.extend(settings, options);

                $.ajax(settings);
            },
        };
    };

    return FileUploadManager;
});

