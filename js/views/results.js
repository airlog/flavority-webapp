
define([
    'jquery',
    'underscore',
    'backbone',

    'text!templates/results.html',
], function($, _, Backbone, resultsTemplate) {
	
	var ResultsView = Backbone.View.extend({
		el: $("#main_left"),
		render: function() {
			var compiledResultsTemplate = _.template(resultsTemplate, {
				search: 'dinner',
				results: {'all': 245, 'from': 1, 'to': 10}, 
				recipes: [
					{'id': 1,'name': 'Kotlety mielone', 'taste': 0.2, 'img': '/images/photo.png'},
					{'id': 2,'name': 'Zupa cebulowa', 'taste': 0.7, 'img': 'http://hostedmedia.reimanpub.com/TOH/Images/Photos/37/300x300/exps14208_CB7482C157A.jpg'},
					{'id': 3,'name': 'Naleśniki', 'taste': 1.2, 'img': '/images/photo.png'},
					{'id': 4,'name': 'Lody', 'taste': 1.6, 'img': '/images/photo.png'},
					{'id': 5,'name': 'Makaron', 'taste': 2.1, 'img': 'http://www.oikosyogurt.com/assets/images/oikos-recipes/images/pesto-chicken-broccoli-alfredo.jpg'},
					{'id': 6,'name': 'Koktajl', 'taste': 2.7, 'img': '/images/photo.png'},
					{'id': 7,'name': 'Zapiekanka', 'taste': 3.1, 'img': '/images/photo.png'},
					{'id': 8,'name': 'Pizza', 'taste': 3.5, 'img': '/images/photo.png'},
					{'id': 9,'name': 'Pieczona kaczka', 'taste': 4.0, 'img': '/images/photo.png'},
					{'id': 10,'name': 'Kurczak w cieście francuskim', 'taste': 4.5, 'img': '/images/photo.png'},
				],
			});
			this.$el.html(compiledResultsTemplate); 
		},
	});
	
	return ResultsView;
});
