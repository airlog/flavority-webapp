
define([
    'jquery',
    'underscore',
    'backbone',
    
    'collections/IngredientCollection',

    'util/loginmanager',
	'util/regmanager',
	'util/SearchManager',
    
    'text!templates/logged.html',
    'text!templates/not_logged.html',
], function($, _, Backbone, IngredientCollection,
		loginManager, regManager, SearchManager,
		loggedTemplate, notLoggedTemplate) {	
	var _searchManager = SearchManager();
	var PanelTopView = Backbone.View.extend({
		el: $("#panelTop"),
		formVisible: false,
		regFormVisible: false,
		advancedSearchFormVisible: false,
		userMenuVisible: false,
        ingredients: [],
		
		events: {
			'click #log_in a': 'triggerLoginForm',
			'submit #login-form form': 'onLoginFormSubmit',

			'click #register a': 'triggerRegisterForm',
			'submit #reg-form form': 'onRegisterFormSubmit',

			'click #advanced_search a': 'triggerAdvancedSearchForm',
			'click .advanced-search-add': 'addTextAdvancedSearch',
			'click .advanced-search-remove': 'removeTextAdvancedSearch',
			'click #advanced-search-submit': 'onAdvancedSearchSubmit',
		    
			'click #actions_button1': 'onTriggerUserMenu',
			'click #user_actions a[name=logout]': 'onLogout',
			'click #user_actions a[name=myrecipes]': 'goToMyRecipes',
			'click #user_actions a[name=mycomments]': 'goToMyComments',

            'submit #form-search': function (e) {
                var ele = $(e.currentTarget).find('#searchtext')[0];
                var text = ele.value;
                ele.value = "";
                
                Backbone.history.navigate('#/search/query/' + btoa(text) + '/1', {trigger: true,});
                return false;   // do not reload
            },
		},
		
		triggerRegisterForm: function() {
		    var firstValue = Math.floor((Math.random()*10)+1);
            var secondValue = Math.floor((Math.random()*10)+1);
            document.getElementById("fNum").innerHTML = firstValue;
            document.getElementById("sNum").innerHTML = secondValue;
			
			if(!this.regFormVisible) {
                $('#login-form').hide();
                $('#reg-form').show();
				$('#advanced-search-form').hide();
				this.formVisible = false;
                this.regFormVisible = true;
				this.advancedSearchFormVisible = false;
			}
			else {
				$('#reg-form').hide();
				this.regFormVisible = false;
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
			if(!this.formVisible) {
                $('#login-form').show();
                $('#reg-form').hide();
				$('#advanced-search-form').hide();
				this.formVisible = true;
                this.regFormVisible = false;
				this.advancedSearchFormVisible = false;
			}
			else {
				$('#login-form').hide();
				this.formVisible = false;
			}
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
		
        triggerAdvancedSearchForm: function() {			
			if(!this.advancedSearchFormVisible) {
                this.ingredients = [];
                $('#login-form').hide();
                $('#reg-form').hide();
				$('#advanced-search-form').show();
                $('#advanced-search-added').empty();
				this.formVisible = false;
                this.regFormVisible = false;
				this.advancedSearchFormVisible = true;
			}
			else {
				$('#advanced-search-form').hide();
				this.advancedSearchFormVisible = false;
			}
		},
        
        addTextAdvancedSearch: function(ev) {
            ev.preventDefault();
            ingredient = $('#advanced-search-form input[name=ingredient]').val();
            $('#advanced-search-form input[name=ingredient]').val("");
            this.ingredients.push(ingredient);
            $('#advanced-search-added').append("<button id=\"" + ingredient + "\" class=\"advanced-search-remove green_button\" style=\"display:block;\">"+ingredient+" &nbsp; X</button>");
            console.log(this.ingredients);
            return false;
        },
        
        removeTextAdvancedSearch: function(ev) {
            ev.preventDefault();
            this.ingredients.splice(this.ingredients.indexOf(ev.currentTarget.id), 1);
            ev.currentTarget.remove();
            return false;
        },
        
        onAdvancedSearchSubmit: function(ev) {
            ev.preventDefault();            
            console.log(JSON.stringify(this.ingredients));
            $('#advanced-search-form').hide();
            this.advancedSearchFormVisible = false;            
            Backbone.history.navigate('#/search/advanced/' + btoa(JSON.stringify(this.ingredients)) + '/1', {trigger: true,});
            return false;
       },

        goToMyRecipes: function() {
            $('#user_actions').hide();
            this.userMenuVisible = false;
            Backbone.history.navigate('#/myrecipes', {trigger: true,});            
        },

        goToMyComments: function() {
            $('#user_actions').hide();
            this.userMenuVisible = false;            
            Backbone.history.navigate('#/mycomments', {trigger: true,});            
        },
        
		render: function() {
            var ingredients_collection = new IngredientCollection();
            var that = this;
            
            ingredients_collection.fetch({
                data: {
                },
                
                success: function (collection, response, status) {
                    var template = notLoggedTemplate;
                    var name = "";
                    if (loginManager.isLogged()) {
                        template = loggedTemplate;
                        name = loginManager.getName();
                    }
                    var compiledLoggedTemplate = _.template(template, {
                        ingredients_list: collection.models,
                        user_name: name,
                    });
                    that.$el.html(compiledLoggedTemplate);        
                },

                error: function (collection, response, status) {
                    alert('Retrieving comments failed: '+ response);
                },
            });
        },
    });

    return PanelTopView;
});
