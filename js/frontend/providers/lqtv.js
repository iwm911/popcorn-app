var lowqualitytv = require('./js/frontend/providers/lowqualitytv');

var LqTv = Backbone.Collection.extend({
  model: App.Model.Tv
});

App.Providers.LqTv = LqTv;
