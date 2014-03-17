var request = require('request')
  , URI = require('URIjs');

var API_ENDPOINT = URI('http://api.trakt.tv/'),
	MOVIE_PATH = 'movie',
  SHOW_PATH = 'show',
	API_KEY = '7ea3b12cee84204217c3c06ad264d6bc';

function MovieCollection(imdbIDs) {
	this.ids = imdbIDs;
	return this;
}

MovieCollection.prototype.getSummaries = function(callback) {
	var uri = API_ENDPOINT.clone()
				.segment([
					MOVIE_PATH, 
					'summaries.json', 
					API_KEY, 
					this.ids.join(','),
					'full'
				]);

	request(uri.toString(), {json: true}, function(err, res, body) {
		callback(body);
	});
}

exports.MovieCollection = MovieCollection;

function ShowCollection(slugs) {
  this.ids = slugs;
  return this;
}

ShowCollection.prototype.getSummaries = function(callback) {
  var uri = API_ENDPOINT.clone()
        .segment([
          SHOW_PATH,
          'summaries.json',
          API_KEY,
          this.ids.join(','),
          'normal'
        ]);

  request(uri.toString(), {json: true}, function(err, res, body) {
    callback(body);
  });
}

exports.ShowCollection = ShowCollection;

exports.resizeImage = function(imageUrl, width) {
	var uri = URI(imageUrl),
		ext = uri.suffix()
		file = uri.filename().split('.' + ext)[0];

	return uri.filename(file + '-' + width + '.' + ext).toString();
}
