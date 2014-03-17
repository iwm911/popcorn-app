var http = require('http');
var cheerio = require('cheerio');

function grabUserPage(name, page, cb) {
  var options = {
    host: 'thepiratebay.se',
    port: 80,
    path: '/user/' + name + '/' + page.toString() + '/7'
  }

  var fullBody = ''

  http.get(options, function(resp) {
    resp.on('data', function(chunk) {
      fullBody += chunk;
    });
    resp.on('end', function() {
      cb(fullBody);
    });
  });
}

function parseUserPage(data) {
  var $ = cheerio.load(data);
  var len = $('#searchResult > tr').length - 1;
  var output = []
  for (var i = 0; i < len; i++) {
    var item = cheerio.load($('#searchResult > tr:nth-child(' + i + ')'));
    var out_item = {}
    out_item.category_name = item('td.vertTh > center > a:nth-child(1)').html();
    if (out_item.category_name == null) continue;
    out_item.subcategory_name = item('td.vertTh > center > a:nth-child(3)').html();
    out_item.category = parseInt(item('td.vertTh > center > a:nth-child(1)').attr('href').replace('/browse/', ''));
    out_item.subcategory = parseInt(item('td.vertTh > center > a:nth-child(3)').attr('href').replace('/browse/', ''));
    out_item.name = item('td:nth-child(2) > div.detName > a').html();
    var details = item('td:nth-child(2) > font.detDesc').html().match("Uploaded (.*), Size (.*),");
    out_item.upload_time = details[1].replace('&nbsp;', ' ');
    out_item.size = details[2].replace('&nbsp;', ' ');
    out_item.seeders = parseInt(item('td:nth-child(3)').html());
    out_item.leechers = parseInt(item('td:nth-child(4)').html());
    out_item.magnet = item('td:nth-child(2) > a').attr('href');
    out_item.tpb_id = parseInt(item('td:nth-child(2) > div.detName > a.detLink').attr('href').match('/torrent/(.*)/')[1]);
    output.push(out_item)
  }
  return output
}

function slugify(name) {
  return name.replace(/[^\w\d\s]/gi, '').replace(/ /g, '-').toLowerCase();
}

function ettvMetadata(item) {
   var details;
   if (item.name.indexOf(' ') == -1) {
     details = item.name.match('(.*)\\.S([0-9]+)E([0-9]+)\\.(.*)\\.(.*)');
     details[1] = details[1].replace(/\./g, ' ');
   } else {
     details = item.name.match('(.*) S([0-9]+)E([0-9]+) (.*) (.*)');
   }
  return {
    name: details[1],
    slug: slugify(details[1]),
    season: parseInt(details[2]),
    episode: parseInt(details[3]),
    episode_name: null,
    type: details[4],
    source: details[5],
    input_item: item
  }
}

function eztvMetadata(item) {
  var details = item.name.match('(.*) S([0-9]+)E([0-9]+) (.*) (.*)');
  if (details == null) { // Probably the FoV SEASONxEPISODE format
    details = item.name.match('(.*) ([0-9]+)x([0-9]+) ?(.*) (HDTV) (.*)');
    var check720 = details[4].match(/(.*) ?720p$/);
    if (check720) {
      details[4] = check720[1];
      details[5] = '720p';
    }
    details[4] = details[4].replace(' REPACK', '');
  }
  return {
    name: details[1],
    slug: slugify(details[1]),
    season: parseInt(details[2]),
    episode: parseInt(details[3]),
    episode_name: details[4] == '' ? null : details[4].trimRight(),
    type: details[5],
    source: details[6],
    input_item: item
  }
}

function mergeMetadata(list1, list2) {
  var deduplicate = {}
  var midstate = []
  for (var i = 0; i < list1.length; i++) {
    var dedup_name = list1[i].name + 'S' + list1[i].season.toString() + "E" + list1[i].episode.toString();
    if (deduplicate[dedup_name]) {
      continue
    } else {
      deduplicate[dedup_name] = true;
      midstate.push(list1[i]);
    }
  }
  for (var i = 0; i < list2.length; i++) {
    var dedup_name = list2[i].name + 'S' + list2[i].season.toString() + "E" + list2[i].episode.toString();
    if (deduplicate[dedup_name]) {
      continue
    } else {
      deduplicate[dedup_name] = true;
      midstate.push(list2[i]);
    }
  }

  midstate.sort(function(a,b) { return b.input_item.seeders - a.input_item.seeders });

  return midstate;
}

function getPopularTelevision(cb) {
  var ettvData;
  var eztvData;

  grabUserPage('ettv', 0, function(data) {
    var parsed = parseUserPage(data);
    ettvData = parsed.map(ettvMetadata);
    if (eztvData) {
      cb(mergeMetadata(ettvData, eztvData));
    }
  });

  grabUserPage('eztv', 0, function(data) {
    var parsed = parseUserPage(data);
    eztvData = parsed.map(eztvMetadata);
    if (ettvData) {
      cb(mergeMetadata(ettvData, eztvData));
    }
  });
    var options = {
        host: 'thepiratebay.se',
        port: 80,
        path: '/user/' + name + '/' + page.toString() + '/7'
    }

    var fullBody = ''

    http.get(options, function(resp) {
        resp.on('data', function(chunk) {
            fullBody += chunk;
        });
        resp.on('end', function() {
            cb(fullBody);
        });
    });
}

