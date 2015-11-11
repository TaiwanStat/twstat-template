from firebase import Firebase
f = Firebase('https://radiant-fire-7063.firebaseio.com/test')
r = f.push({'date':'2015-11-09','WTI':43.870,'Dubai':44.370,'Brent':47.830,'type':1})
##{'date':'2015-11-09','WTI':'43.870','Dubai':'44.370','Brent':'47.830','type':'1'}