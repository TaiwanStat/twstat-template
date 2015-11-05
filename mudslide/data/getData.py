import urllib2

url = "http://opendata.epa.gov.tw/ws/Data/RainTenMin/?format=json"
content = urllib2.urlopen(url)
data = content.read()
fout = open("rain.json", "w")
fout.write(data)
