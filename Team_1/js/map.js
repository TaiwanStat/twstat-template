var map = L.map('map').setView([25.047238, 121.516777], 18);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6IjZjNmRjNzk3ZmE2MTcwOTEwMGY0MzU3YjUzOWFmNWZhIn0.Y8bhBaUMqFiPrDRW9hieoQ', {
	maxZoom: 18,
	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
		'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
		'Imagery © <a href="http://mapbox.com">Mapbox</a>',
	id: 'mapbox.streets'
}).addTo(map);


var stopURL = "http://andy.emath.tw/taipei.php?data=Stop";

$.getJSON(stopURL, function(d) {
	var stopArr = d.BusInfo;
	var markers = L.markerClusterGroup();

	for (var i = 0; i < stopArr.length; i++) {
		var stopId = stopArr[i].Id;
		var nameZh = stopArr[i].nameZh;
		var nameEn = stopArr[i].nameEn;
		var lon = parseFloat(stopArr[i].longitude);
		var lat = parseFloat(stopArr[i].latitude);
		
		var m = L.marker([lat, lon]);
		m.bindPopup("站名: " + nameZh + '<br>Stop: ' + nameEn);
		markers.addLayer(m);
		
	}

	map.addLayer(markers);
});
