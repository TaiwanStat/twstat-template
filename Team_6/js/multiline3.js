var TRANSF_TIME = 800;

function drawMultilineChart(domobj, domobjsel, _width){

    var dateParse = d3.time.format("%Y-%m-%d").parse;

    var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = _width - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var x = d3.time.scale()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

	var y3 = d3.scale.linear()
		.range([height, 0]);

    var color = d3.scale.category20();

    var mycolor = ["#FFFF00", "#FF8250","#FF0000"];

    var rankScale = d3.scale.linear()
                        .range(mycolor)
                        .domain([0,10,20]);

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
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.price); });

    // basic form
    var svg = domobj
        .append("svg")
            .attr("width", width + margin.left + margin.right + 90)
            .attr("height", 550 + margin.top + margin.bottom);
	
	var multi = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var bg = multi.append("g")
            .append("rect")
            .attr("class","main_rect")
            .attr("width", width)
            .attr("height", height);

    var focus = multi.append("g")
            .attr("class","focus")
            .style("display", "none");

    //end--line chart feature setting

    // store data from firebase and drawing charts
	//   Read only once
    //d3.csv("./data/merge.csv", function(error, data) {
    d3.json("./data/alldata.json", function(error, data) {

		var priceDomain = [+0, +50];

		var timeDomain = getTimeDomain();

		var vgdata = data.vgdata;

        var tydata = data.tydata;

        // reconstruct(rebuild) date
        vgdata.forEach( function(v) {
            v.value.forEach( function(e) {
                e.date = dateParse(e.date);
                e.price = +e.price;
            });
        });

        tydata.forEach( function(v) {
                v.name = v.name,
                v.rank = +v.rank,
                v.start_date = dateParse(v.start_date),
                v.end_date = dateParse(v.end_date)
        });

		$('#wait').remove();

		x.domain(timeDomain);

        var y_max = d3.max(
                vgdata.filter( function(v) { return v.opacity===1;}),
                function(v) { return d3.max(v.value, function(d) { return d.price; }); }
        );

        console.log(y_max);

        y_max = isNaN(y_max)? +50: y_max+20;

        priceDomain = [+0, y_max];

		y.domain(priceDomain);

        // append x axis by feature xAxis
        var gxAxis = multi.append("g")
                .attr("class","x axis")
                .attr("transform","translate(0," + height + ")")
                .call(xAxis);
        
        // append y axis by feature yAxis
        var gyAxis = multi.append("g")
                .attr("class","y axis")
                .call(yAxis)
            .append("text")
                .attr("transform","rotate(-90)")
                .attr("y",6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Price/Weight ($/kg)");
                
        multi.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", width)
            .attr("height", height);

        // add all g
        var vg = multi.selectAll(".city")
                    .data(vgdata)
                    .enter()
                .append("g")
                    .attr("class","city")
                    .attr("id", function(v) { return 'tag_'+v.name; })
                    .attr("clip-path", "url(#clip)")
                    .style("opacity", function(v) { return v.opacity; });

        // add path by feature "line" under each ".city"
        var graph = vg.append("path")
            .attr("class","line")
            .attr("id", function(v) { return "tag_"+v.name; })
            .attr("d", function(v) { return line(v.value); })
            .style("stroke", function(v) { return color(v.name); });

        var tybar = multi.selectAll("bar")
                .data(tydata)
                .enter()
            .append("rect")
                .attr("clip-path", "url(#clip)")
                .attr("id", "typhoonbar")
                .attr("class","bar")
                .attr("x", function(ty) { return x(ty.start_date); })
                .attr("width", function(ty) { return x(ty.end_date) - x(ty.start_date); })
                .attr("y", 0)
                .attr("height", height)
                .style("fill", function(ty) {
                        var _rank = ty.rank <= 15 ? 0  :
                                    ty.rank <= 25 ? 10 :
                                    20;
                        return rankScale( _rank); })
                .style("opacity", 0.5)
                .style("display", 'none');

        var tooltip = domobj
            .append("div")
                .attr("class","tooltip")
                .style("opacity",1)
                .style("display","none");

        tooltip
            .selectAll("tip")
            .data(vgdata)
            .enter()
        .append("div")
            .attr("class","tip")
            .attr("id", function(v) { return "tag_"+v.name; })
            .style("display", "none")
        .append("text")
            .style("color", function(v) { return color(v.name); });

        tooltip
            .selectAll("typhoon")
                .data(tydata)
                .enter()
            .append("div")
                .attr("class","typhoon")
                .attr("id", function(v) { return "tag_"+v.name; })
                .style("display","none")
            .append("text")
                .style("color", "black" )
                .text(function(v){ return v.name+":"+v.rank+" rk"; });

                // x dash line
        focus.selectAll(".x")
                .data(vgdata)
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

        // y dash line
        focus.selectAll(".y")
                .data(vgdata)
                .enter()
            .append("line")
                .attr("class","y")
                .attr("id", function(v) { return "tag_"+v.name; })
                .style("display","none")
                .style("stroke", function(v) { return color(v.name); })
                .style("stroke-dasharray", "3.3")
                .style("opacity", 1)
                .attr("x1", 0)
                .attr("x2", width);
        
        // plot
        focus.selectAll("dot")
                .data(vgdata)
                .enter()
            .append("circle")
                .attr("class", "dot")
                .attr("id", function(v) { return "tag_"+v.name; })
                .style("display","none")
                .style("opacity", 1)
                .style("fill", "none")
                .style("stroke", function(v) { return color(v.name); })
                .attr("r", 4);

        // active plane
        var activPlane = multi.append("rect")
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

        var bisectDate = d3.bisector(function(v) { return v.date; }).left;

        function mousemove () {

            var max = [];
            var x0 = x.invert(d3.mouse(this)[0]);
            var _x = d3.mouse(this)[0];

            vgdata.forEach( function(v) {
                if (v.opacity===1) {
                    var i = bisectDate(v.value, x0, 1);

                    i = (i>=v.value.length)?v.value.length-1:i;

                    var d0 = v.value[i - 1];
                    var d1 = v.value[i];
                    var d = x0 - d0.date > d1.date - x0 ? d1 : d0;


                    focus.select("#tag_" + v.name + ".x")
                        .attr("transform", "translate("+x(d.date)+","+y(0)+")");

                    focus.select("#tag_" + v.name + ".y")
                        .attr("transform", "translate("+0+","+y(d.price)+")");

                    focus.select("#tag_" + v.name + ".dot")
                        .attr("transform", "translate("+x(d.date)+","+y(d.price)+")");

                    tooltip
                        .select("div#tag_" + v.name + ".tip")
                        .select("text")
                        .text(v.name+":"+d.price+" $/kg");

                    }
                })
            ;
            
            if($('.typhoonbutton').hasClass('active')) {
                var change_white = true;
                tydata.forEach( function(ty) {
                    var ds1 = x(ty.start_date);
                    var ds2 = x(ty.end_date);

                    if (ds1<=_x && _x<=ds2) {
                        var _rank = ty.rank <= 15 ? 0  :
                                    ty.rank <= 25 ? 10 :
                                    20;
                        _color = rankScale(_rank);

                        tooltip
                            .style("background", _color)
                        .select("#tag_"+ty.name+".typhoon")
                            .style("display", null);

                        change_white = false;
                    } else {
                        tooltip.select("#tag_"+ty.name+".typhoon")
                            .style("display", "none");
                    }
                });

                if (change_white) {
                    tooltip
                        .style("background", "white");
                }
            }
                tooltip
                    .style("left",d3.event.pageX+"px")
                    .style("top",d3.event.pageY+"px");
            
        }

        var dropDown =
            domobjsel.append("select")
                .attr("class","ui dropdown");

        dropDown.append("option")
                .attr("value","NONE")
                .text("NONE");

        dropDown.selectAll("option.myitem")
                .data(vgdata)
                .enter()
            .append("option")
                .attr("class","myitem")
                .attr("value",function(d) { return d.name; })
                .text(function(d) { return d.name; });

        $('.dropdown')
            .dropdown({
                action: 'activate',
                duration: 800,
                onChange: function(text, value, $selectedItem){
                    vgdata.forEach(function(d){
                        d.opacity = +0;
                        d3.select("g.city#tag_"+d.name)
                            .style("opacity",d.opacity);

                        d3.select(".x#tag_"+d.name)
                            .style("display", function(v) { return v.opacity===1 ?null:"none";});

                        d3.select(".y#tag_"+d.name)
                            .style("display", function(v) { return v.opacity===1 ?null:"none" ;});

                        d3.select(".dot#tag_"+d.name)
                            .style("display", function(v) { return v.opacity===1 ?null:"none"; });

                        d3.select(".tip#tag_"+d.name)
                            .style("display", function(v) { return v.opacity===1 ?null:"none"; });
                    });

                    if(typeof text!='undefined'){

                        var targetData = vgdata.filter(function(d){ return d.name==text; })[0];

                      targetData.opacity = +1;

                        console.log(123);
                    
                       // change y domain
                        y.domain([
                                0,
                                d3.max(
                                    targetData.value.map(function(v){ return v.price;})
                                )*3/2
                            ]);

                        d3.select("g.y.Axis")
                                .transition()
                                .duration(TRANSF_TIME)
                                .call(yAxis);

                        d3.select("path.line#tag_"+targetData.name)
                                    .attr("d",line(targetData.value));

                        d3.select("g.city#tag_"+targetData.name)
                                .transition()
                                .duration(TRANSF_TIME)
                                    .style("opacity",targetData.opacity);

                        d3.select(".x#tag_"+targetData.name)
                            .style("display", function(v) { return v.opacity===1 ?null:"none";});

                        d3.select(".y#tag_"+targetData.name)
                            .style("display", function(v) { return v.opacity===1 ?null:"none" ;});

                        d3.select(".dot#tag_"+targetData.name)
                            .style("display", function(v) { return v.opacity===1 ?null:"none"; });

                        d3.select("div.ui.header#vgName")
                            .text(targetData.name);

                        d3.select(".tip#tag_"+targetData.name)
                            .style("display", function(v) { return v.opacity===1 ?null:"none"; });
                    }
                }
            })
        ;

        $('button.typhoonbutton')
            .on('click',function(){
                if($(this).hasClass('active')) {
                    $(this).removeClass('active');
                    $(this).text('OFF');
                    tybar
                        .style('display','none');
                } else {
                    $(this).addClass('active');
                    $(this).text('ON');
                    tybar
                        .style('display',null);
                }
            })
        ;

        /*
        vgdata.forEach(function(v){
            $('div.ui.dropdown .menu>.item [data-value'+v.name+']').css('color',color(v.name));
        });
        */

        ///// brush

    var height2 = 50;

    var x2 = d3.time.scale()
        .range([0, width]);

    x2.domain(timeDomain);

    var y2 = d3.scale.linear().range([height2, 0]);

    var xAxis2 = d3.svg.axis()
        .scale(x2)
        .orient("bottom");

    var brush = d3.svg.brush()
        .x(x2)
        .on("brush", brushed);

    /*
    domobjsel.append("input")
        .attr("type","button")
        .attr("value","30 days")
        .on("click", function(v) {
            //brush.extent(getTimeDomain());
            //brush();
            d3.selectAll(".brush").call(brush.extent(get30Day()));
            brushed();
            console.log(brush.extent());
        });

    domobjsel.append("input")
        .attr("type","button")
        .attr("value","10 days")
        .on("click", function(v) {
            //brush.extent(getTimeDomain());
            //brush();
            d3.selectAll(".brush").call(brush.extent(get10Day()));
            brushed();
            console.log(brush.extent());
        });

    var area2 = d3.svg.area()
        .interpolate("monotone")
        .x(function(d) { return x2(d.Date); })
        .y0(height2)
        .y1(function(d) { return y2(d.price); });
    */

    var context = svg.append("g")
        .attr("class", "context")
        .attr("transform", "translate(" + 50 + "," + 500 + ")");
    /*
    context.append("path")
        .data(data)
        .attr("class", "area")
        .attr("d", area2);
    */

    context.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height2 + ")")
        .call(xAxis2);

    context.append("g")
        .attr("class", "x brush")
        .call(brush)
    .selectAll("rect")
        .attr("y", -6)
        .attr("height", height2 + 7)
        .style("fill", "silver")
        .style("fill-opacity", 0.5)
        .style("visibility", "visible");

    ////////////////

        function brushed() {


            x.domain(brush.empty() ? x2.domain() : brush.extent())
                    .range([0, width]);

            graph
                .attr("d", function(v) { return line(v.value); });

            tybar
                .attr("x", function(ty) { return x(ty.start_date); })
                .attr("width", function(ty) { return x(ty.end_date) - x(ty.start_date); })
                .attr("y", 0)
                .attr("height", height);
        
            vg.select(".x.axis").call(xAxis);
            d3.select(".x.axis").call(xAxis);
        }

    });//csv-loader....
}

function getTimeDomain() {
    var start_date = new Date(2015,0,1);
    var yesterday = new Date();

    yesterday.setDate(yesterday.getDate()-1);
    yesterday.setHours(0);
    yesterday.setMinutes(0);
    yesterday.setSeconds(0);

    return [start_date, yesterday];
}