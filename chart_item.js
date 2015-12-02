var path = require('path');
var url = require('url');

var lists = require('./lists.json');
var post_arr = [];

post_arr.push(lists);

lists.data.page.forEach(function(p) {
  if(!url.parse(p.url).protocol) {
    post_arr.push({
      "data": {
        "chart_description": p
      },
      "partials": './include/partials.js',
      "layout": path.join(p.url, "index.hbs"),
      "filename": path.join(p.url, "index.html")
    });
  }
});

module.exports = post_arr;
