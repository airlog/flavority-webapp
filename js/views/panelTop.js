
define([
    'jquery',
    'underscore',
    'backbone',
    
    'util/loginmanager',
    
    'text!templates/logged.html',
    'text!templates/not_logged.html',
], function($, _, Backbone, loginManager, loggedTemplate, notLoggedTemplate) {	
	var PanelTopView = Backbone.View.extend({
	//TODO: input validation
		el: $("#panelTop"),
		formVisible: false,
		regFormVisible: false,
		userMenuVisible: false,
		
		events: {
			'click #log_in a': 'triggerLoginForm',
			'submit #login-form form': 'onLoginFormSubmit',

			'click #register a': 'triggerRegisterForm',
			'submit #reg-form form': 'onRegisterFormSubmit',
		    
			'click #actions_button1': 'onTriggerUserMenu',
			'click #user_actions a[name=logout]': 'onLogout',
		},

		triggerRegisterForm: function()
		{
			if(!this.regFormVisible)
			{
				if(this.formVisible)
				{
					$('#login-form').hide();
					this.formVisible = !this.formVisible;
				}
				$('#reg-form').show();
				this.regFormVisible = !this.regFormVisible;
			}
			else
			{
				$('#reg-form').hide();
				this.regFormVisible = !this.regFormVisible;
			}
		},
		
		onRegisterFormSubmit: function()
		{
			loginManager.register(un, 
														p,
													{
														error: function(jrxhr, status, exception)
														{
															$('#reg-form').hide();
															this.regFormVisible = !this.regFormVisible;
															alert("Reg failed: " + exception);
														},
														success: function(data, status, jrxhr)
														{
															$('#reg-form').hide();
															this.regFormVisible = !this.regFormVisible;
															alert("Reg successful");
														},
													}
			);
			return false;
		},
		
		triggerLoginForm: function() {
			if (!this.formVisible)
			{
				if(this.regFormVisible)
				{
					$("#reg-form").hide();
					this.regFormVisible = !this.regFormVisible;
				}
				$("#login-form").show();
			}
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

