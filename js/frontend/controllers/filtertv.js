App.Controller.FiltertvGenre = function(genre, page) {
    // Check if page exists
    if (!App.Page.FiltertvGenre) {
        // Create page
        App.Page.FiltertvGenre = new App.View.Page({
            id: 'tv-list'
        });
    }

    var Scrapper = App.currentScrapper;

    var tvCollection = new Scrapper([], {
        keywords: null,
        genre: genre,
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
        App.Page.FiltertvGenre.show();
    }

    setTimeout(function() {
        tvList.constructor.busy = false;
    }, 5000);
};