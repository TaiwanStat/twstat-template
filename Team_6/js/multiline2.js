var VG_NAME = ["LH","LM","LP"]

var DATA_PATH = './data/';

var DEFAULT_XSCALE;

function drawMultilineChart(domObj, domObjSel, MainWidth, MainHeight){
	var drawObj = {};
	MainHeight = 500;
	init(domObj, MainWidth, MainHeight, drawObj);
	initAllLine(drawObj);
	removeOneLine();
}

function init(domObj, MainWidth, MainHeight, _drawObj){
	// input argument : outWidth

	/*---------------*/
	var xDomain = getTimeDomain();
	var yDomain =  [+0,+300];
	/*---------------*/

	var margin = 
				{top: 20, right: 20, bottom: 30, left: 50};

	var width =
				MainWidth - margin.left - margin.right;

	var height =
				MainHeight - margin.top - margin.bottom;
	
	var xScale =
				d3.time.scale()
					.range([0,width])
					.domain(xDomain);
	
	var yScale =
				d3.scale.linear()
					.range([height,0])
					.domain(yDomain);
	
	var color =
				d3.scale.category20()
					.domain(VG_NAME);

	var xAxis =
				d3.svg.axis()
					.scale(xScale)
					.orient("bottom")
					.tickSize(-height,0);
	
	var yAxis = 
				d3.svg.axis()
					.scale(yScale)
					.ticks(5,"$")
					.orient("left")
					.tickSize(-width,0);

	var line = 
				d3.svg.line()
					.x(function(d) { return xScale(d.date); })
					.y(function(d) { return yScale(d.price); });

	// basicForm include
	var basicForm =
					domObj.append("svg")
						.attr("width", width + margin.left + margin.right)
						.attr("height", height+ margin.top + margin.bottom);
	
	var basicDraw = 
					basicForm.append("g")
						.attr("transform", "translate("+margin.left+","+margin.top+")");
	
	var backGround =
					basicDraw.append("g")
						.append("rect")
						.attr("width", width)
						.attr("height", height)
						.style("fill","white");
	
	var focus = 
					basicDraw.append("g")
						.style("display", "none");

	var gxAxis =
					basicDraw.append("g")
						.attr("transform","translate(0,"+height+")")
						.call(xAxis);

	var gyAxis =
					basicDraw.append("g")
						.call(yAxis);

	var vgLine = 
					basicDraw.append("g")
						.attr("class","vgLine");

	_drawObj['xDomain'] = xDomain;
	_drawObj['yDomain'] = yDomain;
	_drawObj['margin'] = margin;
	_drawObj['width'] = width;
	_drawObj['height'] = height;
	_drawObj['xScale'] = xScale;
	_drawObj['yScale'] = yScale;
	_drawObj['color'] = color;
	_drawObj['xAxis'] = xAxis;
	_drawObj['yAxis'] = yAxis;
	_drawObj['line'] = line;
	_drawObj['basicForm'] = basicForm;
	_drawObj['basicDraw'] = basicDraw;
	_drawObj['backGround'] = backGround;
	_drawObj['focus'] = focus;
	_drawObj['gxAxis'] = gxAxis;
	_drawObj['gyAxis'] = gyAxis;
	_drawObj['vgLine'] = vgLine;
}

function initAllLine(_drawObj) {
	for(i = 0;i < VG_NAME.length; ++i) {
		addLine(_drawObj, VG_NAME[i]);
	}
}

function addLine(_drawObj, _name){
	var localTest;

	d3.csv("./data/"+_name+".csv", function(d) {
		return {
			date: new Date(d.year, d.month-1, d.day),
			price: +d.price
		};
	}, function(error, rows) {
		
		/* update Scale */
		var price = rows.map(function(d){ return d.price; });
		var localExtent = d3.extent(price);
		if(localExtent[0] < _drawObj.yDomain[0]) {
			_drawObj.yDomain[0] = localExtent[0];
		}
		if(localExtent[1] > _drawObj.yDomain[1]) {
			_drawObj.yDomain[1] = localExtent[1];
		}
		_drawObj.yScale.domain(_drawObj.yDomain);


		/* add new Line */
		_drawObj.vgLine
			.append("path")
			.datum(rows)
			.attr("id",_name)
			.attr("d", _drawObj.line)
			.style("fill", "none")
			.style("stroke", _drawObj.color(_name));

	});
}

function removeOneLine(){
	// test
	// remove for one line
	d3.select("path#LH").remove();
}

function getTimeDomain(){
	var start_date = new Date(2015,0,1);
	var yesterday = new Date();

	yesterday.setDate(yesterday.getDate()-1)
	yesterday.setHours(0);
	yesterday.setMinutes(0);
	yesterday.setSeconds(0);
	
	return [start_date, yesterday];
}
