'use strict';

import $ from 'jquery';
import d3 from 'd3';
import topojson from 'topojson';

export default function(country, rain) {
  //Taiwan map setting
  let countryFeatures = topojson.feature(country, country.objects['layer1']).features;
  let projection = d3.geo.mercator().center([122.5,24]).scale(6000);
  let path = d3.geo.path().projection(projection);
  let color = d3.scale.category20c();

  d3.select('#map')
    .selectAll('svg')
      .data(countryFeatures)
    .enter()
      .append('path')
      .attr('class', 'country')
      .attr('d', path)
      .attr('fill', function(d) { return color(d.properties.COUNTYNAME); })
      .attr('fill-opacity', 0.5);

  //Site setting
  d3.select('#map')
    .selectAll('circle')
      .data(rain)
    .enter()
      .append('circle')
      .attr('cx', function(d) {
        return projection([d.TWD67Lon, d.TWD67Lat])[0];
      })
      .attr('cy', function(d) {
        return projection([d.TWD67Lon, d.TWD67Lat])[1];
      })
      .attr('r', function(d) {
        return (d.Rainfall10min > 0 || d.Rainfall1hr > 0 || d.Rainfall3hr > 0 || d.Rainfall6hr > 0 || d.Rainfall12hr > 0 || d.Rainfall24hr > 0) ? '2px' : '0px';
      })
      .attr('class', 'site');
}
