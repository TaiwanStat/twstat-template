var imported = document.createElement('script');
imported.src = 'js/jquery-2.2.0.min.js';
document.head.appendChild(imported);

var imported2 = document.createElement('script');
imported2.src = 'https://cdn.firebase.com/js/client/2.2.1/firebase.js';
document.head.appendChild(imported);


//初始折線圖
var margin = {top: 60, right: 40, bottom: 50, left: 60};
var w = 580 ; // 寬
var h = 300 ; // 高
var player = 103819;
var year = 2015;

var dataset1, dataset2, dataset3;

var mysvg = d3.select('#line_chart')
		.append('svg')
		.attr('width', w + margin.left + margin.right) //將左右補滿
		.attr('height', h + margin.top + margin.bottom) //上下補滿
		.attr('class', 'content')
		.append('g') //增加一個群組g
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');


var rank_dataset = [2,2,2,2,2,2,2,2,2,2,2,2,2,2,
          2,2,2,2,2,2,2,2,2,2,2,2,2,3,
          2,2,2,2,2,2,3,3,3,2,3,3,3,3];

var Ymax = 15,
	Ymin = 0;

var xScale = d3.scale.linear()
				.domain([0, rank_dataset.length])
				.range([0, w]);
var yScale = d3.scale.linear()
				.domain([Ymin, Ymax])
				.range([0, h]);


// 增加一個line function，用來把資料轉為x, y
var line = d3.svg.line()
	.x(function(d,i) { 
		return xScale(i + 1);
	})
	.y(function(d) { 
		return yScale(d);
	});

// 定義x軸線
var xAxis = d3.svg.axis()
			.scale(xScale)
			.orient('bottom')
			.tickSize(-h)
			.tickSubdivide(true);
// SVG加入x軸線
mysvg.append('g')
	.attr('class', 'xaxis')
	.attr('transform', 'translate(0,' + h + ')')
	.call(xAxis)
	.append("text")
    .attr("transform", "rotate(0)")
    .attr({"x": 250, "y": 20})
    .attr("dy", ".80em")
    .text("2015 weeks");

// 定義y軸線
var yAxisLeft = d3.svg.axis()
				.scale(yScale)
				.ticks(6)
				.orient('left');
// SVG加入y軸線
mysvg.append('g')
	.attr('class', 'yaxis')
	.attr('transform', 'translate(0,0)')
	.call(yAxisLeft)
	.append("text")
    .attr("transform", "rotate(-90)")
    .attr({"x": -150, "y": -50})
    .attr("dy", ".80em")
    .text("rank");
			
mysvg.append('path')
	.attr('class', 'line')
	.attr('d', line(rank_dataset));

//初始圓餅圖
var width = 200;
var height = 200;
var dataset1 = [ 160 , 41];
var dataset2 = [ 67 , 15 ];
var dataset3 = [ 451 , 88 ];

var svg = d3.select("#pie_chart1")
					.append("svg")
					.attr("width", width)
					.attr("height", height);
draw_bar_chart(dataset1);

svg = d3.select("#pie_chart2")
					.append("svg")
					.attr("width", width)
					.attr("height", height);
draw_bar_chart(dataset2);

svg = d3.select("#pie_chart3")
					.append("svg")
					.attr("width", width)
					.attr("height", height);
draw_bar_chart(dataset3);


var slider = module().min(2000).max(2015).ticks(15).showRange(true).value(2015);
d3.select('#slider').call(slider);

d3.selectAll("input").on("change", change_player);

function change_player() {
	player = this.value;
	if (this.value === "num1") {
    player = 103819;
	}
	else if(this.value === "num2") {
		player = 104925;
	}
	else if(this.value === "num3") {
		player = 104918;
	}
	else if(this.value === "num4") {
    player = 104527;
	}
	else if(this.value === "num5") {
		player = 104745;
	}
	else if(this.value === "num6") {
		player = 104607;
	}
	else if(this.value === "num7") {
		player = 103970;
	}
	else if(this.value === "num8") {
		player = 105453;
	}
	else if(this.value === "num9") {
		player = 104755;
	}
	else if(this.value === "num10") {
		player = 104229;
	}
  getData(player, year);
  getWinLose(player, year);

}

