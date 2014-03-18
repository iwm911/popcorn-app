App.Controller.SearchTv = function(searchTerm, page) {
    // Check if page exists
    if (!App.Page.Search) {
        // Create page
        App.Page.Search = new App.View.Page({
            id: 'tv-list'
        });
    }

    var Scrapper = App.currentScrapper;

    var tvCollection = new Scrapper([], {
        keywords: searchTerm,
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
        console.log('Searching for ' + searchTerm);
        $('.tv-list').first().empty();
        App.loader(true, i18n.__('searchLoading'));
        window.initialLoading = true;
        App.Page.Search.show();
    }

    setTimeout(function() {
        tvList.constructor.busy = false;
    }, 5000);
};