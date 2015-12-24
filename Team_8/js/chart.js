//初始折線圖
var margin = {top: 60, right: 40, bottom: 50, left: 60};
var w = 580 ; // 寬
var h = 300 ; // 高

var mysvg = d3.select('#line_chart')
		.append('svg')
		.attr('width', w + margin.left + margin.right) //將左右補滿
		.attr('height', h + margin.top + margin.bottom) //上下補滿
		.attr('class', 'content')
		.append('g') //增加一個群組g
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var dataset = [2,2,2,2,2,2,2,2,2,2,2,2,2,2,
				2,2,2,2,2,2,2,2,2,2,2,2,2,3,
				2,2,2,2,2,2,3,3,3,2,3,3,3,3];

var Ymax = 15,
	Ymin = 0;

var xScale = d3.scale.linear()
				.domain([0, dataset.length])
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
	.attr('d', line(dataset));

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
generate(dataset1);

svg = d3.select("#pie_chart2")
					.append("svg")
					.attr("width", width)
					.attr("height", height);
generate(dataset2);

svg = d3.select("#pie_chart3")
					.append("svg")
					.attr("width", width)
					.attr("height", height);
generate(dataset3);


//index.php內 form改變時呼叫change function
d3.selectAll("input").on("change", change);

function change() {
	var dataset;
	if (this.value === "num1") {
		var dataset = [2,2,2,2,2,2,2,2,2,2,2,2,2,2,
				2,2,2,2,2,2,2,2,2,2,2,2,2,3,
				2,2,2,2,2,2,3,3,3,2,3,3,3,3];

	}
	else if(this.value === "num2") {
		dataset = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,
						1,1,1,1,1,1,1,1,1,1,1,1,1,1,
						1,1,1,1,1,1,1,1,1,1,1,1,1,1];
	}
	else if(this.value === "num3") {
		dataset = [6,6,6,4,4,4,3,5,4,4,3,3,3,3,
						3,3,3,3,3,3,3,3,3,3,3,3,3,2,
						3,3,3,3,3,3,2,2,2,3,2,2,2,2];
	}
	else if(this.value === "num4") {
		dataset = [4,4,4,9,8,7,7,7,7,8,9,9,10,9,
						9,9,9,9,4,4,4,4,4,4,4,4,5,5,
						5,5,4,4,4,4,4,4,4,4,4,4,4,4];
	}
	else if(this.value === "num5") {
		dataset = [3,3,3,3,3,3,4,3,3,3,5,5,4,4,
						4,7,7,7,10,10,10,10,10,10,10,9,9,8,
						8,8,7,7,7,8,7,7,7,6,5,5,5,5];
	}
	else if(this.value === "num6") {
		dataset = [7,7,7,7,7,8,8,9,9,9,8,8,7,7,
						7,5,4,4,6,6,6,6,6,6,6,6,6,6,
						6,6,5,5,5,5,5,5,5,5,6,6,6,6];
	}
	else if(this.value === "num7") {
		dataset = [10,10,10,10,9,9,9,8,8,7,7,7,8,8,
						8,8,8,8,7,7,7,7,7,7,7,7,7,7,
						7,7,8,8,8,7,8,8,8,8,7,7,7,7];
	}
	else if(this.value === "num8") {
		dataset = [5,5,5,5,5,5,5,4,5,5,4,4,5,5,
						5,6,5,5,5,5,5,5,5,5,5,5,4,4,
						4,4,6,6,6,6,6,6,6,7,8,8,8,8];
	}
	else if(this.value === "num9") {
		dataset = [26,26,28,28,24,25,27,25,25,26,28,27,27,28,
						23,21,21,21,19,19,20,20,13,13,13,13,13,13,
						12,12,11,11,11,11,11,12,11,9,9,9,9,9];
	}
	else if(this.value === "num10") {
		dataset = [38,46,47,52,55,61,61,59,59,62,63,61,62,67,
						64,65,64,65,62,63,61,61,61,78,76,76,82,88,
						106,97,98,100,99,100,91,91,77,73,76,76,74,77];
	}
	execute(dataset);

	var dataset1, dataset2, dataset3;
	if (this.value === "num1") {
		dataset1 = [211,66];
		dataset2 = [142,20];
		dataset3 = [660,137];
	}
	else if(this.value === "num2") {
		dataset1 = [160,41];
		dataset2 = [67,15];
		dataset3 = [451,88];
	}
	else if(this.value === "num3") {
		dataset1 = [80,38];
		dataset2 = [90,17];
		dataset3 = [375,108];
	}
	else if(this.value === "num4") {
		dataset1 = [149,75];
		dataset2 = [26,22];
		dataset3 = [211,129];
	}
	else if(this.value === "num5") {
		dataset1 = [344,30];
		dataset2 = [58,17];
		dataset3 = [363,107];
	}
	else if(this.value === "num6") {
		dataset1 = [141,77];
		dataset2 = [53,23];
		dataset3 = [342,179];
	}
	else if(this.value === "num7") {
		dataset1 = [303,117];
		dataset2 = [39,18];
		dataset3 = [308,167];
	}
	else if(this.value === "num8") {
		dataset1 = [48,20];
		dataset2 = [24,18];
		dataset3 = [170,83];
	}
	else if(this.value === "num9") {
		dataset1 = [112,66];
		dataset2 = [53,24];
		dataset3 = [249,148];
	}
	else if(this.value === "num10") {
		dataset1 = [6,17];
		dataset2 = [27,33];
		dataset3 = [109,147];
	}
	document.querySelector("#pie_chart1").innerHTML = '<h3>紅土</h3>';
	document.querySelector("#pie_chart2").innerHTML = '<h3>草地</h3>';
	document.querySelector("#pie_chart3").innerHTML = '<h3>硬地</h3>';
	
	svg = d3.select("#pie_chart1")
				.append("svg")
				.attr("width", width)
				.attr("height", height);
	generate(dataset1);

	svg = d3.select("#pie_chart2")
				.append("svg")
				.attr("width", width)
				.attr("height", height);
	generate(dataset2);

	svg = d3.select("#pie_chart3")
				.append("svg")
				.attr("width", width)
				.attr("height", height);
	generate(dataset3);
}

