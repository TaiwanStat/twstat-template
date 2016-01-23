var youbikeMarkers = L.markerClusterGroup();

function markYoubike() {
	$("#loading").addClass("active");
	console.log('markYoubike start');
	var youbikeUrl = 'http://andylee.azurewebsites.net/taipei1.php?type=youbike&data=';

	$.getJSON(youbikeUrl, function(d) {
		var youbikeObjs = d["retVal"];

		for (var index in youbikeObjs) {
			var objs = youbikeObjs[index];
			var m = L.marker([objs['lat'], objs['lng']]);
			m.bindPopup("場站名稱: " + objs['sna'] + "<br>Station List: " + objs['snaen'] +
				"<br>場站總停車格: " + objs['tot'] + "<br>場站目前車輛數量: " + objs['sbi'] + 
				"<br>地址: " + objs['ar'] + "<br>空位數量: " + objs['bemp'] + 
				((objs['act'] == "0") ? '<br><span style="color: red;">暫停營運</span>' : ''));

			youbikeMarkers.addLayer(m);
		}

		map.addLayer(youbikeMarkers);
		$("#loading").removeClass("active");
		markerOn = true;
		console.log('markYoubike finished');
	});
}
