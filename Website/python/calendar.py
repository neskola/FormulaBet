#!C:\Python33\python.exe -u
#!/usr/bin/env python

import sys, getopt, json, sha
import curl
import xml.etree.ElementTree as ET
import time
import firebase
from datetime import datetime, timedelta

firebase_url = ""
operation = 0
fb = ''
year = '2014'

def main(argv):	
	global operation, fb, year, firebase_url;

	try:
		opts, args = getopt.getopt(argv,"hrcd:y:", ["calendar=", "year=", "fb="])
	except getopt.GetoptError:
		print ("calendars.py -c --fb <firebase>")
		sys.exit(2)
	for opt, arg in opts:
		if opt == '-h':
			print ("calendars.py -c --fb <firebase>")
			sys.exit()
		if opt == '-r':
			print ("Refresh calendar data.")
			operation = 1;
		if opt == '-c':
			print ("Clean calendar data.")
			operation = 2;
		if opt in ("--fb"):
			fb = arg

		if opt in ("--calendar"):
			calendar = arg

		if opt in ("--year"):
			year = arg

		#else: 
		#	gp_id = ''

	if not fb:
		print ("No target firebase defined!!!!")
		sys.exit()     
	else:
		firebase_url = "https://" + fb + ".firebaseio.com"
		print "Target firebase is " + firebase_url

	calendarlist = getCalendarData(year)

	if (operation == 1):
		pushCalendarData(year, calendarlist)
	elif (operation == 2):
		cleanCalendarData(year, calendarlist)

def getCalendarData(year, calendarid):
	query = "/calendar/" + year + "/" + calendarid + ".json"
	print("Connecting to: " + query);
	return json.loads(firebase.curlQuery(firebase_url + query))	
	
def getCalendarData(year):
	query = "/calendar/" + year + ".json"
	print("Connecting to: " + query);
	return json.loads(firebase.curlQuery(firebase_url + query))	

def deleteCalendarData(year):
	print("Deleting current calendars for year " + year)
	query = "/calendar/" + year + ".json";
	firebase.curlDelete(firebase_url + query)

def pushCalendarData(year, calendarlist):
	for key in calendarlist:
		calendar = key
		print "Refresh calendar " + json.dumps(calendar) + "."		
		query = "/calendar/" + year + "/" + str(calendar['gp_id']) + ".json"
		firebase.curlPut(firebase_url + query, json.dumps(calendar))

def cleanCalendarData(year, calendarlist):
	for key in calendarlist:
		calendar = calendarlist[key]
		if (key != calendar['gp_id']):
			print "Clean calendar with key " + key + " " + json.dumps(calendar) + "."		
			query = "/calendar/" + str(year) + "/" + str(key) + ".json"
			firebase.curlDelete(firebase_url + query)

if __name__ == "__main__":
	main(sys.argv[1:])
	print "\n"