function draw_line_chart(year){

	if(d3.max(rank_dataset) < 15){
		var Ymax = 15;
	}
	else{
		var Ymax = d3.max(rank_dataset);
	}
	var Ymin = 1;
	

	var xScale = d3.scale.linear()
					.domain([0, rank_dataset.length])
					.range([0, w]);
	var yScale = d3.scale.linear()
					.domain([Ymin, Ymax])
					.range([0, h]);


	// 增加一個line function，用來把資料轉為x, y
	var line = d3.svg.line()
		.x(function(d,i) { 
			return xScale(i + 1);
		})
		.y(function(d) { 
			return yScale(d);
		});

	//先清空先前的資料 再增加一個SVG元素
	document.querySelector('div').innerHTML = '';
	var line_svg = d3.select('#line_chart')
		.append('svg')
		.attr('class', 'content')
		.attr('width', w + margin.left + margin.right) //將左右補滿
		.attr('height', h + margin.top + margin.bottom) //上下補滿
		.append('g') //增加一個群組g
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

	var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient('bottom')
		.tickSize(-h)
		.tickSubdivide(true);
	// SVG加入x軸線
	line_svg.append('g')
		.attr('class', 'xaxis')
		.attr('transform', 'translate(0,' + h + ')')
		.call(xAxis)
		.append("text")
        .attr("transform", "rotate(0)")
        .attr({"x": 250, "y": 20})
        .attr("dy", ".80em")
        .text(year+" weeks");


	// 定義y軸線
	var yAxisLeft = d3.svg.axis()
		.scale(yScale)
		.ticks(6)
		.orient('left');
	// SVG加入y軸線
	line_svg.append('g')
		.attr('class', 'yaxis')
		.attr('transform', 'translate(0,0)')
		.call(yAxisLeft)
		.append("text")
        .attr("transform", "rotate(-90)")
        .attr({"x": -150, "y": -50})
        .attr("dy", ".80em")
        .text("rank");
				
	var path = line_svg.append('path')
					.attr('class', 'line')
					.attr('d', line(rank_dataset));

	var focus = svg.append("g")
				.selectAll("x")
                .data(rank_dataset)
                .enter()
            	.append("line")
                .attr("class","x")
                .attr("id", function(v) { return "tag_" + v.name; })
                .style("display","none")
                .style("stroke", "blue")
                .style("stroke-dasharray", "3.3")
                .style("opacity", 1)
                .attr("y1", -height)
                .attr("y2", 0);
}

function draw_bar_chart(dataset){
	var pie = d3.layout.pie();
	var piedata = pie(dataset);

	var outerRadius = 80;
	var innerRadius = 0;

	//弧線生成器
	var arc = d3.svg.arc()  		
	    .innerRadius(innerRadius) 
	    .outerRadius(outerRadius);

	var arcs = svg.selectAll("g")
	    .data(piedata)
	    .enter()
	    .append("g")
	    .attr("transform","translate("+ (width/2) +","+ (width/2) +")");

	var color = d3.scale.category10();

	//在每個分組元素"g"中添加"path"
	arcs.append("path")
		.attr("class", "pie")
	    .attr("fill",function(d,i){
	        return color(i);
	    })
	    .attr("d",function(d){
	        return arc(d);
	    });

	arcs.append("text")
	    .attr("transform",function(d){
	        return "translate(" + arc.centroid(d) + ")";
	    })
	    .attr("text-anchor","middle")
	    .text(function(d){
	        return d.data;
	    });
}



