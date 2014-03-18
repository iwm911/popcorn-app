var Router = Backbone.Router.extend({
    routes: {
        'index(:page).html': App.Controller.Home,
        'index2(:page).html': App.Controller.Hometv,
        'search/:term(/:page)': App.Controller.Search,
        'searchtv/:term(/:page)': App.Controller.Searchtv,
        'filter/:genre(/:page)': App.Controller.FilterGenre,
        'filtertv/:genre(/:page)': App.Controller.FiltertvGenre
    }
});

App.Router = new Router();

Backbone.history.start({
    hashChange: false,
    pushState: true
});