var map;
getLocation();

var data = {};

function loadStop() {
	var stopURL = "http://andy.emath.tw/taipei.php?data=Stop";
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
	console.log('sec');
	var estimateTimeURL = "http://andy.emath.tw/taipei.php?data=EstiamteTime";
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
		console.log('sec finished');
		markAll();
	});
}


function markAll() {
	console.log('mark start');

	var markers = L.markerClusterGroup();

	for (var stop in data) {
		var stopObj = data[stop];
		var m = L.marker([stopObj['lat'], stopObj['lon']]);
		m.bindPopup("站名: " + stopObj['nameZh'] + '<br>Stop: ' + stopObj['nameEn'] +
			"<br>路線編號: " + stopObj['RouteID'] + "<br>預估等待時間: " + stopObj['EstimateTime']);
		markers.addLayer(m);	
	}
	map.addLayer(markers);
	$("#loading").removeClass("active");
	console.log('mark finished');
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

function init() {

}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (p) {
        	var lat = p.coords.latitude;
        	var lon = p.coords.longitude;

			// not in Taipei
			if (lat < 24.813281 || lat > 25.299873 || lon < 121.281991 || lon > 122.012727) {
				document.getElementById("info").innerHTML = "<h5 style='color: red;' align='middle'>安安你不在台北</h5>";
				init(25.047238, 121.516777);
			}
			else
        		init(p.coords.latitude, p.coords.longitude);
        });
    } 
    else {
        alert("Geolocation is not supported by this browser.");
        init(25.047238, 121.516777);
    }
}

function init(lat, lon) {
	map = L.map('map').setView([lat, lon], 17);

	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6IjZjNmRjNzk3ZmE2MTcwOTEwMGY0MzU3YjUzOWFmNWZhIn0.Y8bhBaUMqFiPrDRW9hieoQ', {
		maxZoom: 22,
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
			'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="http://mapbox.com">Mapbox</a>',
		id: 'mapbox.streets'
	}).addTo(map);

	loadStop();
}