function parseUserPage(data) {
    var $ = cheerio.load(data);
    var len = $('#searchResult > tr').length - 1;
    var output = []
    for (var i = 0; i < len; i++) {
        var item = cheerio.load($('#searchResult > tr:nth-child(' + i + ')'));
        var out_item = {}
        out_item.category_name = item('td.vertTh > center > a:nth-child(1)').html();
        if (out_item.category_name == null) continue;
        out_item.subcategory_name = item('td.vertTh > center > a:nth-child(3)').html();
        out_item.category = parseInt(item('td.vertTh > center > a:nth-child(1)').attr('href').replace('/browse/', ''));
        out_item.subcategory = parseInt(item('td.vertTh > center > a:nth-child(3)').attr('href').replace('/browse/', ''));
        out_item.name = item('td:nth-child(2) > div.detName > a').html();
        var details = item('td:nth-child(2) > font.detDesc').html().match("Uploaded (.*), Size (.*),");
        out_item.upload_time = details[1].replace('&nbsp;', ' ');
        out_item.size = details[2].replace('&nbsp;', ' ');
        out_item.seeders = parseInt(item('td:nth-child(3)').html());
        out_item.leechers = parseInt(item('td:nth-child(4)').html());
        out_item.magnet = item('td:nth-child(2) > a').attr('href');
        out_item.tpb_id = parseInt(item('td:nth-child(2) > div.detName > a.detLink').attr('href').match('/torrent/(.*)/')[1]);
        output.push(out_item)
    }
    return output
}

function nameNormalise(name) {
    if (name.match(/Marvel.?s? Agents of S.?H.?I.?E.?L.?D/i)) {
        return 'Marvels Agents of S.H.I.E.L.D';
    } else {
        return name;
    }
}

function ettvMetadata(item) {
    var details;
    if (item.name.indexOf(' ') == -1) {
        details = item.name.match('(.*)\\.S([0-9]+)E([0-9]+)\\.(.*)\\.(.*)');
        details[1] = details[1].replace(/\./g, ' ');
    } else {
        details = item.name.match('(.*) S([0-9]+)E([0-9]+) (.*) (.*)');
    }
    return {
        name: nameNormalise(details[1]),
        season: parseInt(details[2]),
        episode: parseInt(details[3]),
        episode_name: null,
        type: details[4],
        source: details[5],
        input_item: item
    }
}

function eztvMetadata(item) {
    var details = item.name.match('(.*) S([0-9]+)E([0-9]+) (.*) (.*)');
    if (details == null) { // Probably the FoV SEASONxEPISODE format
        details = item.name.match('(.*) ([0-9]+)x([0-9]+) ?(.*) (HDTV) (.*)');
        var check720 = details[4].match(/(.*) ?720p$/);
        if (check720) {
            details[4] = check720[1];
            details[5] = '720p';
        }
        details[4] = details[4].replace(' REPACK', '');
    }
    return {
        name: nameNormalise(details[1]),
        season: parseInt(details[2]),
        episode: parseInt(details[3]),
        episode_name: details[4] == '' ? null : details[4].trimRight(),
        type: details[5],
        source: details[6],
        input_item: item
    }
}

function mergeMetadata(list1, list2) {
    var deduplicate = {}
    var midstate = []
    for (var i = 0; i < list1.length; i++) {
        var dedup_name = list1[i].name + 'S' + list1[i].season.toString() + "E" + list1[i].episode.toString();
        if (deduplicate[dedup_name]) {
            continue
        } else {
            deduplicate[dedup_name] = true;
            midstate.push(list1[i]);
        }
    }
    for (var i = 0; i < list2.length; i++) {
        var dedup_name = list2[i].name + 'S' + list2[i].season.toString() + "E" + list2[i].episode.toString();
        if (deduplicate[dedup_name]) {
            continue
        } else {
            deduplicate[dedup_name] = true;
            midstate.push(list2[i]);
        }
    }

    midstate.sort(function(a, b) {
        return b.input_item.seeders - a.input_item.seeders
    });

    return midstate;
}

function getPopularTelevision(cb) {
    var ettvData;
    var eztvData;

    grabUserPage('ettv', 0, function(data) {
        var parsed = parseUserPage(data);
        ettvData = parsed.map(ettvMetadata);
        if (eztvData) {
            cb(mergeMetadata(ettvData, eztvData));
        }
    });

    grabUserPage('eztv', 0, function(data) {
        var parsed = parseUserPage(data);
        eztvData = parsed.map(eztvMetadata);
        if (ettvData) {
            cb(mergeMetadata(ettvData, eztvData));
        }
    });
  var options = {
    host: 'thepiratebay.se',
    port: 80,
    path: '/user/' + name + '/' + page.toString() + '/7'
  }

  var fullBody = ''

  http.get(options, function(resp) {
    resp.on('data', function(chunk) {
      fullBody += chunk;
    });
    resp.on('end', function() {
      cb(fullBody);
    });
  });
}

