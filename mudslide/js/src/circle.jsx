'use strict';

import $ from 'jquery';
import d3 from 'd3';

export default function(id, size, data) {
  let width = size.width;
  let height = size.height;
  let radius = Math.min(width, height) / 2 - 10;
  let color = d3.scale.category20c();

  let svg = d3.select('#' + id)
    .append('g')
      .attr('id', 'circle')
      .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

  let partition = d3.layout.partition()
      .sort(null)
      .size([2 * Math.PI, radius * radius])
      .value(function(d) { console.log(d); return d.size; });

  let arc = d3.svg.arc()
      .startAngle(function(d) { return d.x; })
      .endAngle(function(d) { return d.x + d.dx; })
      .innerRadius(function(d) { return Math.sqrt(d.y); })
      .outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });

  svg
    .datum(data).selectAll('path')
      .data(partition.nodes)
    .enter().append('path')
      .attr('display', function(d) { return d.depth ? null : 'none'; })
      .attr('d', arc)
      .style('stroke', 'black')
      //.style('stroke', '#fff')
      .style('fill', 'white');
      //.style('fill', function(d) { return color((d.children ? d : d.parent).name); })
      //.style('fill-rule', 'evenodd');
}
