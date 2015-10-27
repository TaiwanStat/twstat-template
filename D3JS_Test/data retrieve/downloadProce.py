import urllib2

def loadAllContent (yy, mm, dd) :
	try :
		headers = {
			'User-Agent':'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.1.6) Gecko/20091201 Firefox/3.5.6'
		}
		req = urllib2.Request(
			url = 'http://edbkcg.kcg.gov.tw/prices/market.qd1.php',
			headers = headers,
			data = 'tclassSel=0%A5%FE%B3%A1%B8%EA%AE%C6&yy=' + str(yy) + '&mm=' + str(mm) + '&dd=' + str(dd) + '&subm=%B6%7D%A9l%ACd%B8%DF'
		)
		return urllib2.urlopen(req).read()
	except:
		return None

content = loadAllContent(104, 10, 22).decode('big5').encode('utf-8')

it = re.finditer('<TD ', content)
for match in it:
	print match.group()