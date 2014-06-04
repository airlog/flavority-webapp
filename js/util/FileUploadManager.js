
define([
    'jquery',
    'underscore',
], function ($, _) {
    var FileUploadManager = function (url) {
        var _url = url;
        var _activeUploads = 0;

        return {
            upload: function (fileInput, options) {
                if (options == null) options = {};
                var formData = new FormData(fileInput[0]);

                var progressCallback = function () {};
                if (options.hasOwnProperty('progress') == true) progressCallback = options.progress;

                var successCallback = function () {};
                if (options.hasOwnProperty('success')) {
                    successCallback = options.success;
                    delete options['success'];
                }

                var errorCallback = function () {};
                if (options.hasOwnProperty('error')) {
                    errorCallback = options.error;
                    delete options['error'];
                }

                _activeUploads++;
                var settings = {
                    url: _url,
                    type: 'POST',
                    xhr: function () {
                        var myXhr = $.ajaxSettings.xhr();
                        if (myXhr.upload) myXhr.upload.addEventListener('progress', progressCallback, false);
                        return myXhr;
                    },
                    data: formData,

                    success: function (data, status, xhr) {
                        _activeUploads--;

                        return successCallback(data, status, xhr);
                    },
                    error: function (err, status, xhr) {
                        _activeUploads--;

                        return errorCallback(err, status, xhr);
                    },

                    cache: false,
                    contentType: false,
                    processData: false,
                };

                $.extend(settings, options);

                $.ajax(settings);
            },

            getActiveCount: function () {
                return _activeUploads;
            },
        };
    };

    return FileUploadManager;
});

