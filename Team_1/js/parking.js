var parkMarkers = L.markerClusterGroup();
var parkMarkersLoaded = false;
var AVAILABLEdata = {};

function parkingAVAILABLE() {
	$("#loading").addClass("active");
	console.log('markParking start');
	var parkUrl = 'http://andylee.azurewebsites.net/taipei1.php?type=tcmsv&data=allavailable';

	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			// "id":"336	"<-error occured, so remove tab after 336
			cleanJSON = xmlhttp.responseText.replace(/\t/g, "\\t");
	    	AVAILABLEdata = JSON.parse(cleanJSON).data.park;
	    	markParking();
	    }
	};

	xmlhttp.open("GET", parkUrl, true);
	xmlhttp.send();
}

function markParking() {
	$("#loading").addClass("active");
	console.log('markParking start');
	var parkUrl = 'http://andylee.azurewebsites.net/taipei1.php?type=tcmsv&data=alldesc';

	$.getJSON(parkUrl, function(d) {
		var parkObjs = d.data.park;
		
		for (var index=0; index<parkObjs.length; index++) {
			var objs = parkObjs[index];
			var parkId = -1;
			for(parkId=0; parkId<AVAILABLEdata.length; parkId++) {
				if(AVAILABLEdata[parkId].id == objs.id) break;
			}

			if(objs.Entrancecoord != undefined && parkId < AVAILABLEdata.length){
				var entrance = objs.Entrancecoord.EntrancecoordInfo;
				for(var i=0; i<entrance.length; i++){
					var m = L.marker([entrance[i].Xcod, entrance[i].Ycod]);
					m.bindPopup("停車場名稱: " + objs['name'] + 
						"<br>停車場概況: " + objs['summary'] +
						"<br>收費資訊:<br>  " + objs['payex'] + 
						((AVAILABLEdata[parkId]["availablecar"] != "-9") ? ("<br>目前剩餘汽車位數: " + AVAILABLEdata[parkId].availablecar) : '') + 
						((AVAILABLEdata[parkId]["availablemotor"] != "-9") ? ("<br>目前剩餘機車位數: " + AVAILABLEdata[parkId].availablemotor) : ''));

					parkMarkers.addLayer(m);
				}
			}
			else if(objs.Entrancecoord == undefined && parkId < AVAILABLEdata.length) {
				coord = twd97_to_latlng(objs.tw97x, objs.tw97x);
				var m = L.marker([coord['lat'], coord['lng']]);
				m.bindPopup("停車場名稱: " + objs['name'] + 
					"<br>停車場概況: " + objs['summary'] +
					"<br>收費資訊:<br>  " + objs['payex'] + 
					((AVAILABLEdata[parkId]["availablecar"] != "-9") ? ("<br>目前剩餘汽車位數: " + AVAILABLEdata[parkId].availablecar) : '') + 
					((AVAILABLEdata[parkId]["availablemotor"] != "-9") ? ("<br>目前剩餘機車位數: " + AVAILABLEdata[parkId].availablemotor) : ''));

				parkMarkers.addLayer(m);
			}
		}
		map.addLayer(parkMarkers);
		
		$("#loading").removeClass("active");
		parkMarkersLoaded = true;
		markerOn = true;
		console.log('markParking finished');
	});
}