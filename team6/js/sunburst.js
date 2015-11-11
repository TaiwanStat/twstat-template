
function drawSunburst (domobj, itemobj, _width) {

	var dura = 500;

	var width = _width,
		height = _width,
		radius = (Math.min(width, height) - 100) / 2;

	var x = d3.scale.linear()
			.range([0, 2 * Math.PI]);

	var y = d3.scale.sqrt()
			.range([0, radius]);

	var color = d3.scale.category20c();

	var svg = domobj.append("svg")
			.attr("width", width)
			.attr("height", height)
		.append("g")
			.attr("transform", "translate(" + width / 2 + "," + (height / 2 + 10) + ")");

	var partition = d3.layout.partition()
			.sort(function(d, e) { return d.size > e.size; })
			.value(function(d) { return 1; });

	var arc = d3.svg.arc()
			.startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
			.endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx)-0.01)); })
			.innerRadius(function(d) { return Math.max(0, y(d.y)); })
			.outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)-1.5); });

	var firebaseRef = new Firebase("https://ikdde-team6.firebaseio.com/all_data/");

	firebaseRef.child("vegetable_data").on("value", function(snapshot) {

		var data = snapshot.val();
		console.log(data);
		var root = {name: "農產品", children:[]}

		var sz = 1;
		for(var cate in data){
			if(cate != "default"){
				var a = {name: cate, children:[]};
				root.children.push(a);
				for(var vege in data[cate]){
					var b = {name: vege, size: sz};
					sz++;
					a.children.push(b);
				}
			}
		}

		var node = root;

		var path = svg.datum(root).selectAll("path")
				.data(partition.nodes)
			.enter().append("path")
				.attr("d", arc)
				.style("fill", function(d) { return color((d.children ? d : d.parent).name); })
				.on("click", click)
				.each(stash)
				.on("click", click);

		var i = 0;
		var name = svg.datum(root).selectAll("text")
				.data(partition.nodes)
			.enter().append("text")
				.attr("x", function(d){return Math.cos(x(d.x + d.dx/2) - Math.PI/2) * y(d.y + d.dy/2);})
				.attr("y", function(d){return Math.sin(x(d.x + d.dx/2) - Math.PI/2) * y(d.y + d.dy/2);})
				.attr("text-anchor", "middle")
				.style("font-size", "8pt")
				.text(function(d) { return d.name; })
				.on("click", click);

		d3.select(self.frameElement).style("height", height + "px");

		function click(d) {
			node = d;
			path.transition()
				.duration(dura)
				.attrTween("d", arcTweenZoom(d));
			name.transition()
				.duration(dura)
				.attrTween("x", textTweenZoomX(d))
				.attrTween("y", textTweenZoomY(d))
				.attrTween("opacity", textTweenZoomVisible(d));
			if(d.children){
				itemobj.html("");
			}else{
				itemobj.html("");
				var dates = Object.keys(data[d.parent.name][d.name]);
				var price = (data[d.parent.name][d.name][dates[dates.length - 1]].price);
				itemobj.html("" + d.name + ": " + price + " NTD");
			}
			console.log(d);
		}

		function stash(d) {
			d.x0 = d.x;
			d.dx0 = d.dx;
		}

		function arcTweenData(a, i) {
			var oi = d3.interpolate({x: a.x0, dx: a.dx0}, a);
			function tween(t) {
				var b = oi(t);
				a.x0 = b.x;
				a.dx0 = b.dx;
				return arc(b);
			}
			if (i == 0) {
				var xd = d3.interpolate(x.domain(), [node.x, node.x + node.dx]);
				return function(t) {
					x.domain(xd(t));
					return tween(t);
				};
			} else {
				return tween;
			}
		}

		function arcTweenZoom(d) {
			var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
					yd = d3.interpolate(y.domain(), [d.y, 1]),
					yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
			return function(d, i) {
				return i
						? function(t) { return arc(d); }
						: function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); return arc(d); };
			};
		}

		function textTweenZoomX(d) {
			var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
					yd = d3.interpolate(y.domain(), [d.y, 1]),
					yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
			return function(d, i) {
				return function(t) {
					x.domain(xd(t));
					y.domain(yd(t)).range(yr(t));
					return Math.cos(x(d.x + d.dx/2) - Math.PI/2) * y(d.y + d.dy/2);
				};
			};
		}

		function textTweenZoomY(d) {
			var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
					yd = d3.interpolate(y.domain(), [d.y, 1]),
					yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
			return function(d, i) {
				return function(t) { 
					x.domain(xd(t)); 
					y.domain(yd(t)).range(yr(t)); 
					return Math.sin(x(d.x + d.dx/2) - Math.PI/2) * y(d.y + d.dy/2); 
				};
			};
		}

		function textTweenZoomVisible(d) {
			var isClickInnerCircle = d.depth == 0; 
			var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
					yd = d3.interpolate(y.domain(), [d.y, 1]),
					yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
			return function(d, i) {
				return function(t) { 
					x.domain(xd(t)); y.domain(yd(t)).range(yr(t));
					var isShownCircle = x(d.x) >=0 && x(d.x) < 2*Math.PI;
					var isThisOuterCircle = false;//d.depth == 2;
					if(!(isThisOuterCircle && isClickInnerCircle) && isShownCircle)
						return 1; 
					else 
						return 0; 
				};
			};
		}

	});

}
