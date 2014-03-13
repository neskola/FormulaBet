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
		opts, args = getopt.getopt(argv,"hrcd:y:", ["driver=", "year=", "fb="])
	except getopt.GetoptError:
		print ("drivers.py -c --fb <firebase>")
		sys.exit(2)
	for opt, arg in opts:
		if opt == '-h':
			print ("drivers.py -c --fb <firebase>")
			sys.exit()
		if opt == '-r':
			print ("Refresh driver data.")
			operation = 1;
		if opt == '-c':
			print ("Clean driver data.")
			operation = 2;
		if opt in ("--fb"):
			fb = arg

		if opt in ("--driver"):
			driver = arg

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

	driverlist = getDriverData(year)

	if (operation == 1):
		pushDriverData(year, driverlist)
	elif (operation == 2):
		cleanDriverData(year, driverlist)

def getDriverData(year, driverid):
	query = "/drivers/" + year + "/" + driverid + ".json"
	print("Connecting to: " + query);
	return json.loads(firebase.curlQuery(firebase_url + query))	
	
def getDriverData(year):
	query = "/drivers/" + year + ".json"
	print("Connecting to: " + query);
	return json.loads(firebase.curlQuery(firebase_url + query))	

def deleteDriverData(year):
	print("Deleting current drivers for year " + year)
	query = "/drivers/" + year + ".json";
	firebase.curlDelete(firebase_url + query)

def pushDriverData(year, driverlist):
	for key in driverlist:
		driver = key
		print "Refresh driver " + json.dumps(driver) + "."		
		query = "/drivers/" + year + "/" + str(driver['d_id']) + ".json"
		firebase.curlPut(firebase_url + query, json.dumps(driver))

def cleanDriverData(year, driverlist):
	for key in driverlist:
		driver = driverlist[key]
		if (key != driver['d_id']):
			print "Clean driver with key " + key + " " + json.dumps(driver) + "."		
			query = "/drivers/" + str(year) + "/" + str(key) + ".json"
			firebase.curlDelete(firebase_url + query)

if __name__ == "__main__":
	main(sys.argv[1:])
	print "\n"

