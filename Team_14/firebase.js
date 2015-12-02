function Catch_Firebase(){
	var ref = new Firebase("https://2015tous.firebaseio.com/");
	
	var json = [];
	ref.on("value", function(snapshot) {
		snapshot.forEach(function(childsnapshot){
			json.push(childsnapshot.val());
		});
		
		console.log("firebase");
		
	});
	return json;
}

