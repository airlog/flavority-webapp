
define([
    'jquery',
    'underscore',
], function ($, _) {
    var FileUploadManager = function (url, options) {
        var _url = url;
        var _options = {
            progress: function (ev) {},
            abort: function () {},
            error: function () {},
            success: function () {},
        };

        $.extend(_options, options);        

        return {
            upload: function (fileInput, options) {
                if (options == null) options = {};
                var formData = new FormData(fileInput[0]);
                
                $.extend(options, {
                    url: _url,
                    type: 'POST',
                    xhr: function () {
                        var myXhr = $.ajaxSettings.xhr();
                        if (myXhr.upload) myXhr.upload.addEventListener('progress', _options.progress, false);
                        return myXhr;
                    },
                    data: formData,

                    beforeSend: function (xhr, settings) {
                        alert('sending image');
                    },
                    success: _options.success,
                    error: _options.error,

                    cache: false,
                    contentType: false,
                    processData: false,
                });
                $.ajax(options);
            },
        };
    };

    return FileUploadManager;
});

