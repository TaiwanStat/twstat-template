module.exports = function(root, rawdata) {
  var element = root.getElementsByClassName('bc')[0]
  var heightOverWidth = 1.0;
  var margin = {top: 30, right: 120, bottom: 0, left: 120},
      width = element.clientWidth - margin.left - margin.right,
      height = (element.clientWidth * heightOverWidth) - margin.top - margin.bottom;

  format = d3.format(",d"),
  fill = d3.scale.category20c();

  var Radius = width;

  var data = tableToHierarchy(rawdata.Sheet1, 'Parent', 'Item', 'Value', 'Population');
  var totalNodeCount = data.totalNodeCount;

  // Recompute new radius
  var bubble = d3.layout.pack()
                 .sort(null)
                 .size([Radius, Radius])
                 .padding(1.5);

  var vis = d3.select(element).append("svg")
              .attr("width", width)
              .attr("height", height)
              .attr("class", "bubble bubble-chart-widget-svg");

  function classes(root) {
    var classes = [];

      function recurse(name, node) {
        if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
        else classes.push({packageName: name, className: node.name, value: node.size, value2: node.population});
      }

      recurse(null, root);
      return {children: classes};
  }

  var node = vis.selectAll("g.node")
      .data(bubble.nodes(classes(data))
      .filter(function(d) { return !d.children; }))
      .enter().append("g")
              .attr("class", "node")
              .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  node.append("title")
      .text(function(d) { return d.className + ": " + format(d.value); });

  node.append("rect")
      .attr({
        x: function(d) {return -d.r * 0.8;},
        y: function(d) {return -d.r * 0.8;},
        width: function(d) {return d.r * 1.6;},
        height: function(d) {return d.r * 1.6;},
      })
      .style("fill", function(d) { return fill(d.packageName); });
      

  node.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", ".3em")
      .attr("font-family", "cursive")
      .style("font-size","15px")
      .text(function(d) { return d.className.substring(0, d.r / 3); })
      .on("click", function() {
            d3.select(this)
                .transition().duration(1000)
                .attr("transform", "scale(0,1)")
                .transition().duration(1000)
                .attr("transform", "scale(1,1)")
                .text(function(d) {return d.className.substring(0, d.r / 3) + " " + d.value2});
      });       
};

function tableToHierarchy(table, parentCol, nameCol, valueCol, val2Col) {
  var root = [];
  var byName = {};
  var unnamed = 1;

  for (var i = 0; i < table.length; i++) {
    var parent = table[i][parentCol] || null;
    var name = table[i][nameCol];
    if (!name) {
      name = ('unnamed-node-' + unnamed);
      unnamed += 1;
    }
    var size = table[i][valueCol] || 0;
    var population = table[i][val2Col] || 0;
    
    try {
      size = parseFloat(size);
    } catch(e) {
      size = 0;
    }

    var node = {
      parent: parent,
      name: name,
      size: size
      population: population
    };

    root.push(node);
    byName[node.name] = node;
  }

  // Now we add all parents that weren't nodes.
  var root2 = [];

  for (var i = 0; i < root.length; i++) {
    var node = root[i];
    root2.push(node);
    if ((node.parent) && (! (node.parent in byName))) {
      var newNode = {
        name: node.parent,
        value: 0,
        parent: null
      }
      root2.push(newNode);
      byName[newNode.name] = newNode;
    }
  }

  // OK. Now we've got every node. We can start wiring up children to parents.
  var root3 = [];
  for (var i = 0; i < root2.length; i++) {
    var node = root2[i];
    if (node.parent) {
      if (! byName[node.parent].children) {
        byName[node.parent].children = [];
      }
      byName[node.parent].children.push(node);
    } else {
      // It's a true root!
      root3.push(node);
    }
  }

  // Now we consolidate into one top node.
  var ret;
  if (root3.length == 1) {
    ret = root3[0];
  } else {
    ret = {
      name: "All Nodes",
      children: root3
    }
  }
  
  ret.totalNodeCount = root.length;

  return ret;
}