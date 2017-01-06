// Dimensions of sunburst.
var width = 650;
var height = 500;
var radius = Math.min(width, height) / 2;

// Breadcrumb dimensions: width, height, spacing, width of tip/tail.
var b = {
  w: 75, h: 30, s: 3, t: 10
};

// Mapping of step names to colors.
var colors = {
  "預算":"#00E3E3",
  "歲入":"#FF9797",
  "歲出":" #0080FF",
  "稅課收入":" 	#FF8040",
  "營業盈餘": "#FF60AF",
  "罰款收入": " #FF5151",
  "規費收入": "#FFBB77",
  "其他收入": " 	#FFD306",
  "財產收入": "#C07AB8",
  "一般政務": "#C4E1FF",
  "國防支出": " 	#BEBEBE",
  "教育科學文化":"#D6D6AD",
  "經濟發展":" 	#6A6AFF",
  "社會福利":"#00AEAE",
  "社區發展及環境保護":" 	#82D900",
  "債務支出":" #FFFF6F",
  "退休撫卹支出":" 	#9999CC",
  "一般補助":" 	#5CADAD 	",
  "其他支出":" 	 	#A5A552",
  "所得稅":"#CE0000",
  "遺產及贈與稅":" #FF0080",
  "關稅":"#FF359A",
  "貨物稅":"#FFBFFF",
  "證券交易稅":" 	#D9006C",
  "期貨交易稅":"#FFED97",
  "菸酒稅":"#FFBB77",
  "特種貨物及勞務稅":" 	#E2C2DE",
  "營業稅":"#F75000",
  "罰金罰鍰及怠金":" 	#AE00AE",
  "沒入及沒收財物":"#FF9797",
  "賠償收入":"#FFF3EE",
  "行政規費":"#d3a4ff",
  "司法規費": "#CCFF80",
  "使用規費": "#D2A2CC",
  "財產孳息": "#FFE153",
  "財產售價": "#FF2D2D",
  "財產作價": "#FF00FF",
  "投資收回": "#ff7575",
  "廢舊物資售價": "#8E8E8E",
  "營業基金盈餘繳庫":"#FFCC66",
  "非營業特種基金賸餘繳庫":"#ffaad5",
  "投資收益":"#FF9224",
  "捐獻收入":" 	#BEBEBE",
  "學雜費收入":"#B87070",
  "雜項收入":" 	#FFECEC",
  "國務支出":"#81C0C0",
  "行政支出":" 	#8E8E8E",
  "立法支出":"#DCB5FF",
  "司法支出":" 	#80FFFF",
  "考試支出":"#B87070",
  "監察支出":"#C7C7E2",
  "民政支出":"#81C0C0",
  "外交支出":"#4F9D9D",
  "財務支出":"#d0d0d0",
  "邊政支出":"#00E3E3",
  "僑務支出":" 	#005AB5",
  "國防支出":"#66B3FF",
  "教育支出":"#d3a4ff",
  "科學支出": "#CCFF80",
  "文化支出": "#AE57A4",
  "農業支出": "#FFE153",
  "工業支出": "#00DB00",
  "交通支出": "#7D7DFF",
  "其他經濟服務": "#C4E1FF",
  "社會保險": "#8E8E8E",
  "社會救助":"#FFCC66",
  "福利服務":" 	#01B468",
  "國民就業":"#FF9224",
  "醫療保健":" 	#BEBEBE",
  "環境保護":"#B87070",
  "退休撫卹給付":"#0066CC",
  "退休撫卹業務":"#81C0C0",
  "債務付息":"#5A5AAD",
  "還本付息事務":"#81C0C0",
  "專案補助":"#73BF00",
  "平衡預算補助":"#A5A552",
  "其他支出":"#ACD6FF",
  "第二預備金":"#4A4AFF",
};

