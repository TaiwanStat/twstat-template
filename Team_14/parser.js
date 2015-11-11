var Firebase = require("firebase");
var request = require("request");
var fs = require("fs");
var cheerio = require("cheerio");
var myFirebaseRef = new Firebase("https://2014gbp.firebaseio.com/");

for(var j = 20141100; j <= 20141200; j=j+100){
for(var i = 1; i<=31; i++){
var website = "http://rate.bot.com.tw/Pages/UIP004/UIP00421.aspx?lang=zh-TW&whom1=GBP&whom2=&entity=1&date="+parseInt(i+j)+"&year=2014&month=01&term=7&afterOrNot=0&view=1"; //英鎊
//var website = "http://rate.bot.com.tw/Pages/UIP004/UIP00421.aspx?lang=zh-TW&whom1=USD&whom2=&entity=1&date="+parseInt(i+j)+"&year=2014&month=01&term=7&afterOrNot=0&view=1";//美金
//console.log(parseInt(i+j));
parsingData(website,i+j);
}
}

/*myFirebaseRef.child('20090122/0/rate/cash_rate_buying').on("value", function(snapshot) {
  console.log(snapshot.val());  // Alerts "San Francisco"
});

var ref = new Firebase("https://exchangeratetwtousa.firebaseio.com/20090122/0/rate/cash_rate_buying");
ref.on("value", function(snapshot) {
  console.log(snapshot.val());
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});*/ //取得value的方法

function parsingData(website,num){
request({
	url: website,
    method: "GET"
}, function(e,r,b) {
    if(e || !b) { 
	console.log("ERROR");
	return; }
    var $ = cheerio.load(b);
    var result = "";
	var date = $("td.title");
    var money = $("td.decimal");
	var jsonArg = new Object();
	
	if((num%10000) >= 1000){
		var year = num.toString().substr(0,4)+","+Math.round((num%10000/100)).toString()+","+num.toString().substr(6,8);
	}
	else{
		var year = num.toString().substr(0,4)+",0"+Math.round((num%10000/100)).toString()+","+num.toString().substr(6,8);
	}
	//console.log(year);
	if(money.length != 0){
    for(var i=0;i<money.length;i = i+4) {
		if(i == 0){
			result = '{"'+year+'":[';
		}
		result = result + "{"
				+'"time":"'+year+','+$(date[i/2]).text().substring(12,20)+'","rate":{'
				+'"cash_rate_buying":'+$(money[i]).text()
				+',"cash_rate_selling":'+$(money[i+1]).text()
				+',"spot_rate_buying":'+$(money[i+2]).text()
				+',"spot_rate_selling":'+$(money[i+3]).text();
		if(i != money.length-4){
				result = result + '}},';
		}
		else{
				result = result + '}}]}';
		}
	}
	var jsonArray = JSON.parse(result);
	//var start = new Date().getTime();
    //while (new Date().getTime() < start + 500);
	var myFirebaseRef_ = myFirebaseRef.update(jsonArray,function(error) {
		if (error) {
			console.log('Synchronization failed');
		} else {
			console.log('Synchronization succeeded');
		}
		}
	);
	
	}
});
}