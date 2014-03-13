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
	gplist = getGpData(gp_id)
	userlist = getUserData(user_id)
	
	for gp in gplist:
		c_gp_id = gp['gp_id']
		print ("Checking bet values for gp = " + c_gp_id)						
		betlist = []
		for user in userlist:
			print ("Checking bet values for user = " + user['userid'])						

			if 'bets' in user:
				userbets = user['bets']
				if c_gp_id in userbets:
					print ("User " + user['userid'] + " has bet for " + c_gp_id )
					validbet = userbets[c_gp_id]
					validbet['status'] = 1
					if 'score' in gp:
						validbet = calculateScore(validbet, gp['score'])
					betlist.append(validbet)
					
			else: 
				print ("User " + user['userid'] + " has no bets.")
				undefinedbet = dict()
				undefinedbet['status'] = -1
				undefinedbet['gp_id'] = gp['gp_id']
				undefinedbet['userid'] = user['userid']
				betlist.append(undefinedbet)
						       
		print (json.dumps(userlist, indent=4))

def calculateScore(validbet, gpscore):
	print (json.dumps(validbet))
	print (json.dumps(gpscore))

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