var colors1 = {
  "預算":"#00E3E3",
  "歲入":"#FF9797",
  "歲出":" #0080FF",
  "稅課收入":" 	#FF8040",
  "營業盈餘": "#FF60AF",
  "罰款收入": " #FF5151",
  "規費收入": "#FFBB77",
  "其他收入": " 	#FFD306",
  "財產收入": "#C07AB8",
  "一般政務": "#C4E1FF",
  "教育科學文化":"#D6D6AD",
  "經濟發展":" 	#6A6AFF",
  "社會福利":"#00AEAE",
  "社區發展及環境保護":" 	#82D900",
  "債務支出":" #FFFF6F",
  "退休撫卹支出":" 	#9999CC",
  "一般補助":" 	#5CADAD 	",
  "其他支出":" 	 	#A5A552",
};
var colors2 = {
  "國務支出":"#81C0C0",
  "行政支出":" 	#8E8E8E",
  "立法支出":"#DCB5FF",
  "司法支出":" 	#80FFFF",
  "考試支出":"#B87070",
  "監察支出":"#C7C7E2",
  "民政支出":"#81C0C0",
  "外交支出":"#4F9D9D",
  "財務支出":"#d0d0d0",
  "邊政支出":"#00E3E3",
  "僑務支出":" 	#005AB5",
  "國防支出":"#66B3FF",
  "教育支出":"#d3a4ff",
  "科學支出": "#CCFF80",
  "文化支出": "#AE57A4",
  "農業支出": "#FFE153",
  "工業支出": "#00DB00",
  "交通支出": "#7D7DFF",
  "其他經濟服務": "#C4E1FF",
  "社會保險": "#8E8E8E",
  "社會救助":"#FFCC66",
  "福利服務":" 	#01B468",
  "國民就業":"#FF9224",
  "醫療保健":" 	#BEBEBE",
  "環境保護":"#B87070",
  "退休撫卹給付":"#0066CC",
  "退休撫卹業務":"#81C0C0",
  "債務付息":"#5A5AAD",
  "還本付息事務":"#81C0C0",
  "專案補助":"#73BF00",
  "平衡預算補助":"#A5A552",
  "其他支出":"#ACD6FF",
  "第二預備金":"#4A4AFF",
};
var colors3 = {
  "所得稅":"#CE0000",
  "遺產及贈與稅":" #FF0080",
  "關稅":"#FF359A",
  "貨物稅":"#FFBFFF",
  "證券交易稅":" 	#D9006C",
  "期貨交易稅":"#FFED97",
  "菸酒稅":"#FFBB77",
  "特種貨物及勞務稅":" 	#E2C2DE",
  "營業稅":"#F75000",
  "罰金罰鍰及怠金":" 	#AE00AE",
  "沒入及沒收財物":"#FF9797",
  "賠償收入":"#FFF3EE",
  "行政規費":"#d3a4ff",
  "司法規費": "#CCFF80",
  "使用規費": "#D2A2CC",
  "財產孳息": "#FFE153",
  "財產售價": "#FF2D2D",
  "財產作價": "#FF00FF",
  "投資收回": "#ff7575",
  "廢舊物資售價": "#8E8E8E",
  "營業基金盈餘繳庫":"#FFCC66",
  "非營業特種基金賸餘繳庫":"#ffaad5",
  "投資收益":"#FF9224",
  "捐獻收入":" 	#BEBEBE",
  "學雜費收入":"#B87070",
  "雜項收入":" 	#FFECEC",

};
// Total size of all segments; we set this later, after loading the data.
var totalSize = 0; 

var vis = d3.select("#chart").append("svg:svg")
    .attr("width", width)
    .attr("height", height)
    .append("svg:g")
    .attr("id", "container")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var partition = d3.layout.partition()
    .size([2 * Math.PI, radius * radius])
    .value(function(d) { return d.size; });

var arc = d3.svg.arc()
    .startAngle(function(d) { return d.x; })
    .endAngle(function(d) { return d.x + d.dx; })
    .innerRadius(function(d) { return Math.sqrt(d.y); })
    .outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });

// Use d3.text and d3.csv.parseRows so that we do not need to have a header
// row, and can receive the csv as an array of arrays.
d3.text("1221.csv", function(text) {
  var csv = d3.csv.parseRows(text);
  var json = buildHierarchy(csv);
  createVisualization(json);
});

// Main function to draw and set up the visualization, once we have the data.
function createVisualization(json) {

  // Basic setup of page elements.
  initializeBreadcrumbTrail();
  drawLegend();
  drawLegend1();
  drawLegend2();
  drawLegend3();
  //d3.select("#togglelegend").on("click", toggleLegend);
  d3.select("#togglelegend");

  // Bounding circle underneath the sunburst, to make it easier to detect
  // when the mouse leaves the parent g.
  vis.append("svg:circle")
      .attr("r", radius)
      .style("opacity", 0);

  // For efficiency, filter nodes to keep only those large enough to see.
  var nodes = partition.nodes(json)
      .filter(function(d) {
      return (d.dx > 0.005); // 0.005 radians = 0.29 degrees
      });

  var path = vis.data([json]).selectAll("path")
      .data(nodes)
      .enter().append("svg:path")
      .attr("display", function(d) { return d.depth ? null : "none"; })
      .attr("d", arc)
      .attr("fill-rule", "evenodd")
      .style("fill", function(d) { return colors[d.name]; })
      .style("opacity", 1)
      .on("mouseover", mouseover);

  // Add the mouseleave handler to the bounding circle.
  d3.select("#container").on("mouseleave", mouseleave);

  // Get total size of the tree = value of root node from partition.
  totalSize = path.node().__data__.value;
 };

