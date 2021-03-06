App.View.TvListItem = Marionette.ItemView.extend({
    tagName: 'li',
    className: 'tv',
    model: App.Model.Tv,
    id: function() {
        return 'tv-' + this.model.get('imdb')
    },

    events: {
        'click a': 'select'
    },

    initialize: function() {
        this.render();
    },

    template: _.template('<a href="javascript:;">' +
        '<i class="fa fa-eye fa-3"></i>' +
        '<span class="cover"></span>' +
        '<strong><%- title_item.title %></strong>' +
        '<small><%- trakt_item.year %></small>' +
        '</a>'),

    // TV Show Title from Model
    serializeData: function() {
        return _.extend({}, this.model.attributes, {
            title: this.model.getShortTitle()
        });
    },

    select: function(evt) {
        evt.stopPropagation();
        evt.preventDefault();

        // Event triggered if tv show is loaded.

        if (this.$el.hasClass('active')) {
            this.$el.removeClass('active');
            App.sidebar.hide();
        } else {
            this.$el.parent().find('.active').removeClass('active');
            this.$el.addClass('active');
            App.sidebar.load(this.model);
        }
    }
});