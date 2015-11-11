if(country.localeCompare("USD") == 0){
	ref = new Firebase("https://2015usd.firebaseio.com/");
}
else{
	ref = new Firebase("https://2015gbp3.firebaseio.com/");
}

var flag2015 = 1, flag2014 = 1;
dayInformation[country] = [];
ref.on("value", function(snapshot) {
		dayInformation[country]['2015'] = [];
		snapshot.forEach(function(childsnapshot){
			dayInformation[country]['2015'].push(childsnapshot.val());
			 //day.push(childsnapshot.key());
			 flag2015 = 0;
		});
		/*
		for(var i=0; i<dayInformation['USD']['2015'].length; i=i+7){
			month_list.push(dayInformation['USD']['2015'][i][0]);
			month_cash_rate_buying_min = Math.min(month_cash_rate_buying_min, dayInformation['USD']['2015'][i][0].rate.cash_rate_buying);
			month_cash_rate_buying_max = Math.max(month_cash_rate_buying_max, dayInformation['USD']['2015'][i][0].rate.cash_rate_buying);
		}*/
		//console.log("OK");
	  });
if(country.localeCompare("USD") == 0){	  
	ref = new Firebase("https://2014-usd.firebaseio.com/");
}
else{
	ref = new Firebase("https://2014gbp.firebaseio.com/");
}

ref.on("value", function(snapshot) {
		dayInformation[country]['2014'] = [];
		snapshot.forEach(function(childsnapshot){
			dayInformation[country]['2014'].push(childsnapshot.val());
			 //day.push(childsnapshot.key());
			 flag2014 = 0;
		});
		while(flag2014||flag2015){};
		year[1] = [] , min_rate[1] = 10000, max_rate[1] = 0;
		year[2] = [] , min_rate[2] = 10000, max_rate[2] = 0;
		for(var i=0; i<dayInformation[country]['2014'].length; i=i+6){
			year[2].push(dayInformation[country]['2014'][i][0]);		
			min_rate[2] = Math.min(min_rate[2], dayInformation[country]['2014'][i][0].rate.cash_rate_buying);
			max_rate[2] = Math.max(max_rate[2], dayInformation[country]['2014'][i][0].rate.cash_rate_buying);
			length++;
		}
		for(var i=0; i<dayInformation[country]['2015'].length; i=i+6){
			year[1].push(dayInformation[country]['2015'][i][0]);
			year[2].push(dayInformation[country]['2015'][i][0]);
			//year.push(dayInformation['USD']['2015'][i][0]);
			min_rate[2] = Math.min(min_rate[2], dayInformation[country]['2015'][i][0].rate.cash_rate_buying);
			max_rate[2] = Math.max(max_rate[2], dayInformation[country]['2015'][i][0].rate.cash_rate_buying);
			min_rate[1] = Math.min(min_rate[1], dayInformation[country]['2015'][i][0].rate.cash_rate_buying);
			max_rate[1] = Math.max(max_rate[1], dayInformation[country]['2015'][i][0].rate.cash_rate_buying);
		}
		console.log("OK");
	  });