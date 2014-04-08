
define([
    'jquery',
    'underscore',
    'backbone',

    'text!templates/tags.html',
], function($, _, Backbone, tagsTemplate) {
	
	var TagsView = Backbone.View.extend({
		el: $("#panel_right"),
		render: function() {
			var compiledTagsTemplate = _.template(tagsTemplate, {
				tags: [
					{'tag': 'rice', 'count': 1},
					{'tag': 'pasta', 'count': 1},
					{'tag': 'easy', 'count': 3},
					{'tag': 'mashrooms', 'count': 2},
					{'tag': 'pizza', 'count': 1},
					{'tag': 'italian', 'count': 3},
					{'tag': 'vegetarian', 'count': 1},
					{'tag': 'spicy', 'count': 2},
					{'tag': 'muffin', 'count': 1},
				],
			});
			this.$el.html(compiledTagsTemplate); 
		},
	});
	
	return TagsView;
});
