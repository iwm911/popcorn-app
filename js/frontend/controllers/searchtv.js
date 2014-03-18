App.Controller.Searchtv = function(searchtvTerm, page) {
    // Check if page exists
    if (!App.Page.Searchtv) {
        // Create page
        App.Page.Searchtv = new App.View.Page({
            id: 'tv-list'
        });
    }

    var Scrapper = App.currentScrapper;

    var tvCollection = new Scrapper([], {
        keywords: searchtvTerm,
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
        console.log('Searching for ' + searchtvTerm);
        $('.tv-list').first().empty();
        App.loader(true, i18n.__('searchtvLoading'));
        window.initialLoading = true;
        App.Page.Searchtv.show();
    }

    setTimeout(function() {
        tvList.constructor.busy = false;
    }, 5000);
};