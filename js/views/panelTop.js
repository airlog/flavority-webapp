
define([
    'jquery',
    'underscore',
    'backbone',
    
    'util/loginmanager',
    
    'text!templates/logged.html',
    'text!templates/not_logged.html',
], function($, _, Backbone, loginManager, loggedTemplate, notLoggedTemplate) {	
	var PanelTopView = Backbone.View.extend({
		el: $("#panelTop"),
		formVisible: false,
		userMenuVisible: false,
		
		events: {
			'click #log_in a': 'triggerLoginForm',
			'submit #login-form form': 'onLoginFormSubmit',
		    
			'click #actions_button1': 'onTriggerUserMenu',
			'click #user_actions a[name=logout]': 'onLogout',
		},
		
		triggerLoginForm: function() {
			if (!this.formVisible) $("#login-form").show();
			else $("#login-form").hide();
			this.formVisible = !this.formVisible;
		},
		
		onLoginFormSubmit: function() {
			loginManager.login(
				$('#login-form input[name=email]').val(),
				$('#login-form input[name=password]').val(),
				{
					error: function(jrxhr, status, exception) {
						alert(status + " " + exception);
		            },
					success: function(data, status, jrxhr) {
						alert(status);		            
						location.reload();
					},
				}
			);
		    
			return false;   // no need to trigger default from behaviour
		},
		
		onTriggerUserMenu: function(event) {
			if (this.userMenuVisible) $('#user_actions').hide();
			else $('#user_actions').show();
			this.userMenuVisible = !this.userMenuVisible;
		},
		
		onLogout: function() {
			loginManager.logout();
			location.reload();
		},
		
		render: function() {
			var template = notLoggedTemplate;
			if (loginManager.isLogged()) template = loggedTemplate;
			
			var compiledLoggedTemplate = _.template(template);
			this.$el.html(compiledLoggedTemplate);
		},
	});
	
	return PanelTopView;
});