// Fade all but the current sequence, and show it in the breadcrumb trail.
function mouseover(d) {

  var percentage = (100 * d.value / totalSize).toPrecision(3);
  var percentageString = percentage + "%";
  //var percentageString = d.value/107;
  //percentageString = Math.round(percentageString * 100) / 100
  if (percentage < 0.1) {
    percentageString = "< 0.1%";
  }

  d3.select("#percentage")
      .text(percentageString);

  d3.select("#explanation")
      .style("visibility", "");

  var sequenceArray = getAncestors(d);
  updateBreadcrumbs(sequenceArray, percentageString);

  // Fade all the segments.
  d3.selectAll("path")
      .style("opacity", 0.3);

  // Then highlight only those that are an ancestor of the current segment.
  vis.selectAll("path")
      .filter(function(node) {
                return (sequenceArray.indexOf(node) >= 0);
              })
      .style("opacity", 1);
}

// Restore everything to full opacity when moving off the visualization.
function mouseleave(d) {

  // Hide the breadcrumb trail
  d3.select("#trail")
      .style("visibility", "hidden");

  // Deactivate all segments during transition.
  d3.selectAll("path").on("mouseover", null);

  // Transition each segment to full opacity and then reactivate it.
  d3.selectAll("path")
      .transition()
      .duration(1000)
      .style("opacity", 1)
      .each("end", function() {
              d3.select(this).on("mouseover", mouseover);
            });

  d3.select("#explanation")
      .style("visibility", "hidden");
}

// Given a node in a partition layout, return an array of all of its ancestor
// nodes, highest first, but excluding the root.
function getAncestors(node) {
  var path = [];
  var current = node;
  while (current.parent) {
    path.unshift(current);
    current = current.parent;
  }
  return path;
}

function initializeBreadcrumbTrail() {
  // Add the svg area.
  var trail = d3.select("#sequence").append("svg:svg")
      .attr("width", width)
      .attr("height", 50)
      .attr("id", "trail");
  // Add the label at the end, for the percentage.
  trail.append("svg:text")
    .attr("id", "endlabel")
    .style("fill", "#000");
}

// Generate a string that describes the points of a breadcrumb polygon.
function breadcrumbPoints(d, i) {
  var points = [];
  points.push("0,0");
  points.push(b.w + ",0");
  points.push(b.w + b.t + "," + (b.h / 2));
  points.push(b.w + "," + b.h);
  points.push("0," + b.h);
  if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
    points.push(b.t + "," + (b.h / 2));
  }
  return points.join(" ");
}

