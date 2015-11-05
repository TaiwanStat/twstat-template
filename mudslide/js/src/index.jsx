'use strict';

import style from './../../css/index';
import d3 from 'd3';
import Map from './taiwan'; 
import Circle from './circle';

(function() {
  d3.json("data/country", function(country) {
    d3.json("data/town.json", function(town) {
      d3.json('data/rain.json', function(rain) {
       d3.json('data/data.json', function(data) {
          Map(country, rain);
          Circle(data);
        });
      });
    });
  });
})();
