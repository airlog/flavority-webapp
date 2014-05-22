
define([
    'jquery',
    'underscore',
    'backbone',
    
    'util/loginmanager',
	'util/regmanager',
    
    'text!templates/logged.html',
    'text!templates/not_logged.html',
], function($, _, Backbone, loginManager, regManager, loggedTemplate, notLoggedTemplate) {	
	var PanelTopView = Backbone.View.extend({
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
		    var firstValue = Math.floor((Math.random()*10)+1);
            var secondValue = Math.floor((Math.random()*10)+1);
            document.getElementById("fNum").innerHTML = firstValue;
            document.getElementById("sNum").innerHTML = secondValue;
			
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

		
		onRegisterFormSubmit: function() {
		    var fVal = Number(document.getElementById("fNum").innerText);
	        var sVal = Number(document.getElementById("sNum").innerText); 
		    var ans = Number(document.registerform.check.value); 
			
			var pVal = document.getElementById("pass").value;
			var rpVal = document.getElementById("repass").value;

			if(fVal + sVal == ans) {
				if(pVal == rpVal) {
					regManager.register(
					$('#reg-form input[name=email]').val(),
					$('#reg-form input[name=repass]').val(),
					{
						error: function(jrxhr, status, exception) {
							alert("error: " + exception);
						},
						success: function(data, status, jrxhr) {
							alert("success");
							location.reload();
						},
					}
				);
				}
				else {
					alert("Passwords must match!");
				}
			}
			else {
				alert("Enter correct value!");
			}
			
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

