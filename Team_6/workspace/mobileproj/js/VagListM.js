/**
Class Definition:
	Name: VagListM
	Type: Non-static Class, Obj prototype
*/
VagListM = function(d3svg, items){

	/**
		Public Field Initialization
	*/

	this.svgObj = d3svg;
	this.svgWidth = parseInt(d3svg.style("width"));

	this.itemMargin = 5;
	this.itemBeginX = 0;
	this.itemBeginY = 0;
	this.itemWidth = this.svgWidth - this.itemMargin*2;
	this.itemHeight = this.itemWidth / 6;
	this.itemBarsRatio = 0.8;
	this.itemPadding = 1;
	this.itemPadding2 = (this.itemWidth - this.itemPadding * 2) * this.itemBarsRatio;

	this.svgHeight = (this.itemHeight + this.itemMargin) * items.length;
	d3svg.style("height", "" + this.svgHeight + "px");

	this.itemList = items.map(function(a){
		return {
			id: a.id,
			name: a.name,

			price: a.price[a.price.length-1],
			yesterday: a.price[a.price.length-1] - a.price[a.price.length-2],
			smallavg: a.price[a.price.length-1] - a.smallavg,
			avg: a.price[a.price.length-1] - a.avg,

			d3group: d3svg.append("g")
		};
	});


	/**
		Public Method
	*/

	// Constructor

	for(var i = 0; i < this.itemList.length; i++){

		var d = this.itemList[i].d3group;

		d.append("rect")
			.attr("x",this.itemBeginX)
			.attr("y",this.itemBeginY)
			.attr("width",this.itemWidth)
			.attr("height",this.itemHeight)
			.style("fill","#f2f2f2");

		var ppercentage = this.itemList[i].price / 200;
		ppercentage = ppercentage > 1 ? 1 : ppercentage;
		var pbarLength = ppercentage * (this.itemWidth - this.itemPadding * 2) * this.itemBarsRatio;
		d.append("rect")
			.attr("x",this.itemBeginX + this.itemPadding)
			.attr("y",this.itemBeginY + this.itemPadding)
			.attr("width",pbarLength)
			.attr("height",this.itemHeight - this.itemPadding*2)
			.style("fill","#99ff99");

		var ypercentage = this.itemList[i].yesterday / 20;
		ypercentage = ypercentage > 1 ? 1 : ypercentage;
		var ybarLength = ypercentage * (this.itemWidth - this.itemPadding * 2) * (1-this.itemBarsRatio);
		if(ybarLength > 0){
			d.append("rect")
				.attr("class", "secondbar")
				.attr("x",this.itemBeginX + this.itemPadding + this.itemPadding2)
				.attr("y",this.itemBeginY + this.itemPadding)
				.attr("width",ybarLength)
				.attr("height",this.itemHeight - this.itemPadding*2)
				.style("fill","#ff6666");
		} else {
			d.append("rect")
				.attr("x",this.itemBeginX + this.itemPadding + this.itemPadding2)
				.attr("y",this.itemBeginY + this.itemPadding)
				.attr("width",-ybarLength)
				.attr("height",this.itemHeight - this.itemPadding*2)
				.style("fill","#99ccff");
		}

		d.append("text")
			.attr("x",this.itemBeginX + 5)
			.attr("y",this.itemHeight*0.6)
			.text(this.itemList[i].name + ": " + this.itemList[i].price + " NTD")
			.style("fill","#333333");

		d.append("text")
			.attr("class", "secondtext")
			.attr("x",this.itemPadding2 + 5)
			.attr("y",this.itemHeight*0.6)
			.text(this.itemList[i].yesterday >= 0 ? "+" + this.itemList[i].yesterday : this.itemList[i].yesterday)
			.style("fill","#333333");

	}

	//////

	this.sortByToday = function(reverse){
		
		this.itemList.sort(function(a, b){
			return a.price - b.price;
		});
		
		if(reverse){
			this.itemList.reverse();
		}

		this.arrange();
	};

	this.sortByYesterday = function(reverse){
		
		this.itemList.sort(function(a, b){
			return a.yesterday - b.yesterday;
		});
		
		if(reverse){
			this.itemList.reverse();
		}

		this.arrange();
	};

	this.sortBySmallAvg = function(reverse){

		this.itemList.sort(function(a, b){
			return a.smallavg - b.smallavg;
		});
		
		if(reverse){
			this.itemList.reverse();
		}

		this.arrange();
	};

	this.sortByAvg = function(reverse){

		this.itemList.sort(function(a, b){
			return a.avg - b.avg;
		});
		
		if(reverse){
			this.itemList.reverse();
		}

		this.arrange();
	};

	/**
		Private Method
	*/
	
	this.arrange = function(){
		for(i = 0; i < this.itemList.length; i++){
			var y = this.itemBeginY + i * (this.itemHeight + this.itemMargin);
			this.itemList[i].d3group
				.transition()
				.attrTween("transform", tween(y))
				.duration(600);
		}
	};

	tween = function(y){
		return function(d, i, a){
			return d3.interpolateString(a, "translate(0, " + y + ")", "translate()");
		};
	};

}