var map;
var markerOn = false;
getLocation();

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

function deleteMarkers(markers) {
	markers.eachLayer(function (layer) {
		markers.removeLayer(layer);
	});
}

function checkboxCtrl(checkboxes) {
	checkboxes[0].checkbox({
		// youbike
		onChecked: function() {
			console.log("1 c");
			deleteMarkers(busMarkers);
			markYoubike();
		},
		onUnchecked: function() {
			console.log("1 u");
			if (markerOn) {
				deleteMarkers(youbikeMarkers);
				markerOn = false;
			}
		}
	});

	checkboxes[1].checkbox({
		// mrt
		onChecked: function() {
			console.log("2 c");
			deleteMarkers(youbikeMarkers);
			deleteMarkers(busMarkers);
		},
		onUnchecked: function() {
			console.log("2 u");
			if (markerOn) {
				markerOn = false;
			}
		}
	});

	checkboxes[2].checkbox({
		// bus
		onChecked: function() {
			console.log("3 c");
			deleteMarkers(youbikeMarkers);
			if (busMarkersLoaded) {
				busMarkAll();
			}
			else {
				loadStop();
			}
			
		},
		onUnchecked: function() {
			console.log("3 u");
			if (markerOn) {
				deleteMarkers(busMarkers);
				markerOn = false;
			}
		}
	});

	checkboxes[3].checkbox({
		// parking
		onChecked: function() {
			console.log("4 c");
			deleteMarkers(youbikeMarkers);
			deleteMarkers(busMarkers);
		},
		onUnchecked: function() {
			console.log("4 u");
			if (markerOn) {
				markerOn = false;
			}
		}
	});
}

// 現在loading只有在load data才會出現
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