var trakt = require('./js/frontend/providers/trakttv')
var tpb = require('./js/frontend/scrapers/tpb')

function getSlugsFromPopularTelevision(data) {
  var deduplicate = {};
  var output = [];
  for (var i=0; i<data.length; i++) {
    var dedup_name = data[i].slug;
    if (deduplicate[dedup_name]) {
      continue;
    } else {
      deduplicate[dedup_name] = true;
      output.push(dedup_name);
    }
  }
  return output;
}

function getTraktSlugs(slugs, cb) {
  // This function does the request and organizes the output into a key-value object
  var sc = new trakt.ShowCollection(slugs).getSummaries(function(data) {
    var output = {};
    for (var i=0; i<slugs.length; i++) {
      data[i].slug = slugs[i];
      output[slugs[i]] = data[i];
    }
    cb(output);
  });
}

function mergeTraktData(tpbData, slugs, cb) {
  getTraktSlugs(slugs, function(data) {
    for (var i=0; i<tpbData.length; i++) {
      tpbData[i].trakt_item = data[tpbData[i].slug];
    }
    cb(tpbData);
  });
}

function getPopularTelevisionDetails(cb) {
  tpb.getPopularTelevision(function(tpbData) {
    var slugs = getSlugsFromPopularTelevision(tpbData);
    mergeTraktData(tpbData, slugs, function(data) {
      cb(data);
    });
  });
}

module.exports.getPopularTelevisionDetails = getPopularTelevisionDetails;

/*
getPopularTelevisionDetails(function(data) {
  console.log(JSON.stringify(data, undefined, 2));
});
*/
