
define([
    'jquery',
    'underscore',
    'backbone',

    'collections/TagCollection',

    'views/Spinner',

    'text!templates/tags.html',
], function($, _, Backbone, TagCollection, Spinner, tagsTemplate) {
    //+ Jonas Raoni Soares Silva
    //@ http://jsfromhell.com/array/shuffle [v1.0]
    function shuffle(o){ //v1.0
        for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    };	
    
    var reinterpretTags = function (tags) {
        tagsList = [];
        
        // cast to format expected by view function
        tags.forEach(function (model) {
            tagsList.push({
                tag: model.get('name'),
                amount: model.get('amount'),
                count: null,
            });
        });

        // setting count field, needed for style settings  
        var count = 1, counter = 0, groupSize = tagsList.length / 3;    // length is divided by number of style groups
        tagsList.forEach(function (tag) {
            tag.count = count;	        
            if (counter % groupSize == 0) count++;
            counter++;
        });
        
        return shuffle(tagsList); // stop the spinner
    };

    var elementString = '.tags-most-popular ';
    var TagsView = Backbone.View.extend({
        el: $(elementString + '.data'),
        render: function() {
            var tags = new TagCollection();
            var spin = new Spinner().spin();

            // this is to properly place a spinner
            spin.el.style['position'] = null;
            $(elementString + ".spinner-center")
                .html(spin.el)
                .css('position', 'relative');
			
            var that = this;
            tags.fetch({
                data: {
                    limit: 30,	// amount of tags to retrieve
                },

                success: function (collection, response, options) {
                    var compiledTagsTemplate = _.template(tagsTemplate, {
                        tags: reinterpretTags(collection.models),
                    });
                    // stop the spinner
                    $(elementString + '.spinner').remove();
                    spin.stop();

                    that.$el.html(compiledTagsTemplate);    
                },

                error: function (collection, response, options) {
                    alert('Retrieving tags failed');
                    console.log(response);
                },

            }); 
        },
    });

    return TagsView;
});

