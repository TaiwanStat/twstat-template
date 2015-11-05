'use strict';

import d3 from 'd3';
import $ from 'jquery';
import topojson from 'topojson';

export default function(id, size, country, data) {
  let width = size.width;
  let height = size.height;
  let radius = Math.min(width, height) / 2 - 10;

  let features = topojson.feature(country, country.objects['layer1']).features;
  let path = d3.geo.path().projection(
    d3.geo.mercator().center([118.7, 24.5]).scale(4000)
  );

  let svg = d3.select('#' + id)
    .append('g')
      .attr('id', 'map');

  svg
    .selectAll("path")
      .data(features)
    .enter().append("path")
      .attr("d",path);

  svg
    .append('circle')
      .attr('r', radius)
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('fill', 'none')
      .attr('stroke', 'white')
      .attr('stroke-width', radius / 2);
}
