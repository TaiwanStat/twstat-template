var parkMarkers = L.markerClusterGroup();
var parkMarkersLoaded = false;
var AVAILABLEdata = {};

function parkingAVAILABLE() {
	$("#loading").addClass("active");
	console.log('markParking start');
	var parkUrl = 'http://andylee.azurewebsites.net/taipei1.php?type=tcmsv&data=allavailable';

	// $.getJSON(parkUrl, function(d) {
	// 	console.log('yoy');
	// 	AVAILABLEdata = d.data.park;
	// 	console.log(AVAILABLEdata.length);
	// 	markParking();
	// });	

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
			for(parkId=0; parkId<AVAILABLEdata.length; parkId++){
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
			else if(objs.Entrancecoord == undefined && parkId < AVAILABLEdata.length){
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


function twd97_to_latlng($x, $y) {
  var pow = Math.pow, M_PI = Math.PI;
  var sin = Math.sin, cos = Math.cos, tan = Math.tan;
  var $a = 6378137.0, $b = 6356752.314245;
  var $lng0 = 121 * M_PI / 180, $k0 = 0.9999, $dx = 250000, $dy = 0;
  var $e = pow((1 - pow($b, 2) / pow($a, 2)), 0.5);

  $x -= $dx;
  $y -= $dy;

  var $M = $y / $k0;

  var $mu = $M / ($a * (1.0 - pow($e, 2) / 4.0 - 3 * pow($e, 4) / 64.0 - 5 * pow($e, 6) / 256.0));
  var $e1 = (1.0 - pow((1.0 - pow($e, 2)), 0.5)) / (1.0 + pow((1.0 - pow($e, 2)), 0.5));

  var $J1 = (3 * $e1 / 2 - 27 * pow($e1, 3) / 32.0);
  var $J2 = (21 * pow($e1, 2) / 16 - 55 * pow($e1, 4) / 32.0);
  var $J3 = (151 * pow($e1, 3) / 96.0);
  var $J4 = (1097 * pow($e1, 4) / 512.0);

  var $fp = $mu + $J1 * sin(2 * $mu) + $J2 * sin(4 * $mu) + $J3 * sin(6 * $mu) + $J4 * sin(8 * $mu);

  var $e2 = pow(($e * $a / $b), 2);
  var $C1 = pow($e2 * cos($fp), 2);
  var $T1 = pow(tan($fp), 2);
  var $R1 = $a * (1 - pow($e, 2)) / pow((1 - pow($e, 2) * pow(sin($fp), 2)), (3.0 / 2.0));
  var $N1 = $a / pow((1 - pow($e, 2) * pow(sin($fp), 2)), 0.5);

  var $D = $x / ($N1 * $k0);

  var $Q1 = $N1 * tan($fp) / $R1;
  var $Q2 = (pow($D, 2) / 2.0);
  var $Q3 = (5 + 3 * $T1 + 10 * $C1 - 4 * pow($C1, 2) - 9 * $e2) * pow($D, 4) / 24.0;
  var $Q4 = (61 + 90 * $T1 + 298 * $C1 + 45 * pow($T1, 2) - 3 * pow($C1, 2) - 252 * $e2) * pow($D, 6) / 720.0;
  var $lat = $fp - $Q1 * ($Q2 - $Q3 + $Q4);

  var $Q5 = $D;
  var $Q6 = (1 + 2 * $T1 + $C1) * pow($D, 3) / 6;
  var $Q7 = (5 - 2 * $C1 + 28 * $T1 - 3 * pow($C1, 2) + 8 * $e2 + 24 * pow($T1, 2)) * pow($D, 5) / 120.0;
  var $lng = $lng0 + ($Q5 - $Q6 + $Q7) / cos($fp);

  $lat = ($lat * 180) / M_PI;
  $lng = ($lng * 180) / M_PI;

  return {
    lat: $lat,
    lng: $lng
  };
}
