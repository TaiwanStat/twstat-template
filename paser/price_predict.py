# coding=UTF-8
import datetime
import requests
#f = Firebase('https://oildata2.firebaseio.com/datas')
res = requests.get("http://www.taiwanoil.org/")
source =  res.text

tmp1 = source.split("</td></tr>")
nextweek_price = [] 
for col in tmp1 :
	if "<td style='text-align:right;'>" in col : 
		tmp2 = col.split("<td style='text-align:right;'>",-1)[-1]
		nextweek_price[len(nextweek_price):] = [tmp2]

nextweek_98 = nextweek_price[1]
nextweek_95 = nextweek_price[2]
nextweek_92 = nextweek_price[3]
nextweek_ultra = nextweek_price[4]

#print "--- next week ---"
print "98 : " + nextweek_98 
print "95 : " + nextweek_95
print "92 : " + nextweek_92
print "ultra : " + nextweek_ultra
 
