var query_id = "belleaya";
var bubble_chart_csv = "word_freq/belleaya.csv";
var id_tokens;

var width = 810,
    height = 700,
    radius = 1;

var margin = {top: -5, right: -5, bottom: -5, left: -5};

var mouse_coordinate_x, mouse_coordinate_y;
$("#display_left").mousemove(function(e) {
    mouse_coordinate_x = e.pageX;
    mouse_coordinate_y = e.pageY;
})

var svg = d3.select("#display_left").append("svg")
    .attr("width",  '100%')
    .attr("height", '100%')
    .call(d3.behavior.zoom().scaleExtent([0.8, 5]).on("zoom", function () {
      svg.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")
    }))
    .on('dblclick.zoom', null)
    .attr("transform", "translate(" + margin.left + "," + margin.right + ")")
    .append("g");

var force = d3.layout.force()
    .gravity(0.048)
    .distance(200)
    .charge(function(d, i) { return i==0 ? -500 : -300; })
    .size([width, height]);

// arrow of links
svg.append("defs").selectAll("marker")
    .data(["suit", "licensing", "resolved"])
  .enter().append("marker")
    .attr("id", function(d) { return d; })
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 25)
    .attr("refY", 0)
    .attr("markerWidth", 8)
    .attr("markerHeight", 8)
    .attr("orient", "auto")
  .append("path")
    .attr("d", "M0,-5L10,0L0,5 L10,0 L0, -5")
    .style("stroke", "#272727")
    .style("stroke-width", 2)
    .style("opacity", "1");



