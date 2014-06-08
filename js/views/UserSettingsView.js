
define([
    'jquery',
    'underscore',
    'backbone',

    'models/UserModel',

    'util/loginmanager',
    'util/FileUploadManager',

    'text!templates/user_settings.html',
    'text!templates/user_settings_avatar.html',
], function ($, _, Backbone,
        UserModel,
        loginManager, FileUploadManager,
        userSettingsTemplate, avatarSettingsTemplate) {
    var uploadManager = FileUploadManager('/photos/');
    var userModel = null;

    var UserSettingsView = Backbone.View.extend({
        el: '#main_left',

        render: function () {
            this.$el.html(_.template(userSettingsTemplate, {}));

            var that = this;
            (new UserModel()).fetch({
                headers: {'X-Flavority-Token': loginManager.getToken(),},

                success: function (model, status, xhr) {
                    userModel = model;
                    var settingsDiv = that.$el.find('#user-settings').first();
                    settingsDiv.append(_.template(avatarSettingsTemplate, {
                        user: model,

                        getImage: function () {
                            if (model.get('avatar') == "") return 'images/default_avatar.png';
                            else return window.app.restapiAddr + "/photos/" + model.get('avatar') + '/';
                        },
                    }));

                    settingsDiv.find('.hidden').hide();
                },

                error: function (err, status, xhr) {
                    alert(err);
                    console.log(status);
                },
            });
        },

        events: {
            'change #form-change-avatar input[name=file]': function (ev) {
                ev.preventDefault();
                var filename = $(ev.currentTarget).val().split(/[\\\/]/).pop();

                if (filename.length == 0) return;
                var validateFileInput = function (successCallback, errorCallback) {
                    if ( ['jpg', 'jpeg', 'png', 'bmp'].indexOf(filename.split('.').pop().toLowerCase()) == -1 ) {
                        return errorCallback('unsupported extension');
                    }

                    return successCallback();
                }
                var getOptions = function () {
                    if ( userModel.get('avatar') != '' ) {
                        return {
                            url: '/photos/' + userModel.get('avatar') + '/',
                            type: 'PUT',
                        };
                    } else {
                        return {
                            url: '/photos/',
                            type: 'POST',
                        };
                    }
                };

                var root = $('#form-change-avatar')
                    .parent()
                        .parent()
                            .parent();
                var progressBar = root.find('progress').first();
                var messages = {
                    success: $('#settings-avatar-messages div[name=success]').first(),
                    error: $('#settings-avatar-messages div[name=error]').first(),
                };

                validateFileInput(function () {
                    var options = {
                        progress: function (ee) {
                            progressBar.show().val(parseInt(ee.loaded / ee.total));
                        },

                        success: function (data, status, xhr) {
                            Backbone.history.loadUrl();
                        },

                        error: function (err, status, xhr) {
                            $(ev.currentTarget).attr('disabled', null);
                            progressBar.hide();
                            messages.error.show();
                            messages.success.hide();
                        },
                    };
                    var otherOpts = getOptions();

                    $.extend(options, otherOpts);
                    uploadManager.upload($(ev.currentTarget).parent(), options);
                    $(ev.currentTarget).attr('disabled', '');
                }, function (err) {
                    alert(err);
                    $(ev.currentTarget).val(null);
                });

                return false;
            },

            'click #btn-delete-avatar': function (ev) {
                if (userModel.get('avatar') == '') return;

                $(ev.currentTarget)
                    .attr('disabled', '')
                    .val('Removing...');
                $('#form-change-avatar input[name=file]').attr('disabled', '');

                $.ajax({
                    url: '/photos/' + userModel.get('avatar') + '/',
                    type: 'DELETE',
                    headers: {'X-Flavority-Token': loginManager.getToken()},
                    success: function (data, status, xhr) {
                        Backbone.history.loadUrl();
                    },
                    error: function (err, status, xhr) {
                        alert('Deleting failed!');
                        $(ev.currentTarget)
                            .attr('disabled', null)
                            .val('Remove');
                        $('#form-change-avatar input[name=file]').attr('disabled', null);
                    },
                });
            },
        },

        clear: function () {
            return this;
        },
    });

    return UserSettingsView;
});
