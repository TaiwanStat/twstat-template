var Firebase = require("firebase");
var request = require("request");
var fs = require("fs");
var cheerio = require("cheerio");
var myFirebaseRef = new Firebase("https://rate-in-time.firebaseio.com/");

var day = '20151111';
var website = "http://rate.bot.com.tw/Pages/UIP004/UIP00421.aspx?lang=zh-TW&whom1=USD&whom2=&entity=1&date="+day+"&year=2010&month=01&term=7&afterOrNot=0&view=1";
parsingData(website,day,'USD');
website = "http://rate.bot.com.tw/Pages/UIP004/UIP00421.aspx?lang=zh-TW&whom1=HKD&whom2=&entity=1&date="+day+"&year=2010&month=01&term=7&afterOrNot=0&view=1";
parsingData(website,day,'HKD');
website = "http://rate.bot.com.tw/Pages/UIP004/UIP00421.aspx?lang=zh-TW&whom1=GBP&whom2=&entity=1&date="+day+"&year=2010&month=01&term=7&afterOrNot=0&view=1";
parsingData(website,day,'GBP');
website = "http://rate.bot.com.tw/Pages/UIP004/UIP00421.aspx?lang=zh-TW&whom1=AUD&whom2=&entity=1&date="+day+"&year=2010&month=01&term=7&afterOrNot=0&view=1";
parsingData(website,day,'AUD');
website = "http://rate.bot.com.tw/Pages/UIP004/UIP00421.aspx?lang=zh-TW&whom1=CAD&whom2=&entity=1&date="+day+"&year=2010&month=01&term=7&afterOrNot=0&view=1";
parsingData(website,day,'CAD');
website = "http://rate.bot.com.tw/Pages/UIP004/UIP00421.aspx?lang=zh-TW&whom1=JPY&whom2=&entity=1&date="+day+"&year=2010&month=01&term=7&afterOrNot=0&view=1";
parsingData(website,day,'JPY');
website = "http://rate.bot.com.tw/Pages/UIP004/UIP00421.aspx?lang=zh-TW&whom1=CNY&whom2=&entity=1&date="+day+"&year=2010&month=01&term=7&afterOrNot=0&view=1";
parsingData(website,day,'CNY');
website = "http://rate.bot.com.tw/Pages/UIP004/UIP00421.aspx?lang=zh-TW&whom1=EUR&whom2=&entity=1&date="+day+"&year=2010&month=01&term=7&afterOrNot=0&view=1";
parsingData(website,day,'EUR');

function parsingData(website,num,country){
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
	
	var year = num.toString().substr(0,4)+","+Math.round((num%10000/100)).toString()+","+num.toString().substr(6,8);
	//console.log(year);
	if(money.length != 0){
    for(var i=0;i<money.length;i = i+4) {
		if(i == 0){
			result = '{"'+country+'":[';
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