d3.json("force_graph/graph.json", function(error, json) {
  if (error) throw error;

  force
      .nodes(json.nodes)
      .links(json.links)
      .start();


  var tip2 = d3.tip()
      .attr('class', 'd3-tip') 
      .offset([0, 10])
      .html(function (d) {
        if(d.fan_comment != 0){
          return "<font color='#C4E1E1'>" + "用詞相似度 = " + JSON.stringify(d.width)+ "</font>" + "<br/><br/>" + "<font color='#FFED97'>" + d.source.name + "</font>" + " 回覆 " + "<font color='#FF9797'>" + d.total_comment + "</font>" + " 篇文章中" + "<br/>" + "有 " + "<font color='#FF9797'>" + d.fan_comment + "</font>" + " 篇文章的作者是 " + "<font color='#FFED97'>" + d.target.name + "</font>";
        }
        else{
          return "<font color='#C4E1E1'>" + "用詞相似度 = " + JSON.stringify(d.width) + "</font>";
        }    
      })
  svg.call(tip2);


  // scale edge-width for opacity
  var maxScaleWidth = 1.0;
  var minScaleWidth = 0.5;
  var maxWidth = 1.0;
  var minWidth = 0.0;
  var width_scale = d3.scale.linear().range([minScaleWidth,maxScaleWidth]).domain([minWidth,maxWidth]);
  
  var link = svg.selectAll(".link")
      .data(json.links)
      .enter().append("line")
      .attr("class", "link")
      .attr("opacity", function(d){
          if(d.value == 1){
            //return '0.8';
            return (width_scale(d.width)).toString();
          }
          else if(d.value == 0){
            //return '0.6';
            return (width_scale(d.width)).toString();
          }                
      })
      .attr("stroke-width", function(d){
        return (1 + Math.exp(d.width * 3)).toString() + 'px'
      })
      .attr("stroke", function(d){
        if(d.value == 1){
            return "#EAC100";
        }
        else if(d.value == 0){
            return "#999";
        }  
      })
      .on('mouseover', function(d){
        tip2.show(d);
        d3.select(this).style("cursor", "pointer");
      })
      .on('mouseout', function(d){
        d3.select(this).style("cursor", "default");
        tip2.hide();
      })
      .style('marker-end', function(d){
        if(d.total_comment != 0){
          return "url(#suit)";
        }         
      });


  var node = svg.selectAll(".node")
      .data(json.nodes)
      .enter().append("g")
      .attr("class", "node")
      .call(force.drag)
      .on('dblclick.zoom', null)
      .on('click', function(d) {
        query_id = d.name;
        bubble_chart_csv = "word_freq/" + String(query_id) +".csv";

        d3.event.stopPropagation();
        if (d3.event.defaultPrevented) {
          return;
        }

        update(bubble_chart_csv, query_id);         
      });
      
  force.drag()
  .on('dragstart', function(d) {
    d3.event.sourceEvent.stopPropagation();
  });    


  node.append("image")
      .attr("xlink:href", function(d){
        if(query_id == d.name){
          return "force_graph/main_person.ico"
        }
        else{
          return "force_graph/person.ico"
        }
      })
      .attr("x", -18)
      .attr("y", -18)
      .attr("width", 32)
      .attr("height", 32)
        .on("mouseover", function(d){ 
        d3.select(this).transition().duration(650).attr("x", -23).attr("y", -23).attr("width", 64).attr("height", 64);
        d3.select(this.parentNode).select("text").transition().duration(650).attr("dx", 32).style("font-size","18px").style("fill","red");
        d3.select(this).style("cursor", "pointer");
      })
        .on("mouseout", function(d){ 
        d3.select(this).transition().duration(650).attr("x", -18).attr("y", -18).attr("width", 32).attr("height", 32);
        d3.select(this.parentNode).select("text").transition().duration(650).attr("dx", 17).style("font-size","13px").style("fill","black");
        d3.select(this).style("cursor", "default");
      });

  node.append("text")
      .attr("dx", 17)
      .attr("dy", ".20em")
      .style("font-size","13px")
      .style("font-family","sans-serif")
      .style("fill","black")
      .text(function(d) { return d.name });



  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
        .attr("cx", function(d) { return d.x = Math.max(radius, Math.min(width - radius, d.x)); })
        .attr("cy", function(d) { return d.y = Math.max(radius, Math.min(height - radius, d.y)); });
  });

  // for collision detection
  var padding = 1, // separation between circles
      radius=8;
  function collide(alpha) {
    var quadtree = d3.geom.quadtree(json.nodes);
    return function(d) {
      var rb = 2*radius + padding,
          nx1 = d.x - rb,
          nx2 = d.x + rb,
          ny1 = d.y - rb,
          ny2 = d.y + rb;
      quadtree.visit(function(quad, x1, y1, x2, y2) {
        if (quad.point && (quad.point !== d)) {
          var x = d.x - quad.point.x,
              y = d.y - quad.point.y,
              l = Math.sqrt(x * x + y * y);
            if (l < rb) {
            l = (l - rb) / l * alpha;
            d.x -= x *= l;
            d.y -= y *= l;
            quad.point.x += x;
            quad.point.y += y;
          }
        }
        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
      });
    };
  }        
});
  
  // for searching node
  var optArray = [];
  for (var i = 0; i < json.nodes.length - 1; i++) {
      optArray.push(json.nodes[i].name);
  }
  optArray = optArray.sort();
  $(function () {
      $("#search").autocomplete({
          source: optArray
      });
  });
  function searchNode() {
      //find the node
      var selectedVal = document.getElementById('search').value;
      var node = svg.selectAll(".node");
      if (selectedVal == "none") {
          node.style("stroke", "white").style("stroke-width", "1");
      } else {
          var selected = node.filter(function (d, i) {
              return d.name != selectedVal;
          });
          selected.style("opacity", "0");
          var link = svg.selectAll(".link");
          link.style("opacity", "0");
      
          // scale edge-width for opacity
          var maxScaleWidth = 1.0;
          var minScaleWidth = 0.5;
          var maxWidth = 1.0;
          var minWidth = 0.0;
          var width_scale = d3.scale.linear().range([minScaleWidth,maxScaleWidth]).domain([minWidth,maxWidth]);

          var node = svg.selectAll(".node");
          node.transition().duration(5000).style("opacity", "1");

          var link = svg.selectAll(".link");
          link.transition().duration(5000).style("opacity", function(d){
              if(d.value == 1){
                //return '0.8';
                return (width_scale(d.width)).toString();
              }
              else if(d.value == 0){
                //return '0.6';
                return (width_scale(d.width)).toString();
              }                
          }) 
          }
  }