// Update the breadcrumb trail to show the current sequence and percentage.
function updateBreadcrumbs(nodeArray, percentageString) {

  // Data join; key function combines name and depth (= position in sequence).
  var g = d3.select("#trail")
      .selectAll("g")
      .data(nodeArray, function(d) { return d.name + d.depth; });

  // Add breadcrumb and label for entering nodes.
  var entering = g.enter().append("svg:g");

  entering.append("svg:polygon")
      .attr("points", breadcrumbPoints)
      .style("fill", function(d) { return colors[d.name]; });

  entering.append("svg:text")
      .attr("x", (b.w + b.t) / 2)
      .attr("y", b.h / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .text(function(d) { return d.name; });

  // Set position for entering and updating nodes.
  g.attr("transform", function(d, i) {
    return "translate(" + i * (b.w + b.s) + ", 0)";
  });

  // Remove exiting nodes.
  g.exit().remove();

  // Now move and update the percentage at the end.
  d3.select("#trail").select("#endlabel")
      .attr("x", (nodeArray.length + 0.5) * (b.w + b.s))
      .attr("y", b.h / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .text(percentageString);

  // Make the breadcrumb trail visible, if it's hidden.
  d3.select("#trail")
      .style("visibility", "");

}

function drawLegend() {

  // Dimensions of legend item: width, height, spacing, radius of rounded rect.
  var li = {
    w: 110, h: 30, s: 3, r: 3
  };

  var legend = d3.select("#legend").append("svg:svg")
      .attr("width", li.w)
      .attr("height", d3.keys(colors).length * (li.h + li.s));

  var g = legend.selectAll("g")
      .data(d3.entries(colors))
      .enter().append("svg:g")
      .attr("transform", function(d, i) {
              return "translate(0," + i * (li.h + li.s) + ")";
           });

  g.append("svg:rect")
      .attr("rx", li.r)
      .attr("ry", li.r)
      .attr("width", li.w)
      .attr("height", li.h)
      .style("fill", function(d) { return d.value; });

  g.append("svg:text")
      .attr("x", li.w / 2)
      .attr("y", li.h / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .text(function(d) { return d.key; });
}
function drawLegend1() {

  // Dimensions of legend item: width, height, spacing, radius of rounded rect.
  var li = {
    w: 100, h: 30, s: 3, r: 3
  };

  var legend = d3.select("#legend1").append("svg:svg")
      .attr("width", li.w)
      .attr("height", d3.keys(colors1).length * (li.h + li.s));

  var g = legend.selectAll("g")
      .data(d3.entries(colors1))
      .enter().append("svg:g")
      .attr("transform", function(d, i) {
              return "translate(0," + i * (li.h + li.s) + ")";
           });

  g.append("svg:rect")
      .attr("rx", li.r)
      .attr("ry", li.r)
      .attr("width", li.w)
      .attr("height", li.h)
      .style("fill", function(d) { return d.value; });

  g.append("svg:text")
      .attr("x", li.w / 2)
      .attr("y", li.h / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .text(function(d) { return d.key; });
}

function drawLegend2() {

  // Dimensions of legend item: width, height, spacing, radius of rounded rect.
  var li = {
    w: 100, h: 30, s: 3, r: 3
  };

  var legend = d3.select("#legend2").append("svg:svg")
      .attr("width", li.w)
      .attr("height", d3.keys(colors2).length * (li.h + li.s));

  var g = legend.selectAll("g")
      .data(d3.entries(colors2))
      .enter().append("svg:g")
      .attr("transform", function(d, i) {
              return "translate(0," + i * (li.h + li.s) + ")";
           });

  g.append("svg:rect")
      .attr("rx", li.r)
      .attr("ry", li.r)
      .attr("width", li.w)
      .attr("height", li.h)
      .style("fill", function(d) { return d.value; });

  g.append("svg:text")
      .attr("x", li.w / 2)
      .attr("y", li.h / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .text(function(d) { return d.key; });
}

function drawLegend3() {

  // Dimensions of legend item: width, height, spacing, radius of rounded rect.
  var li = {
    w: 100, h: 30, s: 3, r: 3
  };

  var legend = d3.select("#legend3").append("svg:svg")
      .attr("width", li.w)
      .attr("height", d3.keys(colors3).length * (li.h + li.s));

  var g = legend.selectAll("g")
      .data(d3.entries(colors3))
      .enter().append("svg:g")
      .attr("transform", function(d, i) {
              return "translate(0," + i * (li.h + li.s) + ")";
           });

  g.append("svg:rect")
      .attr("rx", li.r)
      .attr("ry", li.r)
      .attr("width", li.w)
      .attr("height", li.h)
      .style("fill", function(d) { return d.value; });

  g.append("svg:text")
      .attr("x", li.w / 2)
      .attr("y", li.h / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .text(function(d) { return d.key; });
}
function toggleLegend() {
  var legend = d3.select("#legend");
  if (legend.style("visibility") == "hidden") {
    legend.style("visibility", "");
  } else {
    legend.style("visibility", "hidden");
  }
}

// Take a 2-column CSV and transform it into a hierarchical structure suitable
// for a partition layout. The first column is a sequence of step names, from
// root to leaf, separated by hyphens. The second column is a count of how 
// often that sequence occurred.
function buildHierarchy(csv) {
  var root = {"name": "root", "children": []};
  for (var i = 0; i < csv.length; i++) {
    var sequence = csv[i][0];
    var size = +csv[i][1];
    if (isNaN(size)) { // e.g. if this is a header row
      continue;
    }
    var parts = sequence.split("-");
    var currentNode = root;
    for (var j = 0; j < parts.length; j++) {
      var children = currentNode["children"];
      var nodeName = parts[j];
      var childNode;
      if (j + 1 < parts.length) {
   // Not yet at the end of the sequence; move down the tree.
 	var foundChild = false;
 	for (var k = 0; k < children.length; k++) {
 	  if (children[k]["name"] == nodeName) {
 	    childNode = children[k];
 	    foundChild = true;
 	    break;
 	  }
 	}
  // If we don't already have a child node for this branch, create it.
 	if (!foundChild) {
 	  childNode = {"name": nodeName, "children": []};
 	  children.push(childNode);
 	}
 	currentNode = childNode;
      } else {
 	// Reached the end of the sequence; create a leaf node.
 	childNode = {"name": nodeName, "size": size};
 	children.push(childNode);
      }
    }
  }
  return root;
};
