function drawMultilineChart(domobj){

	//begin--line chart feature setting

	var margin = {top: 20, right: 20, bottom: 30, left: 50},
	    width = 960 - margin.left - margin.right,
	    height = 500 - margin.top - margin.bottom;

	// reserve for expressing
	//     label of each line

	var x = d3.time.scale()
	    .range([0, width]);

	var y = d3.scale.linear()
	    .range([height, 0]);

	var color = d3.scale.category20();

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom")
		.tickSize(-height,0);

	var yAxis = d3.svg.axis()
	    .scale(y)
		.ticks(5,"$")
	    .orient("left")
		.tickSize(-width,0);

	var line = d3.svg.line()
		//.interpolate("cardinal")
	    .x(function(d) { return x(d.Date); })
	    .y(function(d) { return y(d.price); });
	    
	// basic form
	var svg = domobj
		.append("svg")
	    	.attr("width", width + margin.left + margin.right)
	    	//.attr("height", height + margin.top + margin.bottom)
	    	.attr("height", 700 + margin.top + margin.bottom)
		.append("g")
	    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var bg = svg.append("g")
			.append("rect")
			.attr("class","main_rect")
			.attr("width", width)
			.attr("height", height);

	var focus = svg.append("g")
			.style("display", "none");

	//end--line chart feature setting


	// connect to firebase db
	var firebaseRef = new Firebase("https://ikdde-team6.firebaseio.com/vegetable_data/");

	// store data from firebase and drawing charts
	firebaseRef.on("value", function(snapshot) {

		var data = [];

		// get all vegetable name
		var name = d3.keys(snapshot.val()).filter(function(name) { return name != 'default'});

		console.log(name);

		snapshot.forEach( function(child) {
			child.forEach( function(grandChild) {
				data.push( {
					cate: child.key(),
					name: grandChild.key(),
					value: grandChild.val(),
					opacity: +0
				});
			});
		});

		// reconstruct(rebuild) date
		data.forEach( function(v) {
			v.value = d3.values(v.value);
			//v.value = v.value.filter(function(e) { return e.date.month===2; });
			v.value.forEach( function(e) {
				e.Date = new Date(e.date.year,e.date.month-1,e.date.day);
			});
		});

		//console.log(data);

		// set color domain by vegetable name
		//     vegetable name --mapping--> specific color
		color.domain(data.map(function(v) { return v.name}));


		// set x domain by range from min of date to max of date
		//     x invoked in xAxis
		x.domain([
			d3.min(data, function(v) { return d3.min(v.value, function(d) { return d.Date});}),
			d3.max(data, function(v) { return d3.max(v.value, function(d) { return d.Date});})
		]);


		// find max y, if y_max is NaN(no line display), set as default 50
		var y_max = d3.max(
				data.filter( function(v) { return v.opacity===1;}),
				function(v) { return d3.max(v.value, function(d) { return d.price; }); }
		);

		y_max = isNaN(y_max)? +50: y_max+20;

		// set y domain by range from min of date to max of date
		//     y invoked in yAxis
		y.domain([0,y_max]);

		// append x axis by feature xAxis
		var gxAxis = svg.append("g")
				.attr("class","x axis")
				.attr("transform","translate(0," + height + ")")
				.call(xAxis);
		

		// append y axis by feature yAxis
		var gyAxis = svg.append("g")
				.attr("class","y axis")
				.call(yAxis)
			.append("text")
				.attr("transform","rotate(-90)")
				.attr("y",6)
				.attr("dy", ".71em")
				.style("text-anchor", "end")
				.text("Price/Weight ($/kg)");

		// add all g
		var vg = svg.selectAll(".city")
					.data(data)
					.enter()
				.append("g")
					.attr("class","city")
					.attr("id", function(v) { return 'tag_'+v.name; })
					.style("opacity", function(v) { return v.opacity; });

		// add path by feature "line" under each ".city"
		var graph = vg.append("path")
			.attr("class","line")
			.attr("id", function(v) { return "tag_"+v.name; })
			.attr("d", function(v) { return line(v.value); })
			.style("stroke", function(v) { return color(v.name); });

		// append circle
		/*
		var cir = vg.selectAll(".dot")
					.data(function(d) { return d.value; })
				.enter()
					.append("circle")
					.attr("class","dot")
					.attr("r", 5)
					.attr("cx", function(d) { return x(d.Date); })
					.attr("cy", function(d) { return y(d.price); })
					.style("opacity",1)
					.on("mouseover", function(d) {
						var dot = d3.select(this);
						dot.style("opacity", .9);
					})
					.on("mouseout", function(d) {
						var dot = d3.select(this);
						dot.style("opacity", 0);
					});
		*/

		// append label for each line
		vg.append("text")
			.datum(function(d) { return {name: d.name, value: d.value[d.value.length - 1]}; })
			.attr("class","vglabel")
			.attr("id", function(v) { return "tag_"+v.name; })
			.attr("transform", function(d) { return "translate(" + x(d.value.Date) + "," + y(d.value.price) + ")"; })
			.attr("x", 3)
			.attr("dy", ".35em")
			.text(function(d) { return d.name; })

			// can be modiy by css
			.style("font-size","20px")
			.style("font-weight","bold")
			.style("stroke", "#000")
			.style("fill", function(v) { return color(v.name); });

		var label_W = width/data.length; 

		//console.log(data);

		// add label for control line display
		// Reference from http://bl.ocks.org/d3noob/e99a762017060ce81c76
		/*
		svg.append("g")
			.selectAll(".choose")
			.data(data)
			.enter()
		.append("text")
			.attr("class","choose")
			.attr("x", function(v) { return (label_W/2)+v.id*label_W; })
			.attr("y", function(v) { return height+(margin.bottom/2)+5; })
			.style("fill", function(v) { return color(v.name);})
			.on("click", function (v) { click(v); } )
			.text(function(v) { return v.name;});

		*/

		focus.selectAll("x")
				.data(data)
				.enter()
			.append("line")
				.attr("class","x")
				.attr("id", function(v) { return "tag_" + v.name; })
				.style("display","none")
				.style("stroke", "blue")
				.style("stroke-dasharray", "3.3")
				.style("opacity", 0.5)
				.attr("y1", -height)
				.attr("y2", 0);

		focus.selectAll("y")
				.data(data)
				.enter()
			.append("line")
				.attr("class","y")
				.attr("id", function(v) { return "tag_"+v.name; })
				.style("display","none")
				.style("stroke", "blue")
				.style("stroke-dasharray", "3.3")
				.style("opacity", 0.5)
				.attr("x1", 0)
				.attr("x2", width);

		focus.selectAll("dot")
				.data(data)
				.enter()
			.append("circle")
				.attr("class", "dot")
				.attr("id", function(v) { return "tag_"+v.name; })
				.style("display","none")
				.style("opacity", 0.5)
				.style("fill", "none")
				.style("stroke", "blue")
				.attr("r", 4);


		svg.append("rect")
			.attr("width", width)
			.attr("height", height)
			.style("fill", "none")
			.style("pointer-events", "all")
			.on("mouseover", function() { focus.style("display", null); })
			.on("mouseout", function() { focus.style("display", "none"); })
			.on("mousemove", mousemove);

		var bisectDate = d3.bisector(function(v) { return v.Date; }).left;

		function mousemove () {

			var x0 = x.invert(d3.mouse(this)[0]);

			data.forEach( function(v) {
		
				var	i = bisectDate(v.value, x0, 1);
				var	d0 = v.value[i - 1];
				var	d1 = v.value[i];
				var	d = x0 - d0.Date > d1.Date - x0 ? d1 : d0;

				focus.select("#tag_" + v.name + ".x")
					.attr("transform", "translate(" + x(d.Date) + ","
													+ y(0) + ")");
				focus.select("#tag_" + v.name + ".y")
					.attr("transform", "translate(" + 0 + ","
												+ y(d.price) + ")");

				focus.select("#tag_" + v.name + ".dot")
					.attr("transform", "translate(" + x(d.Date) + ","
													+ y(d.price) + ")");
			});
			/*
			var x0 = x.invert(d3.mouse(this)[0]),
				i = bisectDate(data[0].value, x0, 1),
				d0 = data[0].value[i - 1],
				d1 = data[0].value[i],
				d = x0 - d0.Date > d1.Date - x0 ? d1 : d0;

			*/
		}

		// check box
		domobj
		.append("div")
			.selectAll(".vginput")
			.data(data)
		.enter()
		.append("label")
			.style("color", function(v) { return color(v.name); })
			.text(function(v) { return " |" + v.name; })
		.append("input")
			.attr("type","checkbox")
			.property("position", "absolute")
			.property("left", function(v) { return v.id*10+"px"; })
			.on("change", function(v) {
				this.checked ^ true;
				click(v);
			})
		;

		// for toggle event
		function click(v) {
			var duration_time = 800;

			v.opacity ^= 1;

			var y_max = d3.max(data.filter( function(v) { return v.opacity===1; }), function(v) {return d3.max(v.value, function(d) { return d.price; }); });
			y_max = isNaN(y_max)?+50:y_max+20;
			y.domain([
				0,
				y_max
			]);

			d3.select(".y.axis")
				.transition()
				.duration(duration_time)
				.call(yAxis);

			data.forEach( function(v) {
					d3.select(".line#tag_"+v.name)
						.transition()
						.duration(duration_time)
						.attr("d", function(v) { return line(v.value); });

					d3.select(".city#tag_"+v.name)
						.transition()
						.duration(duration_time)
						.style("opacity", function(v) { return v.opacity; });

					d3.select(".vglabel#tag_"+v.name)
						.transition()
						.duration(duration_time)
						.attr("transform", function(v) { return "translate(" + x(v.value.Date) + "," + y(v.value.price) + ")"; });

					d3.select(".x#tag_"+v.name)
						.style("display", function(v) { return v.opacity===1 ?null:"none";});

					d3.select(".y#tag_"+v.name)
						.style("display", function(v) { return v.opacity===1 ?null:"none" ;});

					d3.select(".dot#tag_"+v.name)
						.style("display", function(v) { return v.opacity===1 ?null:"none"; });

			});
		}

	///// brush

	var height2 = 50;

	var x2 = d3.time.scale()
	    .range([0, width]);

	x2.domain([
		d3.min(data, function(v) { return d3.min(v.value, function(d) { return d.Date});}),
		d3.max(data, function(v) { return d3.max(v.value, function(d) { return d.Date});})
	]);
	    var y2 = d3.scale.linear().range([height2, 0]);

	var xAxis2 = d3.svg.axis().scale(x2).orient("bottom");

	var brush = d3.svg.brush()
	    .x(x2)
	    .on("brush", brushed);

	var area2 = d3.svg.area()
	    .interpolate("monotone")
	    .x(function(d) { return x2(d.Date); })
	    .y0(height2)
	    .y1(function(d) { return y2(d.price); });

	svg.append("defs").append("clipPath")
	    .attr("id", "clip")
	  .append("rect")
	    .attr("width", width)
	    .attr("height", height);

	var context = svg.append("g")
	    .attr("class", "context")
	    .attr("transform", "translate(" + margin.left + "," + 550 + ")");

	  context.append("path")
	      .data(data)
	      .attr("class", "area")
	      .attr("d", area2);

	  context.append("g")
	      .attr("class", "x axis")
	      .attr("transform", "translate(0," + height2 + ")")
	      .call(xAxis2);

	  context.append("g")
	      .attr("class", "x brush")
	      .call(brush)
	    .selectAll("rect")
	      .attr("y", -6)
	      .attr("height", height2 + 7);

	////////////////

		function brushed() {
			x.domain(brush.empty() ? x2.domain() : brush.extent());
			graph
				.attr("d", function(v) { return line(v.value); });
			//vg.select(".x.axis").call(xAxis);
			d3.select(".x.axis").call(xAxis);
		}

	});

}