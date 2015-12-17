import requests
res = requests.get("http://new.cpc.com.tw/division/mb/oil-more4.aspx")
# result is in res.text
source  = res.text
f = Firebase('https://oildata2.firebaseio.com/datas')
tmp1 = source.split('<span id="Showtd">')
tmp2 = tmp1[1].split("</span>")
tmp3 = tmp2[0].split("<tr>")
for i in range(1,len(tmp3)) :
	tmp4 = tmp3[i].split('<td width="7%">')
	date_tmp = tmp4[0].split("<td>")[1].split("</td>")[0]
	date_list = date_tmp.split("/")
	date = date_list[0] + "-" + date_list[1] + "-" + date_list[2] 
	ninetwo = tmp4[1].split("</td>")[0]
	ninefive = tmp4[2].split("</td>")[0]
	nineeight = tmp4[3].split("</td>")[0]
	ultra = tmp4[4].split("</td>")[0]
	r = f.push({'date':date,'ninetwo':float(ninetwo),'ninefive':float(ninefive),'nineeight':float(nineeight),'ultra':float(ultra),'type':0})

	print date + ": " + ninetwo + " " + ninefive + " " + nineeight + " " + ultra
		

	


