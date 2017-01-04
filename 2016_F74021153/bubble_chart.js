redraw(bubble_chart_csv, query_id);

function update(bubble_chart_csv, query_id){
    var x = document.getElementById('display3');
    x.innerHTML = "";

    redraw(bubble_chart_csv, query_id);      
}

function redraw(bubble_chart_csv, query_id){
    $('#display2 info').hide().html("<font color='#FFB6C1' size='10'>" + query_id + "</font>" + " &nbsp;的詞頻分布").fadeTo(500, 1);
    
    var width = 595,
        height = 595,
        padding = 1.5, // separation between same-color nodes
        clusterPadding = 6, // separation between different-color nodes
        maxRadius = 12,
        radius = 1;

    var color = d3.scale.ordinal()
          .range(["#77b2a0", "#ad697a"]);

    var margin = {top: -5, right: -5, bottom: -5, left: -5};
    d3.text(bubble_chart_csv, function(error, text) {
      if (error) throw error;
      var colNames = "text,size,group\n" + text;
      var data = d3.csv.parse(colNames);

      var tip = d3.tip()
          .attr('class', 'd3-tip') 
          .offset([0, 0])
          .html(function (d) {
              return "講過 " + String(d.amount) + " 次"
          })
      svg.call(tip);


      data.forEach(function(d) {
        d.size = +d.size;
      });


    //unique cluster/group id's
    var cs = [];
    data.forEach(function(d){
            if(!cs.contains(d.group)) {
                cs.push(d.group);
            }
    });

    var n = data.length, // total number of nodes
        m = cs.length; // number of distinct clusters

    //create clusters and nodes
    var clusters = new Array(m);
    var nodes = [];
    for (var i = 0; i<n; i++){
        nodes.push(create_nodes(data,i));
    }

    var force2 = d3.layout.force()
        .nodes(nodes)
        .size([width, height])
        .gravity(.02)
        .charge(-0.1)
        .on("tick", tick)
        .start();

    var svg2 = d3.select("#display3").append("svg")
        .attr("width", width)
        .attr("height", height)
        .call(d3.behavior.zoom().scaleExtent([0.8, 5]).on("zoom", function () {
          svg2.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")
        }))
        .on("mouseover", function(d){
          d3.select(this).style("cursor", "pointer");                 
        })
        .on("mouseout", function(d){ 
          d3.select(this).style("cursor", "default");
        })
        .on('dblclick.zoom', null)
        .attr("transform", "translate(" + margin.left + "," + margin.right + ")")
        .append("g");       
  

    var node = svg2.selectAll("circle")       
        .data(nodes)
        .enter().append("g").call(force2.drag)
        .on("click", function(d){
            tip.show(d);
        })
        .on("mouseover", function(d){
          d3.select(this).transition().duration(300).style("fill", "#fb6060");
          d3.select(this).style("cursor", "pointer");
        })
        .on("mouseout", function(d){ 
          d3.select(this).transition().duration(300).style("fill", "black");
          d3.select(this).style("cursor", "default");
          tip.hide();
        });

    force2.drag()
    .on('dragstart', function(d) {
      d3.event.sourceEvent.stopPropagation();
    });

    node.append("circle").style('opacity', 0.3).style('opacity', 0.8).transition().duration(1200)
        .style("fill", function (d) {
        return color(d.cluster);
        })
        .attr("r", function(d){return d.radius});
        

    node.append("text").style('opacity', 1).transition().duration(1200)
          .attr("dy", ".3em")
          .style("text-anchor", "middle")
          .style("font-size", function(d) { return (Math.min(2 * d.radius, (2 * d.radius - 8) / this.getComputedTextLength() * 24))/3 + "px"; })
          .text(function(d) { return d.text.substring(0, d.radius / 3); });



    function create_nodes(data,node_counter) {
      var minRadius = 20;
      var maxRadius = 90;
      var maxNodeFreq = data[0].size;
      var minNodeFreq = data[data.length-1].size;
      var scale = d3.scale.linear().range([minRadius,maxRadius]).domain([minNodeFreq,maxNodeFreq]);

      var i = cs.indexOf(data[node_counter].group),
          d = {
            cluster: i,
            amount: data[node_counter].size,
            radius: scale(data[node_counter].size),
            text: data[node_counter].text,
            x: Math.cos(i / m * 2 * Math.PI) * 200 + width / 2 + Math.random(),
            y: Math.sin(i / m * 2 * Math.PI) * 200 + height / 2 + Math.random()
          };
      if (!clusters[i]) clusters[i] = d;
      return d;
    };



    function tick(e) {
        node.each(cluster(10 * e.alpha * e.alpha))
            .each(collide(.5))
        .attr("transform", function (d) {
            var k = "translate(" + Math.max(radius, Math.min(width - radius, d.x)) + "," + Math.max(radius, Math.min(height - radius, d.y)) + ")";
            return k;
        });
    }

    // Move d to be adjacent to the cluster node.
    function cluster(alpha) {
        return function (d) {
            var cluster = clusters[d.cluster];
            if (cluster === d) return;
            var x = d.x - cluster.x,
                y = d.y - cluster.y,
                l = Math.sqrt(x * x + y * y),
                r = d.radius + cluster.radius;
            if (l != r) {
                l = (l - r) / l * alpha;
                d.x -= x *= l;
                d.y -= y *= l;
                cluster.x += x;
                cluster.y += y;
            }
        };
    }

    
    // Resolves collisions between d and all other circles.
    function collide(alpha) {
        var quadtree = d3.geom.quadtree(nodes);
        return function (d) {
            var r = d.radius + maxRadius + Math.max(padding, clusterPadding),
                nx1 = d.x - r,
                nx2 = d.x + r,
                ny1 = d.y - r,
                ny2 = d.y + r;
            quadtree.visit(function (quad, x1, y1, x2, y2) {
                if (quad.point && (quad.point !== d)) {
                    var x = d.x - quad.point.x,
                        y = d.y - quad.point.y,
                        l = Math.sqrt(x * x + y * y),
                        r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? padding : clusterPadding);
                    if (l < r) {
                        l = (l - r) / l * alpha;
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
    

    Array.prototype.contains = function(v) {
        for(var i = 0; i < this.length; i++) {
            if(this[i] === v) return true;
        }
        return false;
    };      
}
