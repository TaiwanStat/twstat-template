var map = L.map('map').setView([25.047238, 121.516777], 17);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6IjZjNmRjNzk3ZmE2MTcwOTEwMGY0MzU3YjUzOWFmNWZhIn0.Y8bhBaUMqFiPrDRW9hieoQ', {
	maxZoom: 22,
	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
		'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
		'Imagery © <a href="http://mapbox.com">Mapbox</a>',
	id: 'mapbox.streets'
}).addTo(map);

var data = {};

var stopURL = "http://andy.emath.tw/taipei.php?data=Stop";
$.getJSON(stopURL, function(d) {
	var stopArr = d.BusInfo;
	//var markers = L.markerClusterGroup();

	for (var i = 0; i < stopArr.length; i++) {
		var stopId = stopArr[i].Id;
		var nameZh = stopArr[i].nameZh;
		var nameEn = stopArr[i].nameEn;
		var lon = parseFloat(stopArr[i].longitude);
		var lat = parseFloat(stopArr[i].latitude);

		data[stopId] = {nameZh: nameZh, nameEn: nameEn, 
						lon: lon, lat: lat};

	/*	
		var m = L.marker([lat, lon]);
		m.bindPopup("站名: " + nameZh + '<br>Stop: ' + nameEn);
		markers.addLayer(m);
	*/	
	}
	console.log('first finished');
	estTimeFunc();
	//map.addLayer(markers);
});

function estTimeFunc() {
	console.log('sec');
	var estimateTimeURL = "http://andy.emath.tw/taipei.php?data=EstiamteTime";
	$.getJSON(estimateTimeURL, function(d) {
		var arr = d.BusInfo;

		for (var i = 0; i < arr.length; i++) {
			var stopId = arr[i].StopID;
			var routeID = arr[i].RouteID;
			var estTime = arr[i].EstimateTime;
			//var goBack = arr[i].GoBack;

			if ((typeof data[stopId]) != 'undefined') {
				data[stopId]['EstimateTime'] = estTimeTransfer(estTime);
				data[stopId]['RouteID'] = routeID;
			}

		}
		console.log('sec finished');
		markAll();
	});
}


function markAll() {
	console.log('mark');

	var markers = L.markerClusterGroup();

	for (var stop in data) {
		var stopObj = data[stop];
		var m = L.marker([stopObj.lat, stopObj['lon']]);
		m.bindPopup("站名: " + stopObj['nameZh'] + '<br>Stop: ' + stopObj['nameEn'] +
			"<br>RouteID: " + stopObj['RouteID'] + "<br>預估時間: " + stopObj['EstimateTime']);
		markers.addLayer(m);	
	}
	map.addLayer(markers);
	console.log('mark finished');
}

function estTimeTransfer(x) {
	/*console.log(x);
	console.log(typeof x)*/
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

	if (min < 60)
		return min + '分' + sec + '秒';
	else {
		var min2 = min % 60;
		var hour = (min - min2) / 60;
		return hour + '小時' + min2 + '分' + sec + '秒';
	}
}