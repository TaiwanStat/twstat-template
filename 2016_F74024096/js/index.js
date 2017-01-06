$(document).ready(function() {
    var features;

    d3.json("taiwan.json", function(topodata) {
        // "map" is the file name of the original shp file
        features = topojson.feature(topodata, topodata.objects["map"]).features;

        var color = d3.scaleLinear().domain([0, 3000]).range(["#090", "#f00"]);
        var pie_color = d3.scaleOrdinal()
            .domain(features.map(function(d) {
                return d.properties.COUNTYNAME
            }))
            .range(["#0a72ff", "#1eff06", "#ff1902", "#2dfefe",
                "#827c01", "#fe07a6", "#a8879f", "#fcff04",
                "#c602fe", "#16be61", "#ff9569", "#05b3ff",
                "#ecffa7", "#3f8670", "#e992ff", "#ffb209",
                "#e72955", "#83bf02", "#bba67b", "#fe7eb1",
                "#7570c1", "#85bfd1"
            ]);

        // setup pie chart
        var pie_width = 170,
            pie_height = 170;
        var outer_radius = pie_width / 2,
            inner_radius = 0;
        var arc = d3.arc().innerRadius(inner_radius).outerRadius(outer_radius);
        var arc_over = d3.arc().innerRadius(inner_radius).outerRadius(outer_radius + 10);
        var label_arc = d3.arc().innerRadius(outer_radius - 5).outerRadius(outer_radius + 50);
        var label_arc_over = d3.arc().innerRadius(outer_radius - 5).outerRadius(outer_radius + 65);

        // display Taiwan map
        var width = 350,
            height = 500;
        var svg = d3.select("body").selectAll("div[name='info_div']").select("div.row").append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox", "0, 0, " + width + ", " + height);
        var path = d3.geoPath().projection( // path generator
            d3.geoMercator().center([124, 24]).scale(4500) // coordinate translate function
        );

        d3.selectAll("svg").selectAll("path").data(features)
            .enter().append("path")
            .attr("d", path);

        // setup the color definition of map
        var defs = svg.append("defs");
        var linear_gradient = defs.append("linearGradient")
                                .attr("id", "linearColor");
        linear_gradient.append("stop")
                    .attr("offset", "0%")
                    .style("stop-color", "#090");
        linear_gradient.append("stop")
                    .attr("offset", "100%")
                    .style("stop-color", "#f00");
        svg.append("rect")
            .attr("width", "25%")
            .attr("height", "20")
            .attr("x", 0)
            .attr("y", "85%")
            .style("fill", "url(#" + linear_gradient.attr("id") + ")");
        svg.append("text")
            .attr("x", "0")
            .attr("y", "84%")
            .attr('text-anchor', 'middle')
            .text("low");
        svg.append("text")
            .attr("x", "25%")
            .attr("y", "84%")
            .attr('text-anchor', 'middle')
            .text("high");

        // parse data
        d3.text("data.csv", function(data) {
            var new_data = data.slice(data.indexOf("\n") + 1);
            var parse_data = d3.csvParse(new_data);
            // set the map color
            for (var i = features.length - 1; i >= 0; i--) {
                var index = "老年人口依賴比 / " + features[i].properties.COUNTYNAME + " ";
                features[i].properties.old_people = parse_data[parse_data.length - 17][index].replace(" ", "");
            }

            display_aged_map();
            display_aged_pie();
        });

        //parse nuring house data
        d3.text("nursing_house.csv", function(data) {
            var parse_data = d3.csvParse(data);
            var total_staff_data = new Object();
            parse_data.forEach(function(row) {
                var split_str = row["年　及　地　區　別"].split("　");
                if (split_str.length < 4)
                    return; // replace continue
                total_staff_data[split_str[2].replace(" ", "")] = row["總計"];
            });

            for (var i = features.length - 1; i >= 0; i--) {
                features[i].properties.nursing_house = total_staff_data[features[i].properties.COUNTYNAME];
            }

            display_house_pie();
            $('#loading').hide();
        });

        function display_aged_map() {
            d3.select("svg").selectAll("path").data(features)
                .attr("d", path)
                .attr("fill", function(d) {
                    return color(d.properties.old_people * 100);
                })
                .attr("id", function(d) {
                    return d.properties.COUNTYNAME.replace(" ", "") + "_map";
                })
                .on("mouseover", function(d) {
                    display_county_cond(d);
                    d3.select(this).style('fill-opacity', 0.3);
                })
                .on("mouseenter", function(d) {
                    $("#" + d.properties.COUNTYNAME + "_house_pie").triggerSVGEvent('mouseenter');
                })
                .on("mouseleave", function(d) {
                    $("#" + d.properties.COUNTYNAME + "_house_pie").triggerSVGEvent('mouseleave');
                })
        }

        function display_nursing_house() {
            d3.select("svg").selectAll("path").data(features)
                .attr("d", path)
                .attr("fill", function(d) {
                    return color(d.properties.nursing_house);
                })
                .attr("id", function(d) {
                    return d.properties.COUNTYNAME + "_map";
                })
                .on("mouseover", function(d) {
                    display_county_cond(d);
                });
        }

        function display_county_cond(d) {
            if ($("button[name='aged']").hasClass("active")) {
                $("div[name='info']").css("color", color(d.properties.old_people * 100));
            } else {
                $("div[name='info']").css("color", color(d.properties.nursing_house));
            }

            $("#county_name").text(d.properties.COUNTYNAME);
            $("#old_people").text(d.properties.old_people);
            $("#nursing_house").text(d.properties.nursing_house);
        }

        // pie chart setup
        function display_aged_pie() {
            var pie = d3.pie()
                .sort(null)
                .value(function(d) {
                    return d.properties.old_people * 100
                });

            var pie_svg = d3.select("div[name='pie_div']").select("div.row[name='aged']").append("svg")
                .attr("width", "100%")
                .attr("height", "100%")
                .attr("viewBox", "0, 0, " + (pie_width + 100) + ", " + (pie_height + 100));

            var g = pie_svg.selectAll(".arc")
                .data(pie(features))
                .enter().append("g")
                .attr("class", "arc")
                .attr("transform", "translate(" + (pie_width + 100) / 2 + ", " + (pie_height + 100) / 2 + ")");
            g.append("path")
                .attr("d", arc)
                .attr("fill", function(d) {
                    return pie_color(d.data.properties.COUNTYNAME)
                })
                .attr("id", function(d) {
                    return d.data.properties.COUNTYNAME + "_aged_pie"
                })
                .on("mouseenter", function(d) {
                    mouse_enter(d);
                })
                .on("mouseleave", function(d) {
                    mouse_leave(d);
                });
            g.append("text")
                .attr("transform", function(d) {
                    var mid_angle = d.endAngle < Math.PI ? d.startAngle / 2 + d.endAngle / 2 : d.startAngle / 2 + d.endAngle / 2 + Math.PI;
                    return "translate(" + label_arc.centroid(d) + ") rotate(-90) rotate(" + (mid_angle * 180 / Math.PI) + ")";
                })
                .attr("dy", ".35em")
                .attr('text-anchor', 'middle')
                .attr("id", function(d) {
                    return d.data.properties.COUNTYNAME + "_aged_pie_text"
                })
                .text(function(d) {
                    return d.data.properties.COUNTYNAME
                });
        }

        function display_house_pie() {
            var pie = d3.pie()
                .sort(null)
                .value(function(d) {
                    return d.properties.nursing_house
                });

            var pie_svg = d3.select("div[name='pie_div']").select("div.row[name='house']").append("svg")
                .attr("width", "100%")
                .attr("height", "100%")
                .attr("viewBox", "0, 0, " + (pie_width + 100) + ", " + (pie_height + 100));

            var g = pie_svg.selectAll(".arc")
                .data(pie(features))
                .enter().append("g")
                .attr("class", "arc")
                .attr("transform", "translate(" + (pie_width + 100) / 2 + ", " + (pie_height + 100) / 2 + ")");
            g.append("path")
                .attr("d", arc)
                .attr("fill", function(d) {
                    return pie_color(d.data.properties.COUNTYNAME)
                })
                .attr("id", function(d) {
                    return d.data.properties.COUNTYNAME + "_house_pie"
                })
                .on("mouseenter", function(d) {
                    mouse_enter(d);
                })
                .on("mouseleave", function(d) {
                    mouse_leave(d);
                });
            g.append("text")
                .attr("transform", function(d) {
                    var mid_angle = d.endAngle < Math.PI ? d.startAngle / 2 + d.endAngle / 2 : d.startAngle / 2 + d.endAngle / 2 + Math.PI;
                    return "translate(" + label_arc.centroid(d) + ") rotate(-90) rotate(" + (mid_angle * 180 / Math.PI) + ")";
                })
                .attr("dy", ".35em")
                .attr('text-anchor', 'middle')
                .attr("id", function(d) {
                    return d.data.properties.COUNTYNAME + "_house_pie_text"
                })
                .text(function(d) {
                    return (d.data.properties.nursing_house > 100) ? d.data.properties.COUNTYNAME : ""
                });
        }

        function mouse_enter(d) {
            d3.select("#" + d.data.properties.COUNTYNAME + "_house_pie")
                .attr("stroke", "white")
                .transition()
                .duration(100)
                .attr("d", arc_over)
                .attr("stroke-width", 3);
            d3.select("#" + d.data.properties.COUNTYNAME + "_house_pie_text")
                .transition()
                .duration(100)
                .attr("transform", function(d) {
                    var mid_angle = d.endAngle < Math.PI ? d.startAngle / 2 + d.endAngle / 2 : d.startAngle / 2 + d.endAngle / 2 + Math.PI;
                    return "translate(" + label_arc_over.centroid(d) + ") rotate(-90) rotate(" + (mid_angle * 180 / Math.PI) + ")";
                });

            d3.select("#" + d.data.properties.COUNTYNAME + "_aged_pie")
                .attr("stroke", "white")
                .transition()
                .duration(100)
                .attr("d", arc_over)
                .attr("stroke-width", 3);
            d3.select("#" + d.data.properties.COUNTYNAME + "_aged_pie_text")
                .transition()
                .duration(100)
                .attr("transform", function(d) {
                    var mid_angle = d.endAngle < Math.PI ? d.startAngle / 2 + d.endAngle / 2 : d.startAngle / 2 + d.endAngle / 2 + Math.PI;
                    return "translate(" + label_arc_over.centroid(d) + ") rotate(-90) rotate(" + (mid_angle * 180 / Math.PI) + ")";
                });

            d3.select("#" + d.data.properties.COUNTYNAME + "_map").style('fill-opacity', 0.3);
            display_county_cond(d.data);
        }

        function mouse_leave(d) {
            d3.select("#" + d.data.properties.COUNTYNAME + "_house_pie")
                .transition()
                .attr("d", arc)
                .attr("stroke", "none");
            d3.select("#" + d.data.properties.COUNTYNAME + "_house_pie_text")
                .transition()
                .duration(100)
                .attr("transform", function(d) {
                    var mid_angle = d.endAngle < Math.PI ? d.startAngle / 2 + d.endAngle / 2 : d.startAngle / 2 + d.endAngle / 2 + Math.PI;
                    return "translate(" + label_arc.centroid(d) + ") rotate(-90) rotate(" + (mid_angle * 180 / Math.PI) + ")";
                });

            d3.select("#" + d.data.properties.COUNTYNAME + "_aged_pie")
                .transition()
                .attr("d", arc)
                .attr("stroke", "none");
            d3.select("#" + d.data.properties.COUNTYNAME + "_aged_pie_text")
                .transition()
                .duration(100)
                .attr("transform", function(d) {
                    var mid_angle = d.endAngle < Math.PI ? d.startAngle / 2 + d.endAngle / 2 : d.startAngle / 2 + d.endAngle / 2 + Math.PI;
                    return "translate(" + label_arc.centroid(d) + ") rotate(-90) rotate(" + (mid_angle * 180 / Math.PI) + ")";
                });

            d3.select("#" + d.data.properties.COUNTYNAME + "_map").style('fill-opacity', 1);
        }

        $.fn.triggerSVGEvent = function(eventName) {
            var event = document.createEvent('SVGEvents');
            event.initEvent(eventName, true, true);
            this[0].dispatchEvent(event);
            return $(this);
        };

        $("button[name='aged']").on("click", function(e) {
            e.preventDefault();

            $(this).addClass("active").attr("disabled", true);
            $("button[name='house']").removeClass("active").attr("disabled", false);
            display_aged_map();
        }).trigger("click");

        $("button[name='house']").on("click", function(e) {
            e.preventDefault();

            $(this).addClass("active").attr("disabled", true);
            $("button[name='aged']").removeClass("active").attr("disabled", false);
            display_nursing_house();
        });

    });
});
