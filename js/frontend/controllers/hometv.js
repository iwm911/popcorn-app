App.Controller.Hometv = function(page) {
    // Check if page exists
    if (!App.Page.Hometv) {
        // Create page
        App.Page.Hometv = new App.View.Page({
            id: 'tv-list'
        });
    }

    var Scrapper = App.currentScrapper;

    var tvCollection = new Scrapper([], {
        keywords: null,
        genre: null,
        page: page
    });

    tvCollection.fetch();

    // Create tv list
    var tvList = new App.View.TvList({
        model: tvCollection
    });

    // Clean up if first page
    if (!page || page == '1') {
        $('.tv-list').first().empty();
        App.sidebar = new App.View.Sidebar({
            el: 'sidebar'
        });

        App.Page.Hometv.show();
    }

    setTimeout(function() {
        tvList.constructor.busy = false;
    }, 5000);
};