//時間軸
function module() {
  "use strict";

  var div, min = 0, max = 100, svg, svgGroup, value, classPrefix, axis, 
  height=40, rect,
  rectHeight = 12,
  tickSize = 6,
  margin = {top: 25, right: 25, bottom: 15, left: 25}, 
  ticks = 0, tickValues, scale, tickFormat, dragger, width, 
  range = false,
  callbackFn, stepValues, focus;

  function slider(selection) {
    selection.each(function() {
      div = d3.select(this).classed('d3slider', true);
      width = parseInt(div.style("width"), 10)-(margin.left 
                                                + margin.right);

      value = value || min; 
      scale = d3.scale.linear().domain([min, max]).range([0, width])
      .clamp(true);
      
      // SVG 
      svg = div.append("svg")
      .attr("class", "d3slider-axis")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + 
            "," + margin.top + ")");

      // Range rect
      svg.append("rect")
      .attr("class", "d3slider-rect-range")
      .attr("width", width)
      .attr("height", rectHeight);
     
      // Range rect 
      if (range) {
        svg.append("rect")
        .attr("class", "d3slider-rect-value")
        .attr("width", scale(value))
        .attr("height", rectHeight);
      }
      
      // Axis      
      var axis = d3.svg.axis()
      .scale(scale)
      .orient("bottom");
      
      if (ticks != 0) {
        axis.ticks(ticks);
        axis.tickSize(tickSize);
      } else if (tickValues) {
        axis.tickValues(tickValues);
        axis.tickSize(tickSize);
      } else {
        axis.ticks(0);
        axis.tickSize(0);
      }
      if (tickFormat) {
        axis.tickFormat(tickFormat);
      }
      
      svg.append("g")
      .attr("transform", "translate(0," + rectHeight + ")")
      .call(axis)
   

      var values = [value];
      dragger = svg.selectAll(".dragger")
      .data(values)
      .enter()
      .append("g")
      .attr("class", "dragger")
      .attr("transform", function(d) {
        return "translate(" + scale(d) + ")";
      }) 
      
      var displayValue = null;
      if (tickFormat) { 
        displayValue = tickFormat(value);
      } else {
        displayValue = d3.format(".0f")(value);
      }
      
      dragger.append("text")
      .attr("x", 0)
      .attr("y", -15)
      .attr("text-anchor", "middle")
      .attr("class", "draggertext")
      .text(displayValue);

      dragger.append("circle")
      .attr("class", "dragger-outer")
      .attr("r", 10)
      .attr("transform", function(d) {
        return "translate(0,6)";
      });
      
      dragger.append("circle")
      .attr("class", "dragger-inner")
      .attr("r", 4)
      .attr("transform", function(d) {
        return "translate(0,6)";
      });


      // Enable dragger drag 
      var dragBehaviour = d3.behavior.drag();
      dragBehaviour.on("drag", slider.drag);
      dragger.call(dragBehaviour);
      
      // Move dragger on click 
      svg.on("click", slider.click);

    });
  }

  slider.draggerTranslateFn = function() {
    return function(d) {
      return "translate(" + scale(d) + ")";
    }
  }

  slider.click = function() {
    var pos = d3.event.offsetX || d3.event.layerX;
    slider.move(pos);
  }

  slider.drag = function() {
    var pos = d3.event.x;
    slider.move(pos+margin.left);
  }

  slider.move = function(pos) {
    var l,u;
    var newValue = scale.invert(pos - margin.left);
    
    if (stepValues != undefined) {
      l = stepValues.reduce(function(p, c, i, arr){
        if (c < newValue) {
          return c;
        } else {
          return p;
        }
      });


      if (stepValues.indexOf(l) < stepValues.length-1) {
        u = stepValues[stepValues.indexOf(l) + 1];
      } else {
        u = l;
      }

      var oldValue = value;
      value = ((newValue-l) <= (u-newValue)) ? l : u;
    } else {
      var oldValue = value;
      value = newValue;
    }
    var values = [value];


    svg.selectAll(".dragger").data(values)
    .attr("transform", function(d) {
      return "translate(" + scale(d) + ")";
    });
    
    var displayValue = null;
    if (tickFormat) { 
      displayValue = tickFormat(value);
    } else {
      displayValue = d3.format(".0f")(value);
    }
    svg.selectAll(".dragger").select("text")
    .text(displayValue);
   
    if (range) { 
      svg.selectAll(".d3slider-rect-value")
      .attr("width", scale(value));
    }

    if (callbackFn) {
      callbackFn(slider);
    }
    year = displayValue;
    getData(player, year);
    getWinLose(player, year);
  }


  slider.min = function(_) {
    if (!arguments.length) return min;
    min = _;
    return slider;
  };

  slider.max = function(_) {
    if (!arguments.length) return max;
    max = _;
    return slider;
  };

  slider.classPrefix = function(_) {
    if (!arguments.length) return classPrefix;
    classPrefix = _;
    return slider;
  }

  slider.tickValues = function(_) {
    if (!arguments.length) return tickValues;
    tickValues = _;
    return slider;
  }
 
  slider.ticks = function(_) {
    if (!arguments.length) return ticks;
    ticks = _;
    return slider;
  }

  slider.stepValues = function(_) {
    if (!arguments.length) return stepValues;
    stepValues = _;
    return slider;
  }
  
  slider.tickFormat = function(_) {
    if (!arguments.length) return tickFormat;
    tickFormat = _;
    return slider;
  } 

  slider.value = function(_) {
    if (!arguments.length) return value;
    value = _;
    return slider;
  } 
  
  slider.showRange = function(_) {
    if (!arguments.length) return range;
    range = _;
    return slider;
  } 

  slider.callback = function(_) {
    if (!arguments.length) return callbackFn;
    callbackFn = _;
    return slider;
  }

  slider.setValue = function(newValue) {
    var pos = scale(newValue) + margin.left;
    slider.move(pos);
  }

  slider.mousemove = function() {
    var pos = d3.mouse(this)[0];
    var val = slider.getNearest(scale.invert(pos), stepValues);
    focus.attr("transform", "translate(" + scale(val) + ",0)");
    focus.selectAll("text").text(val);
  }
  
  slider.getNearest = function(val, arr) {
    var l = arr.reduce(function(p, c, i, a){
      if (c < val) {
        return c;
      } else {
        return p;
      }
    });
    var u = arr[arr.indexOf(l)+1];
    var nearest = ((value-l) <= (u-value)) ? l : u;
    return nearest;
  }

  slider.destroy = function() {
    div.selectAll('svg').remove();
    return slider;
  }

  return slider;

};

