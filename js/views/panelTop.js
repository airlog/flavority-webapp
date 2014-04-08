
define([
    'jquery',
    'underscore',
    'backbone',

    'text!templates/logged.html',
    'text!templates/not_logged.html',
], function($, _, Backbone, loggedTemplate, notLoggedTemplate) {
	
	var PanelTopView = Backbone.View.extend({
		el: $("#panelTop"),
		render: function() {
			var compiledLoggedTemplate = _.template(loggedTemplate, {});
			this.$el.html(compiledLoggedTemplate); 
		},
	});
	
	return PanelTopView;
});
