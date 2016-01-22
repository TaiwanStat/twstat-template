var busMarkers = L.markerClusterGroup();
var busMarkersLoaded = false;
var wifi = new Array("1", "12", "15", "21", "22", "72", "74", "63", "72", "74", "202", "203", "207", "208",
"212", "214", "220", "223", "263", "266", "270", "277", "278", "280", "282", "284", "285", "287", "292", "304",
"307", "311", "518", "556", "601", "611", "620", "630", "645", "671", "685", "756", "902", "905", "912", "935",
"936", "937", "938", "212直", "645副", "中山幹線", "市民小巴10", "忠孝新幹線", "信義新幹線", "紅10", "紅2",
"紅30", "紅31", "紅32", "紅50", "紅7", "重慶新幹線", "棕1", "棕9", "綠1", "藍25");
var data = {};

function loadStop() {
	$("#loading").addClass("active");
	console.log('loadStop started');
	var stopURL = 'http://andylee.azurewebsites.net/taipei1.php?type=bus&data=Stop';
	$.getJSON(stopURL, function(d) {
		var stopArr = d.BusInfo;

		for (var i = 0; i < stopArr.length; i++) {
			var stopId = stopArr[i].Id;
			var nameZh = stopArr[i].nameZh;
			var nameEn = stopArr[i].nameEn;
			var lon = parseFloat(stopArr[i].longitude);
			var lat = parseFloat(stopArr[i].latitude);

			// prevent incorrect points
			if (lat < 24.813281 || lat > 25.299873)
				continue;
			if (lon < 121.281991 || lon > 122.012727)
				continue;

			data[stopId] = {nameZh: nameZh, nameEn: nameEn,
							lon: lon, lat: lat};
		}
		console.log('loadStop finished');
		estTimeFunc();
	});
}

function estTimeFunc() {
	console.log('estTime started');
	var estimateTimeURL = 'http://andylee.azurewebsites.net/taipei1.php?type=bus&data=EstiamteTime';
	$.getJSON(estimateTimeURL, function(d) {
		var arr = d.BusInfo;

		for (var i = 0; i < arr.length; i++) {
			var stopId = arr[i].StopID;
			var routeID = arr[i].RouteID;
			var estTime = arr[i].EstimateTime;

			if ((typeof data[stopId]) != 'undefined') {
				data[stopId]['EstimateTime'] = estTimeTransfer(estTime);
				data[stopId]['RouteID'] = routeID;
			}

		}
		console.log('estTime finished');
		busname();
	});
}

function busname() {
	var routeURL = "http://andylee.azurewebsites.net/taipei1.php?type=bus&data=ROUTE";
	$.getJSON(routeURL, function(d) {
		var arr = d.BusInfo;

		for (var i = 0; i < arr.length; i++) {
			var routeID = arr[i].Id;
			var nameZh = arr[i].nameZh;
			var roadMapUrl = arr[i].roadMapUrl

			for(var stop in data){
				if (data[stop]['RouteID'] == routeID) {
					data[stop]['busnameZh'] = nameZh;
					data[stop]['roadMapUrl'] = roadMapUrl;
				}
			}
		}
		buswifi();
	});
}

function buswifi() {
	for(var stop in data){
		for (var i = 0; i < wifi.length; i++) {
			if (data[stop]['busnameZh'] == wifi[i]) {
				data[stop]['wifi'] = true;
			}
		}
	}
	busMarkAll();
}

function busMarkAll() {
	console.log('busMarkAll started');

	for (var stop in data) {
		var stopObj = data[stop];
		var m = L.marker([stopObj['lat'], stopObj['lon']]);
		if (stopObj['wifi'] == true) {
			m.bindPopup("站名: " + stopObj['nameZh'] + '<br>Stop: ' + stopObj['nameEn'] +
			"<br>公車名稱: <a href=" + stopObj['roadMapUrl'] + " target='_new'>" + stopObj['busnameZh'] + "</a>" +
			"<i class='material-icons'>wifi</i>" + "<br>預估等待時間: " + stopObj['EstimateTime']);
		}
		else {
			m.bindPopup("站名: " + stopObj['nameZh'] + '<br>Stop: ' + stopObj['nameEn'] +
			"<br>公車名稱: <a href=" + stopObj['roadMapUrl'] + " target='_new'>" + stopObj['busnameZh'] + "</a>" +
			"<br>預估等待時間: " + stopObj['EstimateTime']);
		}
		busMarkers.addLayer(m);
	}
	map.addLayer(busMarkers);

	$("#loading").removeClass("active");
	busMarkersLoaded = true;
	markerOn = true;
	console.log('busMarkAll finished');
}

function estTimeTransfer(x) {
	switch(x) {
	    case '-1':
	        return "尚未發車";
	    case '-2':
	        return "交管不停靠";
	    case '-3':
	        return "末班車已過";
	    case '-4':
	    	return "今日未營運";
	    default:
	    	var s = parseInt(x);
	    	return timeFunc(s);
	}
}

function timeFunc(t) {
	var sec = t % 60;
	var min = (t - sec) / 60;

	if (min == 0)
		return sec + '秒';
	else if (min < 60)
		return min + '分' + sec + '秒';
	else {
		var min2 = min % 60;
		var hour = (min - min2) / 60;
		return hour + '小時' + min2 + '分' + sec + '秒';
	}
}