function parseUserPage(data) {
  var $ = cheerio.load(data);
  var len = $('#searchResult > tr').length - 1;
  var output = []
  for (var i = 0; i < len; i++) {
    var item = cheerio.load($('#searchResult > tr:nth-child(' + i + ')'));
    var out_item = {}
    out_item.category_name = item('td.vertTh > center > a:nth-child(1)').html();
    if (out_item.category_name == null) continue;
    out_item.subcategory_name = item('td.vertTh > center > a:nth-child(3)').html();
    out_item.category = parseInt(item('td.vertTh > center > a:nth-child(1)').attr('href').replace('/browse/', ''));
    out_item.subcategory = parseInt(item('td.vertTh > center > a:nth-child(3)').attr('href').replace('/browse/', ''));
    out_item.name = item('td:nth-child(2) > div.detName > a').html();
    var details = item('td:nth-child(2) > font.detDesc').html().match("Uploaded (.*), Size (.*),");
    out_item.upload_time = details[1].replace('&nbsp;', ' ');
    out_item.size = details[2].replace('&nbsp;', ' ');
    out_item.seeders = parseInt(item('td:nth-child(3)').html());
    out_item.leechers = parseInt(item('td:nth-child(4)').html());
    out_item.magnet = item('td:nth-child(2) > a').attr('href');
    out_item.tpb_id = parseInt(item('td:nth-child(2) > div.detName > a.detLink').attr('href').match('/torrent/(.*)/')[1]);
    output.push(out_item)
  }
  return output
}

function nameNormalise(name) {
  if (name.match(/Marvel.?s? Agents of S.?H.?I.?E.?L.?D/i)) {
    return 'Marvels Agents of S.H.I.E.L.D';
  } else {
    return name;
  }
}

function ettvMetadata(item) {
   var details;
   if (item.name.indexOf(' ') == -1) {
     details = item.name.match('(.*)\\.S([0-9]+)E([0-9]+)\\.(.*)\\.(.*)');
     details[1] = details[1].replace(/\./g, ' ');
   } else {
     details = item.name.match('(.*) S([0-9]+)E([0-9]+) (.*) (.*)');
   }
   return {
     name: nameNormalise(details[1]),
     season: parseInt(details[2]),
     episode: parseInt(details[3]),
     episode_name: null,
     type: details[4],
     source: details[5],
     input_item: item
   }
}

function eztvMetadata(item) {
  var details = item.name.match('(.*) S([0-9]+)E([0-9]+) (.*) (.*)');
  if (details == null) { // Probably the FoV SEASONxEPISODE format
    details = item.name.match('(.*) ([0-9]+)x([0-9]+) ?(.*) (HDTV) (.*)');
    var check720 = details[4].match(/(.*) ?720p$/);
    if (check720) {
      details[4] = check720[1];
      details[5] = '720p';
    }
    details[4] = details[4].replace(' REPACK', '');
  }
  return {
    name: nameNormalise(details[1]),
    season: parseInt(details[2]),
    episode: parseInt(details[3]),
    episode_name: details[4] == '' ? null : details[4].trimRight(),
    type: details[5],
    source: details[6],
    input_item: item
  }
}

function mergeMetadata(list1, list2) {
  var deduplicate = {}
  var midstate = []
  for (var i = 0; i < list1.length; i++) {
    var dedup_name = list1[i].name + 'S' + list1[i].season.toString() + "E" + list1[i].episode.toString();
    if (deduplicate[dedup_name]) {
      continue
    } else {
      deduplicate[dedup_name] = true;
      midstate.push(list1[i]);
    }
  }
  for (var i = 0; i < list2.length; i++) {
    var dedup_name = list2[i].name + 'S' + list2[i].season.toString() + "E" + list2[i].episode.toString();
    if (deduplicate[dedup_name]) {
      continue
    } else {
      deduplicate[dedup_name] = true;
      midstate.push(list2[i]);
    }
  }

  midstate.sort(function(a,b) { return b.input_item.seeders - a.input_item.seeders });

  return midstate;
}

function getPopularTelevision(cb) {
  var ettvData;
  var eztvData;

  grabUserPage('ettv', 0, function(data) {
    var parsed = parseUserPage(data);
    ettvData = parsed.map(ettvMetadata);
    if (eztvData) {
      cb(mergeMetadata(ettvData, eztvData));
    }
  });

  grabUserPage('eztv', 0, function(data) {
    var parsed = parseUserPage(data);
    eztvData = parsed.map(eztvMetadata);
    if (ettvData) {
      cb(mergeMetadata(ettvData, eztvData));
    }
  });
}

module.exports.getPopularTelevision = getPopularTelevision;

// getPopularTelevision(function(data) { console.log(data); });
// getPopularTelevision(function(data) { console.log(data); });
