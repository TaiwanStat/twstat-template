'use strict';

import $ from 'jquery';
import d3 from 'd3';

export default function(data) {
  let width = $('#circle').width() * 0.8;
  let height = $('#circle').height() * 0.8;
  let radius = Math.min(width, height) / 2;
  let color = d3.scale.category20c();
  let svg = d3.select('#circle')
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + (height / 0.8 / 2) + ")");

  let partition = d3.layout.partition()
    .sort(null)
    .size([2 * Math.PI, radius * radius])
    .value(function(d) { return 1; });

  let arc = d3.svg.arc()
    .startAngle(function(d) { return d.x; })
    .endAngle(function(d) { return d.x + d.dx; })
    .innerRadius(function(d) { return Math.sqrt(d.y); })
    .outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });

  let path = svg.datum(data).selectAll('path')
     .data(partition.nodes)
    .enter().append('path')
      .attr('display', function(d) { return d.depth ? null : 'none'; })
      .attr('d', arc)
      .style('stroke', '#fff')
      .style('fill', function(d) { return color((d.children ? d : d.parent).name); })
      .style('fill-rule', 'evenodd');
}
