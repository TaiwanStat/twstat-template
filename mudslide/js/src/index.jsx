'use strict';

import style from './../../css/index';
import d3 from 'd3';
import $ from 'jquery';
import Map from './map'; 
import Circle from './circle';

(function() {
  d3.json('data/country.json', function(country) {
    d3.json('data/town.json', function(town) {
      d3.json('data/rain.json', function(rain) {
       d3.json('data/data.json', function(data) {
          let id = 'content';

          let size = {};
          size.width = $('#' + id).width();
          size.height = $('#' + id).height();

          Map(id, size, country, rain);
          Circle(id, size, data);
        });
      });
    });
  });
})();