function getData( id,  year){
  var firebase = new Firebase("https://fiery-inferno-4186.firebaseio.com/id2name/" + id);
  var contest_atp_rankings = []; // 當年分排名， Type : Array
    
  firebase.once("value", function(snapshot) {

    var data = snapshot.val();
    obj = JSON.parse(data);

    /** Start 取得選手個人資訊 **/
    console.log(obj.player_id);
    console.log(obj.first_name);
    console.log(obj.last_name);
    console.log(obj.hand);
    console.log(obj.birth_date);
    console.log(obj.country_code);
    /** End 取得選手個人資訊 **/

    /** Start 取得檔年分排名 **/
    for(var i = 0; i < obj.atp_rankings.length; i++){
      var cur_rankings = obj.atp_rankings[i];
      if(new String(Object.keys(cur_rankings)[0]).valueOf() == new String(year).valueOf()){
        var ranks = JSON.parse(cur_rankings[Object.keys(cur_rankings)[0]]);
        for(var j = 0; j < ranks.length; ++j){
          contest_atp_rankings[j] = Number(ranks[j]);
        }
        break;
      }
    }
    rank_dataset = contest_atp_rankings;
    draw_line_chart(year);
  });

}


function getWinLose( id,  year){
  var firebase = new Firebase("https://fiery-inferno-4186.firebaseio.com/id2name/" + id);
    
  firebase.once("value", function(snapshot) {

    var data = snapshot.val();
    obj = JSON.parse(data);

    /** Start 取得當年分分別各賽事紅土、草地、硬地勝敗場 **/
    // atp_matches
    var contest_atp_matches_grass = [0,0]; // 草地[勝場，輸場]，Type : Array
    var contest_atp_matches_hard = [0,0]; // 硬地[勝場，輸場]，Type : Array
    var contest_atp_matches_clay = [0,0]; // 紅土[勝場，輸場]，Type : Array
    for(var i = 0; i < obj.atp_matches.length; ++i){
        var atp_matches = obj.atp_matches[i];
        if(new String(Object.keys(atp_matches)[0]).valueOf() == new String(year).valueOf()){
          var stringGrass = atp_matches[Object.keys(atp_matches)[0]][0]["Grass"].split(" ");
          var stringHard = atp_matches[Object.keys(atp_matches)[0]][1]["Hard"].split(" ");
          var stringClay = atp_matches[Object.keys(atp_matches)[0]][2]["Clay"].split(" ");
          contest_atp_matches_grass[0] = Number(stringGrass[0]);contest_atp_matches_grass[1] = Number(stringGrass[1]);
          contest_atp_matches_hard[0] = Number(stringHard[0]);contest_atp_matches_hard[1] = Number(stringHard[1]);
          contest_atp_matches_clay[0] = Number(stringClay[0]);contest_atp_matches_clay[1] = Number(stringClay[1]);
          break;
        }
    }

    // atp_matches_futures
    var contest_atp_matches_futures_grass = [0,0]; // 草地[勝場，輸場]，Type : Array
    var contest_atp_matches_futures_hard = [0,0]; // 硬地[勝場，輸場]，Type : Array
    var contest_atp_matches_futures_clay = [0,0]; // 紅土[勝場，輸場]，Type : Array
    for(var i = 0; i < obj.atp_matches_futures.length; ++i){
      var cur_matches_future = obj.atp_matches_futures[i];
      if(new String(Object.keys(cur_matches_future)[0]).valueOf() == new String(year).valueOf()){
        var stringGrass = cur_matches_future[Object.keys(cur_matches_future)[0]][0]["Grass"].split(" ");
        var stringHard = cur_matches_future[Object.keys(cur_matches_future)[0]][1]["Hard"].split(" ");
        var stringClay = cur_matches_future[Object.keys(cur_matches_future)[0]][2]["Clay"].split(" ");
        contest_atp_matches_futures_grass[0] = Number(stringGrass[0]);contest_atp_matches_futures_grass[1] = Number(stringGrass[1]);
        contest_atp_matches_futures_hard[0] = Number(stringHard[0]);contest_atp_matches_futures_hard[1] = Number(stringHard[1]);
        contest_atp_matches_futures_clay[0] = Number(stringClay[0]);contest_atp_matches_futures_clay[1] = Number(stringClay[1]);
        break;
      }
    }

    // atp_matches_qual_chall
    var contest_atp_matches_qual_chall_grass = [0,0]; // 草地[勝場，輸場]，Type : Array
    var contest_atp_matches_qual_chall_hard = [0,0]; // 硬地[勝場，輸場]，Type : Array
    var contest_atp_matches_qual_chall_clay = [0,0]; // 紅土[勝場，輸場]，Type : Array
    for(var i = 0; i < obj.atp_matches_qual_chall.length; ++i){
      var atp_matches_qual_chall = obj.atp_matches_qual_chall[i];
      if(new String(Object.keys(atp_matches_qual_chall)[0]).valueOf() == new String(year).valueOf()){
        var stringGrass = atp_matches_qual_chall[Object.keys(atp_matches_qual_chall)[0]][0]["Grass"].split(" ");
        var stringHard = atp_matches_qual_chall[Object.keys(atp_matches_qual_chall)[0]][1]["Hard"].split(" ");
        var stringClay = atp_matches_qual_chall[Object.keys(atp_matches_qual_chall)[0]][2]["Clay"].split(" ");
        contest_atp_matches_qual_chall_grass[0] = Number(stringGrass[0]);contest_atp_matches_qual_chall_grass[1] = Number(stringGrass[1]);
        contest_atp_matches_qual_chall_hard[0] = Number(stringHard[0]);contest_atp_matches_qual_chall_hard[1] = Number(stringHard[1]);
        contest_atp_matches_qual_chall_clay[0] = Number(stringClay[0]);contest_atp_matches_qual_chall_clay[1] = Number(stringClay[1]);
        break;
      }
    }

    // 當年份總和
    var contest_grass_total = [0,0]; // 草地總和
    var contest_hard_total = [0,0]; // 硬地總和
    var contest_clay_total = [0,0]; // 紅土總和
    contest_grass_total[0] = contest_atp_matches_grass[0] + contest_atp_matches_futures_grass[0] + contest_atp_matches_qual_chall_grass[0];
    contest_hard_total[0] = contest_atp_matches_hard[0] + contest_atp_matches_futures_hard[0] + contest_atp_matches_qual_chall_hard[0];
    contest_clay_total[0] = contest_atp_matches_clay[0] + contest_atp_matches_futures_clay[0] + contest_atp_matches_qual_chall_clay[0];
    contest_grass_total[1] = contest_atp_matches_grass[1] + contest_atp_matches_futures_grass[1] + contest_atp_matches_qual_chall_grass[1];
    contest_hard_total[1] = contest_atp_matches_hard[1] + contest_atp_matches_futures_hard[1] + contest_atp_matches_qual_chall_hard[1];
    contest_clay_total[1] = contest_atp_matches_clay[1] + contest_atp_matches_futures_clay[1] + contest_atp_matches_qual_chall_clay[1];
    /** End 取得當年分分別各賽事紅土、草地、硬地勝敗場 **/

    document.querySelector("#pie_chart1").innerHTML = '<h3>紅土</h3>';
    document.querySelector("#pie_chart2").innerHTML = '<h3>草地</h3>';
    document.querySelector("#pie_chart3").innerHTML = '<h3>硬地</h3>';
  
    svg = d3.select("#pie_chart1")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
    draw_bar_chart(contest_clay_total);

    svg = d3.select("#pie_chart2")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
    draw_bar_chart(contest_grass_total);

    svg = d3.select("#pie_chart3")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
    draw_bar_chart(contest_hard_total);

  });

  

}
