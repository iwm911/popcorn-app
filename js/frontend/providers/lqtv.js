var lowqualitytv = require('./js/frontend/providers/lowqualitytv');

var LqTv = Backbone.Collection.extend({
    model: App.Model.Tv,

    initialize: function(models, options) {
        this.options = options;
        LqTv.__super__.initialize.apply(this, arguments);
    },

    fetch: function() {
        lowqualitytv.getPopularTelevisionDetails(function(tvData) {
            collection.set(tvData);
            collection.trigger('loaded');
            console.log(tvData);
        });
    }
});

App.Providers.LqTv = LqTv;