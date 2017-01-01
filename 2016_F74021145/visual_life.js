var margin = {top: 30, right: 20, bottom: 20, left: 30},
    width = 1260 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
var x0 = d3.scale.ordinal()
    .rangeRoundBands([0, width-100], .1);
var x1 = d3.scale.ordinal();
var y = d3.scale.linear()
//    .domain[70,90]
    .range([height, 0]);
var color = d3.scale.ordinal()
    .range(["#CD5C5C", "#DAA520", "#5F9EA0"]);
var xAxis = d3.svg.axis()
    .scale(x0)
    .orient("bottom");
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format(","));
//    .tickValues[70,72,74,76,78,80,82,84,86];
var svg = d3.select("body").append("svg")    
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<span style='color:white'>" +d.value.toFixed(2)+ "</span>";
  })
svg.call(tip);
d3.csv("life.csv", function(error, data) {
  if (error) throw error;
  var ageNames = d3.keys(data[0]).filter(function(key) {  
    return key !== "State"; });
  data.forEach(function(d) {
    d.ages = ageNames.map(function(name) {return {name: name, value: +d[name]}; });
  });
  x0.domain(data.map(function(d) { return d.State; }));
  x1.domain(ageNames).rangeRoundBands([0, x0.rangeBand()]);
  y.domain([50,85])//([0, d3.max(data, function(d) { return d3.max(d.ages, function(d) { return d.value;}); })]);
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "translate(0,-90)")
      .attr("y", 20)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("");
  var state = svg.selectAll(".State")      
      .data(data)
    .enter().append("g")
      .attr("class", "state")
      .attr("transform", function(d) { return "translate(" + x0(d.State) + ",0)"; }); 
  state.selectAll("rect")
      .data(function(d) { return d.ages; })
    .enter().append("rect")
      .attr("width", x1.rangeBand())
      .attr("x", function(d) { return x1(d.name); })
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); })
      .style("fill", function(d) { return color(d.name); }) 
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
  var legend = svg.selectAll(".legend")
      .data(ageNames.slice()) 
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(-20," + i * 20 + ")"; }); 
  legend.append("rect") 
      .attr("x", width + 17)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);
  legend.append("text")
      .attr("x", width + 13)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { 
        switch(d)
        {
          case "A":
            return "1995年之平均壽命"
          case "B":
            return "2005年之平均壽命"
          case "C":
            return "2015年之平均壽命"
          default:
        }
      }); 
  d3.select(".life1995").on("change", change1);
  d3.select(".life2005").on("change", change2);  
  d3.select(".life2015").on("change", change3); 
 function change1() {
    var x2 = x0.domain(data.sort(this.checked
          = function(a, b) { return b.A - a.A; })
          .map(function(d) { return d.State; }))
          .copy();
      var transition = svg.transition().duration(1500),
          delay = function(d, i) { return i * 50; };
      var state2 = transition.selectAll(".State")
          .attr("x", function(d) { return x2(d.State); });
      svg.selectAll("g.state")
         .transition().duration(1500)
         .attr("transform", function(d) { return "translate(" +x2(d.State) + ",0)"; });
      transition.select(".x.axis")
          .call(xAxis)
          .selectAll("g")
  }
 function change2() {
    var x2 = x0.domain(data.sort(this.checked
          = function(a, b) { return b.B - a.B; })
          .map(function(d) { return d.State; }))
          .copy();
      var transition = svg.transition().duration(1500),
          delay = function(d, i) { return i * 50; };
      var state2 = transition.selectAll(".State")
          .attr("x", function(d) { return x2(d.State); });
      svg.selectAll("g.state")
         .transition().duration(1500)
         .attr("transform", function(d) { return "translate(" +x2(d.State) + ",0)"; });
      transition.select(".x.axis")
          .call(xAxis)
          .selectAll("g")
  }
 function change3() {
    var x2 = x0.domain(data.sort(this.checked
          = function(a, b) { return b.C - a.C; })
          .map(function(d) { return d.State; }))
          .copy();
      var transition = svg.transition().duration(1500),
          delay = function(d, i) { return i * 50; };
      var state2 = transition.selectAll(".State")
          .attr("x", function(d) { return x2(d.State); });
      svg.selectAll("g.state")
         .transition().duration(1500)
         .attr("transform", function(d) { return "translate(" +x2(d.State) + ",0)"; });
      transition.select(".x.axis")
          .call(xAxis)
          .selectAll("g")
  }
});
