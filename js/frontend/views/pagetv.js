App.View.Page = Backbone.View.extend({
    className: 'page2',

    initialize: function() {
        this.render();
    },

    render: function() {
        $('.' + this.className).remove();
        this.$el.appendTo('section.container');
        $('<ul class="tv-list"></ul>').appendTo(this.$el);
    },

    show: function() {
        // Fuck you UI.
        var $el = this.$el.hide(),
            $pages = $el.find('.page').addClass('notransition'),
            $tv = $el.find('.tv').removeClass('loaded');

        // ontransitionend could be buggy here.
        setTimeout(function() {
            $pages.removeClass('notransition').hide();

            $el.show();
        }, 350);

        // having a onDOMRendered could solve this shit.
        if ($el.is(App.Page.Home.$el)) {
            setTimeout(function() {
                $el.find('.tv').addClass('loaded');
            }, 400);
        }
    }
});