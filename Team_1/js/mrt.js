var mrtMarkers = L.markerClusterGroup();
var mrtMarkersLoaded = false;
var AVAILABLEdata = {};

function markMrt() {
	$("#loading").addClass("active");
	console.log('markParking start');
	var parkUrl = 'http://andylee.azurewebsites.net/taipei1.php?type=mrt&data=entrance';

	$.getJSON(parkUrl, function(d) {
		//console.log(d.result.results);
		var mrtObjs = d.result.results;

		for (var index in mrtObjs) {
			var objs = mrtObjs[index];
			coord = twd97_to_latlng(objs['坐標X(TWD97)'], objs['坐標Y(TWD97)']);
			var m = L.marker([coord['lat'], coord['lng']]);
			m.bindPopup("入口名稱: " + objs['出入口名稱'] + "<br>出入口編號: " + objs['出入口編號']);

			mrtMarkers.addLayer(m);
		}

		map.addLayer(mrtMarkers);

		$("#loading").removeClass("active");
		mrtMarkersLoaded = true;
		markerOn = true;
		console.log('markParking finished');
	});
}