function execute(dataset){

	if(d3.max(dataset) < 15){
		var Ymax = 15;
	}
	else{
		var Ymax = d3.max(dataset);
	}
	var Ymin = 1;
	

	var xScale = d3.scale.linear()
					.domain([0, dataset.length])
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

	// 定義x軸線，tickSize是軸線的垂直高度，-h會往上拉高
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
        .text("2015 weeks");


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
					.attr('d', line(dataset));

	var focus = svg.append("g")
				.selectAll("x")
                .data(dataset)
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
/*
	//加入軸線
    line_svg.append("rect")
            .attr("width", width)
            .attr("height", height)
            .style("fill", "none")
            .style("pointer-events", "all")
   			.on("mouseover", function() {
                focus.style("display", null);
                tooltip.style("display",null);
            })
            .on("mouseout", function() { 
                focus.style("display", "none");
                tooltip.style("display","none");
          })
            .on("mousemove", mousemove);
	//標上座標點

	var g = svg.selectAll('circle')
		.data(dataset)
		.enter()
		.append('g')
		.append('circle')
		.attr('class', 'linecircle')
		.attr('cx', line.x())
		.attr('cy', line.y())
		.attr('r', 3.5)
		.on('mouseover', function() {
			d3.select(this).transition().duration(500).attr('r', 5);
		})
		.on('mouseout', function() {
		    d3.select(this).transition().duration(500).attr('r', 3.5);
		});
*/
}

function generate(dataset){
	var pie = d3.layout.pie();
	var piedata = pie(dataset);

	var outerRadius = 80; //外半徑
	var innerRadius = 0;  //內半徑

	//弧線生成器
	var arc = d3.svg.arc()  		
	    .innerRadius(innerRadius) 
	    .outerRadius(outerRadius);

	//先在svg裡添加足夠數量的分組元素"g"
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

