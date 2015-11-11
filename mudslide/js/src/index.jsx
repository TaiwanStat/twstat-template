'use strict';

//import style
import style from './../../css/index';

//import jsx
import L from 'leaflet';
import {init as Init, site as Site} from './map';

(function() {
  let rain = require('json!./../../data/rain.json');
  let map = L.map('map')
    .setView(new L.LatLng(23.619, 120.795), 8);

  Init(map);
  Site(map, rain);
})();
