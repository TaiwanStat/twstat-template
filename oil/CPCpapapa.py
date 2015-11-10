# coding=UTF-8
import datetime
import requests
file = open('output.txt', 'w')
res = requests.get("http://new.cpc.com.tw/division/mb/oil-more1-1.aspx")
source =  res.text
tmp1 = source.split('<td width="9%">')
ninetwo = tmp1[2].split('</td>')
ninefive = tmp1[4].split('</td>')
nineeight = tmp1[6].split('</td>')
ultra = tmp1[10].split('</td>')
ninetwoP = ninetwo[0]
ninefiveP = ninefive[0]
nineeightP = nineeight[0]
ultraP = ultra[0]
tmp2 = source.split('<span>')
d1 = tmp2[5]
d2 = tmp2[6]
d3 = tmp2[7]
year = d1.split('</span>')
month = d2.split('</span>')
day = d3.split('</span>')
newdate = datetime.datetime(int(year[0]), int(month[0]), int(day[0]))
date = newdate.strftime("%Y-%m-%d")
file.write('ref.push({\n')
file.write('\tdate:"'+date+'",\n')
file.write('\tninetwo: '+ninetwoP+',\n')
file.write('\tninefive: '+ninefiveP+',\n')
file.write('\tnineeight: '+nineeightP+',\n')
file.write('\tultra: '+ultraP+',\n')
file.write('\ttype: 0\n});\n')
file.close()
