var map;
var busMarkers = L.markerClusterGroup();
var busMarkersLoaded = false;
getLocation();
var wifi = new Array("1", "12", "15", "21", "22", "72", "74", "63", "72", "74", "202", "203", "207", "208",
"212", "214", "220", "223", "263", "266", "270", "277", "278", "280", "282", "284", "285", "287", "292", "304",
"307", "311", "518", "556", "601", "611", "620", "630", "645", "671", "685", "756", "902", "905", "912", "935",
"936", "937", "938", "212直", "645副", "中山幹線", "市民小巴10", "忠孝新幹線", "信義新幹線", "紅10", "紅2",
"紅30", "紅31", "紅32", "紅50", "紅7", "重慶新幹線", "棕1", "棕9", "綠1", "藍25");
var data = {};

function loadStop() {
	$("#loading").addClass("active");
	console.log('loadStop started');
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
	console.log('estTime started');
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
		console.log('estTime finished');
		busname();
	});
}

function busname() {
	var routeURL = "http://andy.emath.tw/taipei.php?data=ROUTE";
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
	console.log('busMarkAll finished');
}

function deleteBusMarkers() {
	busMarkers.eachLayer(function (layer) {
		busMarkers.removeLayer(layer);
	});
	$("#loading").removeClass("active");
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

function checkboxCtrl(checkboxes) {
	checkboxes[0].checkbox({
		// youbike
		onChecked: function() {
			deleteBusMarkers();
		},
		onUnchecked: function() {

		}
	});

	checkboxes[1].checkbox({
		// mrt
		onChecked: function() {

			deleteBusMarkers();
		},
		onUnchecked: function() {

		}
	});

	checkboxes[2].checkbox({
		// bus
		onChecked: function() {
			if (busMarkersLoaded) {
				$("#loading").addClass("active");
				busMarkAll();
			}
			else {
				loadStop();
			}
			
		},
		onUnchecked: function() {

			deleteBusMarkers();
		}
	});

	checkboxes[3].checkbox({
		// parking
		onChecked: function() {

			deleteBusMarkers();
		},
		onUnchecked: function() {

		}
	});
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

	var checkboxes = [];
	$('.ui.checkbox').each(function() {
		checkboxes.push($(this));
	});
	checkboxCtrl(checkboxes);
}