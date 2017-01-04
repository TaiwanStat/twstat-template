var lk = [ "臺北市", "新北市", "桃園市", "臺中市", "臺南市", "高雄市", 
		"臺北縣", "桃園縣", "臺中縣", "臺南縣", "高雄縣", "基隆市", "新竹市", "嘉義市", 
		"新竹縣", "苗栗縣", "彰化縣", "雲林縣", "南投縣", "嘉義縣", "屏東縣", "宜蘭縣", 
		"花蓮縣", "臺東縣", "澎湖縣", "金門縣", "連江縣"];

$(function(){
	var ckbs = "";
	for(var i = 0; i < lk.length; i++){	
		switch(i){
			case 0:
				ckbs += "六都：<br>"
				break;
			case 6:
				ckbs += "<p>五都升格合併前的縣份：<br>";
				break;
			case 11:
				ckbs += "<p>縣市：<br>";
				break;
			case 24:
				ckbs += "<p>離島縣：<br>";
				break;
		}
		ckbs += "<label><input type='checkbox' value='" + i + "' class='lk_govern' checked>";
		ckbs += lk[i] + "</label>";
		
	}
	$("#ckbs_for_svg2").append(ckbs);
	
	var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);
	
	var svg = d3.select("#svg1").append("svg:svg").attr("height", 500).attr("width", 960),
    margin = {top: 20, right: 70, bottom: 30, left: 70},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	var x = d3.scaleLinear().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    z = d3.scaleOrdinal(d3.schemeCategory10);
	
	var svg2 = d3.select("#svg2").append("svg:svg").attr("height", 500).attr("width", 960),
    margin2 = {top: 20, right: 70, bottom: 30, left: 70},
    width2 = +svg2.attr("width") - margin2.left - margin2.right,
    height2 = +svg2.attr("height") - margin2.top - margin2.bottom,
    g2 = svg2.append("g").attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");
	var x2 = d3.scaleLinear().range([0, width]),
    y2 = d3.scaleLinear().range([height, 0]),
    z2 = d3.scaleOrdinal(d3.schemeCategory10);
	
	var line = d3.line()
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.total); });
	var line2 = d3.line()
    .x(function(d) { return x2(d.year); })
    .y(function(d) { return y2(d.total); });
	
	var callback = function(error, data) {
		if (error) throw error;
		
		//console.log(data);
		
		var governs = d3.nest()
		.key(function(d) { return d.government; })
		.entries(data);
		
		var clgovern = [], lkgovern = [];
		for(var i = 0; i < governs.length; i++){
			if(governs[i].key == "中央政府" || governs[i].key == "地方政府"){
				//console.log("go");
				clgovern.push(governs[i]);
				var v = governs[i].values;
				//console.log(v);
				for(var j = 0; j < v.length; j++){
					//console.log(v[j].government + ": " + v[j].year);
				}
				//console.log(governs[i].value["total"]);
			}
			if(lk.find(findLkgovern, governs[i].key)){
				lkgovern.push(governs[i]);
			}
		}
		
		console.log(lkgovern);
		/* 中央政府 vs. 地方政府 svg */
		//x.domain(d3.extent(data, function(d) { return d.year; }));
		x.domain([
			d3.min(governs, function(c) { return d3.min(c.values, function(d) { return d.year - 1; }); }),
			d3.max(governs, function(c) { return d3.max(c.values, function(d) { return d.year + 1; }); })
		]);
		/*y.domain([
			d3.min(governs, function(c) { return d3.min(c.values, function(d) { return d.total; }); }),
			d3.max(governs, function(c) { return d3.max(c.values, function(d) { return d.total; }); })
		]);*/
		
		y.domain([
			d3.min([0]),
			d3.max(clgovern, function(c) { return d3.max(c.values, function(d) { return d.total; }); })
		]);

		z.domain(governs.map(function(c) { return c.government; }));
		
		g.append("g")
		.attr("class", "axis axis--x")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x))
		.append("text")
		.attr("x", 840)
		.attr("dx", "0.71em")
		.attr("fill", "#000")
		.text("民國(年)");

		g.append("g")
		.attr("class", "axis axis--y")
		.call(d3.axisLeft(y))
		.append("text")
		//.attr("transform", "rotate(-90)")
		.attr("x", 15)
		.attr("y", -10)
		.attr("dy", "0.71em")
		.attr("fill", "#000")
		.text("總負債(百萬元)");
		
		 var clgoverns = g.selectAll(".city")
			.data(clgovern)
			.enter().append("g")
			.attr("class", "city")
			.attr("id", function(d) { return d.key; });

		clgoverns.append("path")
		.attr("class", "line")
		.attr("d", function(d) { return line(d.values); })
		.style("stroke", function(d) { return z(d.key); });

		clgoverns.append("text")
		.datum(function(d) { return {key: d.key, value: d.values[d.values.length - 1]}; })
		.attr("transform", function(d) { return "translate(" + x(d.value.year) + "," + y(d.value.total) + ")"; })
		.attr("x", 3)
		.attr("dy", "0.35em")
		.style("font", "10px sans-serif")
		.text(function(d) { return d.key; });
		
		g.selectAll("dot")	
        .data(data)			
		.enter().append("circle")								
        .attr("r", 3)	
		.attr("fill", "steelblue")
        .attr("cx", function(d) { return x(d.year); })		 
        .attr("cy", function(d) { return y(d.total); })
		.attr("id", function(d) { return "svg1_" + d.government; })
        .on("mouseover", function(d) {	
			var str = "民國" + d.year + "年，"  + d.government + "<br>債務合計：" + d.total + " 百萬元";
			str += "<br>一年以上債務：" + d.over_one_year + " 百萬元";
			str += "<br>未滿一年債務：" + d.less_one_year + " 百萬元";
            div.transition()		
                .duration(200)		
                .style("opacity", .9);		
            div	.html(str)	
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");	
            })					
        .on("mouseout", function(d) {		
            div.transition()		
                .duration(500)		
                .style("opacity", 0);	
        });
		for(var i = 0; i < governs.length; i++){
			if(!(governs[i].key == "中央政府" || governs[i].key == "地方政府")){
				d3.selectAll("#svg1_" + governs[i].key).style("display", "none");
				//console.log("#svg1_" + governs[i].key);
			}
		}
		//d3.selectAll("#合計").style("display", "none");
		//d3.selectAll("#合計").style("display", "inline");
		
		/* 所有地方政府 svg */
		x2.domain([
			d3.min(governs, function(c) { return d3.min(c.values, function(d) { return d.year - 1; }); }),
			d3.max(governs, function(c) { return d3.max(c.values, function(d) { return d.year + 1; }); })
		]);
		y2.domain([
			d3.min([0]),
			d3.max(lkgovern, function(c) { return d3.max(c.values, function(d) { return d.total; }); })
		]);
		z2.domain(governs.map(function(c) { return c.government; }));
		
		g2.append("g")
		.attr("class", "axis axis--x")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x2))
		.append("text")
		.attr("x", 840)
		.attr("dx", "0.71em")
		.attr("fill", "#000")
		.text("民國(年)");
		
		g2.append("g")
		.attr("class", "axis_axis_y_2")
		.call(d3.axisLeft(y2))
		.append("text")
		//.attr("transform", "rotate(-90)")
		.attr("x", 15)
		.attr("y", -12)
		.attr("dy", "0.71em")
		.attr("fill", "#000")
		.text("總負債(百萬元)");
		
		 var lkgoverns = g2.selectAll(".local")
			.data(lkgovern)
			.enter().append("g")
			.attr("class", "local")
			.attr("id", function(d) { return "svg2_" + d.key; });
			
		lkgoverns.append("path")
		.attr("class", "line2")
		.attr("d", function(d) { return line2(d.values); })
		.style("stroke", function(d) { return z2(d.key); });

		lkgoverns.append("text")
		.datum(function(d) { return {key: d.key, value: d.values[d.values.length - 1]}; })
		.attr("transform", function(d) { return "translate(" + x2(d.value.year) + "," + y2(d.value.total) + ")"; })
		.attr("class", "svg2_pathtxt")
		.attr("x", 3)
		.attr("dy", "0.35em")
		.style("font", "10px sans-serif")
		.text(function(d) { return d.key; });
		
		g2.selectAll("dot")	
        .data(data)			
		.enter().append("circle")								
        .attr("r", 3)	
		.attr("fill", "steelblue")
		.attr("class", "svg2_dot")
        .attr("cx", function(d) { return x2(d.year); })		 
        .attr("cy", function(d) { return y2(d.total); })
		.attr("id", function(d) { return "svg2_" + d.government; })
        .on("mouseover", function(d) {	
			var str = "民國" + d.year + "年，"  + d.government + "<br>債務合計：" + d.total + " 百萬元";
			str += "<br>一年以上債務：" + d.over_one_year + " 百萬元";
			str += "<br>未滿一年債務：" + d.less_one_year + " 百萬元";
            div.transition()		
                .duration(200)		
                .style("opacity", .9);		
            div	.html(str)	
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");	
            })					
        .on("mouseout", function(d) {		
            div.transition()		
                .duration(500)		
                .style("opacity", 0);	
        });
		for(var i = 0; i < governs.length; i++){
			d3.selectAll("#svg2_" + governs[i].key).style("display", "none");
		}
		for(var i = 0; i < lkgovern.length; i++){
			d3.selectAll("#svg2_" + lkgovern[i].key).style("display", "inline");
		}
		
		$(".lk_govern").change(function(){
			var tar = "#svg2_" + lk[this.value];
			var num, item;
			if(this.checked){				
				d3.selectAll(tar).style("display", "inline");
				for(var i = 0; i < governs.length; i++){
					if(governs[i].key == lk[this.value]){
						item = governs[i];
						break;
					}
				}
				lkgovern.push(item);
				y2.domain([
					d3.min([0]),
					d3.max(lkgovern, function(c) { return d3.max(c.values, function(d) { return d.total; }); })
				]);
			}
			else{
				d3.selectAll(tar).style("display", "none");
				for(var i = 0; i < lkgovern.length; i++){
					if(lkgovern[i].key == lk[this.value]){
						num = i;
						break;
					}
				}
				lkgovern.splice(i, 1);
				y2.domain([
					d3.min([0]),
					d3.max(lkgovern, function(c) { return d3.max(c.values, function(d) { return d.total; }); })
				]);
			}
			
			d3.select(".axis_axis_y_2").call(d3.axisLeft(y2));
			d3.selectAll(".line2").attr("d", function(d) { return line2(d.values); });
			d3.selectAll(".svg2_dot")
			.attr("cx", function(d) { return x2(d.year); })
			.attr("cy", function(d) { return y2(d.total); });
			d3.selectAll(".svg2_pathtxt").attr("transform", function(d) { return "translate(" + x2(d.value.year) + "," + y2(d.value.total) + ")"; });
		});
		
		$("#unckall").click(function(){
			//console.log(this.value);
			var txt = $("#unckall").val();
			if(txt == "全部取消勾選"){
				$(".lk_govern").prop('checked', false).trigger("change");
				$("#unckall").val("全部勾選");
			}
			if(txt == "全部勾選"){
				$(".lk_govern").prop('checked', true).trigger("change");
				$("#unckall").val("全部取消勾選");
			}
		});
		
	};
	
	var row = function(d){
		return {
			year: +d.year,
			government: big5ToUtf8(d.government),
			over_one_year: +d.over_one_year,
			less_one_year: +d.less_one_year,
			total: +d.total
		};
	};
	
	//var ncsv = d3.request.mimeType("iso-8859-1");
	d3.request("loan.csv")
    .mimeType("text/csv; charset=big5")
    .response(function(xhr) { return d3.csvParse(xhr.responseText, row); })
    .get(callback);
		
});

function big5ToUtf8(text){
	var str = text.toString();
	//console.log(str);
	str = str.replace(/[^\u0000-\u00FF]/g, function($0){
		return unescape($0).replace(/(%u)(\w{4})/g,"&#x$2;"); });
	//console.log(str);
	return str;
}

function findLkgovern(lk){
	return (lk == this) ? true : false;
}
