
define([
    'jquery',
    'underscore',
    'backbone',

    'text!templates/stars.html',
], function ($, _, Backbone, starsTemplate) {
    var StarsView = Backbone.View.extend({
        options: {
            el: '.stars',
            rank: 0.0,          // valid: >= 0.0, <= 5.0
            color: 'yellow',    // valid: yellow, red

            star_empty: 'star_empty.png',
            star_half: {
                yellow: 'star_yellow_half.png',
                red: 'star_red_half.png',
            },
            star_full: {
                yellow: 'star_yellow_full.png',
                red: 'star_red_full.png',
            },
        },

        initialize: function (options) {
            $.extend(this.options, options);
            this.options.rank = parseFloat(this.options.rank);  // ensure float
        },

        render: function () {
            $(this.options.el).html(this.getCompiledTemplate());
        },

        getCompiledTemplate: function () {
            var rank = this.options.rank;
            var elem = this.el;

            for (var i = 0; i < 5; i++) {
                var d = this._getImage(rank, this.options.color);
                rank = d.rank;
                $(elem).append(_.template(starsTemplate, {
                    image: '/images/' + d.image,
                }));
            }

            return elem;
        },

        _getColoredStar: function (star, color) {
            if (color == 'red') return star.red;
            else return star.yellow;
        },

        _getImage: function (rank, color) {
            var image = this.options.star_empty;

            if (rank - 1.0 >= 0.0) {
                image = this._getColoredStar(this.options.star_full, color);
                rank -= 1.0;
            } else if (rank - 0.5 >= 0.0) {
                image = this._getColoredStar(this.options.star_half, color);
                rank -= 0.5;
            }

            return {
                image: image,
                rank: rank,
            };
        },
    });

    return StarsView;
});

