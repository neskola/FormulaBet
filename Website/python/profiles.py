#!C:\Python33\python.exe -u
#!/usr/bin/env python

import sys, getopt, json, sha
import curl
import xml.etree.ElementTree as ET
import time
import firebase
from datetime import datetime, timedelta

firebase_url = "https://neskola.firebaseio.com"
user = ''
password = ''
name = ''
email = ''
active = 1
adduser = 0
remove = 0
bank = ''
isadmin = 0
fb = ''

def main(argv):
	global user, email, name, password, active, remove, bank, fb
	
	inputfile = ""
	try:
		opts, args = getopt.getopt(argv,"harxiu:e:n:p:b:f:", ["user=", "email=", "name=", "password=", "bank=", "fb="])
	except getopt.GetoptError:
		print ("profiles.py -[a|r] [x|i] -u|--user <user name> -p|--password <password> -e|--email <email> -n|--name <name>")
		sys.exit(2)
	for opt, arg in opts:
		if opt == '-h':
			print ("profiles.py -[a|r] [x] -u|--user <user name> -p|--password <password> -e|--email <email>")
			sys.exit()
		if opt == '-a':
			print ("Adding / updating user.")			
			global adduser
			adduser = 1
		if opt == '-x':
			print ("Setting as inactive")
			global active 
			active = 0
		if opt == '-r':
			print ("Removing user.")
			global remove
			remove = 1
		if opt == '-i':
			print ("Is admin user.")
			global isadmin
			isadmin = 1
		if opt in ("-u", "--user"):			
			user = arg
		if opt in ("-p", "--password"):
			password = arg
		if opt in ("-e", "--email"):
			email = arg			
		if opt in ("-n", "--name"):
			name = arg
		if opt in ("-b", "--bank"):
			bank = arg
		if opt in ("-f", "--fb"):
			fb = arg
			
	if not fb:
		print ("No target firebase defined!!!!")
		sys.exit()     
	else:
		firebase_url = "https://" + fb + ".firebaseio.com"
		print "Target firebase is " + firebase_url

	if adduser == 1 and user == '' and password == '':
		print ("profiles.py -a -u|--user <user name> -p|--password <password> -e|--email <email>")
		sys.exit()
	elif adduser == 1:
		updateUser(user, name, email, password, bank, active, isadmin)

	if remove == 1 and user == '':
		print ("profiles.py -r -u|--user <user name>")
		sys.exit()
	elif remove == 1 and user != '':
		removeUser(user)
	
def updateUser(user, name, email, password, bank, active, isadmin):
	sha_pass = sha.new(password)
	userdata = dict()
	userdata['email'] = email
	userdata['name'] = name
	userdata['bank'] = bank
	userdata['password'] = sha_pass.hexdigest()
	userdata['active'] = active
	userdata['isadmin'] = isadmin
	userdata['userid'] = user
	print "Adding user = " + user + " to list"
	firebase.curlPut(firebase_url + "/users/" + user + ".json", json.dumps(userdata))

def removeUser(user):
	print "Removing " + user + " from list."
	firebase.curlDelete(firebase_url + "/users/" + user + ".json")

if __name__ == "__main__":
	main(sys.argv[1:])
	print "\n"
