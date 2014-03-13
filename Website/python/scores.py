#!C:\Python33\python.exe -u
#!/usr/bin/env python

import sys, getopt, json, sha
import curl
import xml.etree.ElementTree as ET
import time
import firebase, calendar, drivers, profiles
from datetime import datetime, timedelta

firebase_url = "https://neskola.firebaseio.com"
operation = 0
fb = ''

def main(argv):	
	global operation, fb;

	try:
		opts, args = getopt.getopt(argv,"hcru:", ["user=", "gp=", "gr=", "qr=", "fl=", "fb="])
	except getopt.GetoptError:
		print ("scores.py -c -u|--user <user name> -g|--gp <gp_id>")
		sys.exit(2)
	for opt, arg in opts:
		if opt == '-h':
			print ("profiles.py -[a|r] [x] -u|--user <user name> -p|--password <password> -e|--email <email>")
			sys.exit()
		if opt == '-c':
			print ("Check bet values.")			
			operation = 1
		if opt == '-r':
			print ("Push results.")			
			operation = 2
		if opt in ("-u", "--user"):			
			user_id = arg
		else: 
			user_id = ''
		if opt in ("--gp"):
			gp_id = arg		
		if opt in ("--gr"):
			gresults = arg
		if opt in ("--qr"):
			qresults = arg
		if opt in ("--fl"):
			fastest = arg
		if opt in ("--fb"):
			fb = arg

		#else: 
		#	gp_id = ''

	if not fb:
		print ("No target firebase defined!!!!")
		sys.exit()     
	else:
		firebase_url = "https://" + fb + ".firebaseio.com"
		print "Target firebase is " + firebase_url


	print (operation)

	if (operation == 1):
		checkBetvalues(gp_id, user_id)
	elif (operation == 2):
		pushResults(gp_id, gresults, qresults, fastest)

def checkBetvalues(gp_id, user_id):
	gpdata = calendar.getCalendarData(firebase_url, "2014", gp_id)
	userlist = profiles.getUserData(user_id)
	
	print ("Checking bet values for gp = " + gp_id)						
	betlist = []
	for user in userlist:
		#print ("Checking bet values for user = " + user['userid'])					          
		
		if 'bets' in user:
			userbets = user['bets']
			if gp_id in userbets:
				userid = user['userid']
				print ("User " + userid + " has bet for " + gp_id )
				validbet = userbets[gp_id]
				validbet['status'] = 1
				print (gpdata)
				if 'results' in gpdata:
					print(json.dumps(gpdata, indent=2))
					validbet = calculateScore(validbet, gpdata['results'])
					query = "/users/" + str(userid) + "/bets/" + str(gp_id) + ".json" 
					firebase.curlPut(firebase_url + query, json.dumps(validbet))
					betlist.append(validbet)
					
				else: 
					print ("User " + user['userid'] + " has no bets.")
					undefinedbet = dict()
					undefinedbet['status'] = -1
					undefinedbet['gp_id'] = gp_id
					undefinedbet['userid'] = user['userid']
					betlist.append(undefinedbet)
			else:
				print ("User has no bets")
				print ("User " + user['userid'] + " has no bets.")
				undefinedbet = dict()
				undefinedbet['status'] = -1
				undefinedbet['gp_id'] = gp_id
				undefinedbet['userid'] = user['userid']
				betlist.append(undefinedbet)			
				
#	print (json.dumps(userlist, indent=4))
					
def calculateScore(validbet, results):
	totalpoints = 0
	if (('qlresults' in results) & ('qbets' in validbet)):
		print ("Calculate qualification points")
		returnvalue = calculateResult(validbet['qbets'], results['qlresults'])
		validbet['qbets'] = returnvalue['calculatedbet']
		totalpoints += returnvalue['totalpoints']

	if (('gpresults' in results) & ('gpbets' in validbet)):
		print ("Calculate race points")
		returnvalue = calculateResult(validbet['gpbets'], results['qlresults'])
		validbet['gpbets'] = returnvalue['calculatedbet']
		totalpoints += returnvalue['totalpoints']

	if (('fastestlap' in results) & ('fastestlap' in validbet)):
		print ("Calculate fastest lap points")
		flresult = results['fastestlap']
		bet = validbet['fastestlap']
		if flresult['d_id'] == bet['d_id']:
			print ("Fastest lap " + bet['d_id'] + " matches and yields " + str(flresult['points']) + " points!!")
			bet['points'] = flresult['points']
			totalpoints+= flresult['points']
			validbet['fastestlap'] = bet
		
	validbet['totalpoints'] = totalpoints
	#print (json.dumps(validbet, indent=2))
	return validbet

def calculateResult(validbet, result):
	#print (json.dumps(validbet, indent=2))
	totalpoints = 0
	for key in result:
		position = key['position']
		bet = validbet[position - 1];
		if bet['driverid'] == key['driverid']:
			print ("Matches " + bet['driverid'] + " and gives " + str(key['points']) + " points!!")
			bet['points'] = key['points']
			totalpoints += key['points']
		else: 
			print ("No match " + bet['driverid'])
			bet['points'] = 0
		validbet[position - 1] = bet

	print ("Bet yields " + str(totalpoints) + " points!")
	#print (json.dumps(validbet, indent=2))
	returnvalue = dict()
	returnvalue['totalpoints'] = totalpoints
	returnvalue['calculatedbet'] = validbet
	return returnvalue

def pushResults(gpid, gresults, qresults, fastest):
	print ("Push results gr=" + gresults + ", qr=" + qresults + ", fl=" + fastest)
	gpresultlist = gresults.split(',')
	qresultlist = qresults.split(',')
	print ("Gp results = " + json.dumps(gpresultlist))
	print ("Qu results = " + json.dumps(qresultlist))
	print ("Fastest    = " + fastest)

	driverlist = drivers.getAllDriverData(firebase_url, "2014")
	gpdata = calendar.getCalendarData(firebase_url, "2014", gpid)

	results = dict()

	if fastest:
		fastestlap = dict()
		driver = driverlist[fastest]
		fastestlap['d_id'] = driver['d_id']
		fastestlap['info'] = driver['d_name']
		fastestlap['points'] = 3
		results['fastestlap'] = fastestlap

	results['qlresults'] = []
	results['gpresults'] = []

	for idx, val in enumerate(qresultlist):
		if val in driverlist:
			driver = driverlist[val]
			result = dict()
			result['driverid'] = driver['d_id']
			result['position'] = idx + 1
			result['points'] = len(qresultlist) - idx
			result['info'] = driver['d_name']
			results['qlresults'].append(result)
			gpdata['gp_status'] = 3
	
	for idx, val in enumerate(gpresultlist):
		if val in driverlist:
			driver = driverlist[val]
			result = dict()
			result['driverid'] = driver['d_id']
			result['position'] = idx + 1
			result['points'] = len(gpresultlist) - idx
			result['info'] = driver['d_name']
			results['gpresults'].append(result)
			gpdata['gp_status'] = 4
	
	gpdata['results'] = results
	query = "/calendar/" + str(gpdata['gp_year']) + "/" + str(gpdata['gp_id']) + ".json"
	print ("Pushing results to " + query)
	firebase.curlPut(firebase_url + query, json.dumps(gpdata))

if __name__ == "__main__":
	main(sys.argv[1:])
	print "\n"

