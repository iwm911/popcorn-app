App.Controller.FilterGenreTv = function(genre, page) {
    // Check if page exists
    if (!App.Page.FilterGenre) {
        // Create page
        App.Page.FilterGenre = new App.View.Page({
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
        App.Page.FilterGenre.show();
    }

    setTimeout(function() {
        tvList.constructor.busy = false;
    }, 5000);
};