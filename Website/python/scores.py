#!C:\Python33\python.exe -u
#!/usr/bin/env python

import sys, getopt, json, sha
import curl
import xml.etree.ElementTree as ET
import time
import firebase, calendar, drivers, profiles
from datetime import datetime, timedelta

__CHECK_BETS = 1
__PUSH_RESULTS = 2

__GP_OPEN   = 1 # is open
__GP_CLOSED = 2 # closed and bets are checked
__GP_QUAL   = 3 # closed and qualification results are calculated
__GP_RACE   = 4 # closed and race results are calculated

__BET_OK      =  1 # bet is calculated and valid
__BET_OPEN    = -1 # bet is still uncalculated
__BET_INVALID = -2 # bet is invalid
__BET_MISSING = -3 # user has no bet 

firebase_url = ""
operation = 0

def printUsage():
	print ("scores.py -c -r -u|--user <user name> -g|--gp <gp_id> --gr <gp_results> --qr <qual results> --fl <fastest lap> --fb <firebase>")

def main(argv):	
	global operation, firebase_url;

	try:
		opts, args = getopt.getopt(argv,"hcru:", ["user=", "gp=", "gr=", "qr=", "fl=", "fb="])
	except getopt.GetoptError:
		printUsage()
		sys.exit(2)
	for opt, arg in opts:
		if opt == '-h':
			printUsage()
			sys.exit()
		if opt == '-c':
			print ("Check bet values.")			
			operation = __CHECK_BETS
		if opt == '-r':
			print ("Push results.")			
			operation = __PUSH_RESULTS
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
			firebase_url = arg

	if not firebase_url:
		print ("No target firebase defined!!!!")
		sys.exit()     
	else:
		firebase_url = "https://" + firebase_url + ".firebaseio.com"
		print "Target firebase is " + firebase_url

	if operation == __CHECK_BETS:
		checkBetvalues(gp_id, user_id)
	elif operation == __PUSH_RESULTS:
		gpresultlist = gresults.split(',')
		qresultlist = qresults.split(',')		
		pushResults(gp_id, gpresultlist, qresultlist, fastest)

def checkBetvalues(gp_id, user_id):
	gpdata = calendar.getCalendarData(firebase_url, "2014", gp_id)
	userlist = profiles.getUserData(firebase_url, user_id)
	
	print ("Checking bet values for gp = " + gp_id)						
	for user in userlist:
		userid = user['userid']
		currentbet = dict()
		print ("Checking bet values for user = " + user['userid'])					          
		
		if 'bets' in user and gp_id in user['bets']:			
			print ("User " + userid + " has bet for " + gp_id )
			userbets = user['bets']
			currentbet  = userbets[gp_id]
			#print (gpdata)
			if 'results' in gpdata:
				#print(json.dumps(gpdata, indent=2))
				currentbet = calculateScore(currentbet, gpdata['results'])
				
		else: 
			print ("User " + userid + " has no bets for gp " + gp_id)
			currentbet = dict()
			currentbet['status'] = __BET_MISSING
			currentbet['gp_id'] = gp_id
			currentbet['userid'] = userid
			currentbet['totalpoints'] = 0
			
		query = "/users/" + str(userid) + "/bets/" + str(gp_id) + ".json" 
		#print (json.dumps(currentbet))
		firebase.curlPut(firebase_url + query, json.dumps(currentbet))
			
	if gpdata['gp_status'] < __GP_QUAL:
		closeGP(gpdata)

#	print (json.dumps(userlist, indent=4))

def closeGP(gpdata):
	print ("Close gp " + gpdata['gp_id'])
	gpdata['gp_status'] = __GP_CLOSED
	calendar.pushGpData(firebase_url, "2014", gpdata)
					
def calculateScore(validbet, results):
	totalpoints = 0
	isbetvalid = isBetValid(validbet)
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
	validbet['status'] = isbetvalid
	#print (json.dumps(validbet, indent=2))
	return validbet

def isBetValid(validbet):
	if 'qbets' not in validbet and 'gpbets' not in validbet and 'fastestlap' not in validbet:
		print ("Bet is not valid.")
		print (json.dumps(validbet))
		return __BET_INVALID
	else:
		return __BET_OK
		

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

def pushResults(gpid, gpresultlist, qresultlist, fastest):
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
			gpdata['gp_status'] = __GP_QUAL
	
	for idx, val in enumerate(gpresultlist):
		if val in driverlist:
			driver = driverlist[val]
			result = dict()
			result['driverid'] = driver['d_id']
			result['position'] = idx + 1
			result['points'] = len(gpresultlist) - idx
			result['info'] = driver['d_name']
			results['gpresults'].append(result)
			gpdata['gp_status'] = __GP_RACE
	
	gpdata['results'] = results
	query = "/calendar/" + str(gpdata['gp_year']) + "/" + str(gpdata['gp_id']) + ".json"
	print ("Pushing results to " + query)
	firebase.curlPut(firebase_url + query, json.dumps(gpdata))

if __name__ == "__main__":
	main(sys.argv[1:])
	print "\n"

