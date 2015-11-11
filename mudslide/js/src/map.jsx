'use strict';

import L from 'leaflet';

export function init(map) {
  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    maxZoom: 17,
    minZoom: 8,
    attribution: "Imagery from <a href=\"http://giscience.uni-hd.de/\">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a>",
    id: "hsuting.o4lf8mg0",
    accessToken: "pk.eyJ1IjoiaHN1dGluZyIsImEiOiJRajF4Y0hjIn0.9UDt8uw_fxEX791Styd-lA"
  }).addTo(map);
}

export function site(map, data) {
  let icon = L.icon({
    iconUrl: 'image/marker-icon.png',
    shadowUrl: 'image/marker-shadow.png'
  });

  for(let i in data) {
    if(data[i].Rainfall10min != "0" || data[i].Rainfall1hr != "0" || data[i].Rainfall3hr != "0"
      || data[i].Rainfall6hr != "0" || data[i].Rainfall12hr != "0" || data[i].Rainfall24hr != "0") {

      let html = "";
      for(let key in data[i]) {
        html = html + key + ": " + data[i][key] + "<br>";
      }

      L.marker([data[i].TWD67Lat, data[i].TWD67Lon], {icon: icon})
        .addTo(map)
        .bindPopup(html);
 
    }
  }
}

export function line(map, data) {
  L.geoJson(data, {
    style: function(feature) {
      return {
        color: "red",
        opacity: 1
      }
    }
  }).addTo(map);
}
