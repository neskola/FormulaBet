#!C:\Python33\python.exe -u
#!/usr/bin/env python
import sys, getopt, json, ssl
import pycurl
import StringIO
import datetime, zipfile

__PUSH = 1
__BACKUP = 2
__BACKUP_AND_ZIP = 3


def usage():
	print ("firebase.py -b|-u|-z --file <json file> --url <firebase url>")
	print ("-b backup data from <firebase_url> to <json file>")
	print ("-u upload data from <json file> to <firebase_url>")
	print ("-z backup and compress (zip) data from <firebase_url> to <json_file>.zip")
	return

# for testing only
def main(argv): 

	global url, fileref, operation
	
	try:
		opts, args = getopt.getopt(argv,"hbzu", ["file=", "url="])
	except getopt.GetoptError:
		usage()
		sys.exit(2)
	for opt, arg in opts:
		if opt == '-h':
			usage()
			sys.exit()
		elif opt in ("--file"):			
			fileref = arg
		elif opt in ("--url"):			
			url = arg
		if opt in ("-b"):
			operation = __BACKUP
		if opt in ("-p"):
			operation = __PUSH
		if opt in ("-z"):
			operation = __BACKUP_AND_ZIP

	if not fileref and not url:
		usage()
		sys.exit(1)
	elif operation == __PUSH:
		print ("Uploading file " + fileref + " to firebase url " + url)
		jsonfile = open(fileref)
		jsondata = json.load(jsonfile)
		print json.dumps(jsondata)
		jsonfile.close()
		curlPut(url, json.dumps(jsondata))
	elif operation >= __BACKUP:
		print ("Creating backup from firebase url " + url + " to file " + fileref)
		response = curlQuery(url + "/.json")
		jsondata = json.loads(response) 
		with open(fileref, 'w') as outfile:
			json.dump(jsondata, outfile, sort_keys = True, indent = 4, ensure_ascii=True)
		outfile.close()
		if operation == __BACKUP_AND_ZIP:
			datestring = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
			zipfilename = fileref + "." + datestring + ".zip"
			print ("Creating archive " + zipfilename)
			zf = zipfile.ZipFile(zipfilename, mode='w')
			try:
				zf.write(fileref)
			finally:
				zf.close()

# Firebase API functions, no fancy realtime stuff just plain PUSH / GET functions

# get batch controller data, such as places, timevalues etc for update batch jobs
def getBatchControllerData(firebase_url):
	return curlQuery(firebase_url + "/observations/observation.json")

def getProfileData(firebase_url):
	return curlQuery(firebase_url + "/profiles.json")

def getGEOIDList():
	datalist = json.loads(getBatchControllerData("https://activeweather.firebaseIO.com"))
	geoidlist = []
	for data in datalist:
		geoidlist.append(data)
	return geoidlist

def curlQuery(url):
	
	b = StringIO.StringIO()

	print "Using curl. Query=" + url
	c = pycurl.Curl();
	c.setopt(pycurl.URL, url)
	c.setopt(pycurl.HTTPHEADER, ["Accept:"])
	c.setopt(pycurl.WRITEFUNCTION, b.write)
	c.setopt(pycurl.VERBOSE, 1)
	c.setopt(pycurl.SSL_VERIFYPEER, 0)   
	c.setopt(pycurl.SSL_VERIFYHOST, 0)
	c.perform()
	
	ret = b.getvalue()
	b.close()
	return ret

def curlPut(url, data):

	c = pycurl.Curl();
	c.setopt(pycurl.URL, url)
	c.setopt(pycurl.HTTPHEADER, ["Accept:application/json"])
	c.setopt(pycurl.CUSTOMREQUEST, "PUT")
	c.setopt(pycurl.POSTFIELDS, data)
	c.setopt(pycurl.SSL_VERIFYPEER, 0)   
	c.setopt(pycurl.SSL_VERIFYHOST, 0)
	c.perform()

def curlDelete(url):

	c = pycurl.Curl();
	c.setopt(pycurl.URL, url)
	c.setopt(pycurl.HTTPHEADER, ["Accept:application/json"])
	c.setopt(pycurl.CUSTOMREQUEST, "DELETE")
#	c.setopt(pycurl.POSTFIELDS, data)
	c.setopt(pycurl.SSL_VERIFYPEER, 0)   
	c.setopt(pycurl.SSL_VERIFYHOST, 0)
	c.perform()


#def curlPost(url):

#def curlDelete(url):

def setupCurl():
	c = pycurl.Curl();
	c.setopt(pycurl.HTTPHEADER, ["Accept:"])
	c.setopt(pycurl.VERBOSE, 1)
	c.setopt(pycurl.SSL_VERIFYPEER, 0)   
	c.setopt(pycurl.SSL_VERIFYHOST, 0)


# push parsed json data to firebase
#def pushJSONtoFirebase(json, firebase_url):

if __name__ == "__main__":
	main(sys.argv[1:])
