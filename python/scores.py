#!/usr/bin/env python

import sys, getopt, json, math, logging
import curl
import xml.etree.ElementTree as ET
import time
import firebase, calendar, drivers, profiles
from datetime import datetime, timedelta

__CHECK_BETS = 1
__PUSH_RESULTS = 2

__GP_OPEN = 1  # is open
__GP_CLOSED = 2  # closed and bets are checked
__GP_QUAL = 3  # closed and qualification results are calculated
__GP_RACE = 4  # closed and race results are calculated

__BET_OK = 1  # bet is calculated and valid
__BET_OPEN = -1  # bet is still uncalculated
__BET_INVALID = -2  # bet is invalid
__BET_MISSING = -3  # user has no bet

__DEBUG = 1

firebase_url = ""
season = "2015"
operation = 0


def printUsage():
    print (
    "scores.py -c -r -u|--user <user name> -g|--gp <gp_id> --gr <gp_results> --qr <qual results> --fl <fastest lap> --fb <firebase>")


def main(argv):
    global operation, firebase_url, season

    logging.basicConfig(format='%(asctime)s [%(levelname)s]:%(message)s', level=logging.INFO,
                        datefmt='%d/%m/%Y %H:%M:%S')

    try:
        opts, args = getopt.getopt(argv, "hcru:", ["user=", "season=", "gp=", "gr=", "qr=", "fl=", "fb="])
    except getopt.GetoptError:
        printUsage()
        sys.exit(2)
    for opt, arg in opts:
        if opt == '-h':
            printUsage()
            sys.exit()
        if opt == '-c':
            logging.info("Check bet values.")
            operation = __CHECK_BETS
        if opt == '-r':
            logging.info("Push results.")
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
        if opt in ("--season"):
            season = arg

    if not firebase_url:
        logging.error("No target firebase defined!!!!")
        sys.exit()
    else:
        firebase_url = "https://" + firebase_url + ".firebaseio.com/" + season
        logging.info("Target firebase is " + firebase_url)

    if operation == __CHECK_BETS:
        checkBetvalues(gp_id, user_id)
    elif operation == __PUSH_RESULTS:
        gpresultlist = gresults.split(',')
        qresultlist = qresults.split(',')
        pushResults(gp_id, gpresultlist, qresultlist, fastest)


def checkBetvalues(gp_id, user_id):
    gpdata = calendar.getCalendarData(firebase_url, season, gp_id)
    userlist = profiles.getUserData(firebase_url, user_id)

    logging.info("Checking bet values for gp = " + gp_id)
    for user in userlist:
        logging.info("-----------------------------------------------------------------")
        userid = user['userid']

        logging.info("Checking bet values for user = " + user['userid'])

        currentbet = dict()
        currentbet['status'] = __BET_INVALID
        for bet in user['bets']:
            if bet and bet['gp_id'] == gp_id:
                logging.info("found bet " + json.dumps(bet))
                currentbet = bet
                currentbet['status'] = 1

        if currentbet['status'] > 0:
            logging.info("User " + userid + " has bet for " + gp_id)
            factor = 1
            if currentbet['doubled']:
                logging.info("Double bet! Changing factor to 2")
                factor = 2
            currentbet = calculateScore(currentbet, gpdata['results'], factor)
        else:
            logging.info("User " + userid + " has no bets for gp " + gp_id)
            currentbet = dict()
            currentbet['status'] = __BET_MISSING
            currentbet['gp_id'] = gp_id
            currentbet['gp_name'] = gpdata['gp_short_name']
            currentbet['userid'] = userid
            currentbet['totalpoints'] = 0

        query = "/users/" + str(userid) + "/bets/" + str(gp_id) + ".json"
        firebase.curlPut(firebase_url + query, json.dumps(currentbet))
        query = "/users/" + str(userid) + "/scores/" + str(gp_id) + ".json"
        firebase.curlPut(firebase_url + query, json.dumps(currentbet))
        query = "/scores/" + str(gp_id) + "/" + str(userid) + ".json"
        firebase.curlPut(firebase_url + query, json.dumps(currentbet))
        query = "/calendar/" + str(gp_id) + "/scores/" + str(userid) + ".json"
        firebase.curlPut(firebase_url + query, json.dumps(currentbet))

    if gpdata['gp_status'] < __GP_QUAL:
        closeGP(gpdata)


def closeGP(gpdata):
    logging.info("Close gp " + gpdata['gp_id'])
    gpdata['gp_status'] = __GP_CLOSED
    calendar.pushGpData(firebase_url, season, gpdata)


def calculateScore(validbet, results, factor):
    logging.info("Factor is " + str(factor))
    totalpoints = 0
    hiddenpoints = 0
    isbetvalid = isBetValid(validbet)
    logging.debug("bet " + json.dumps(validbet['qbets']))
    logging.debug("results " + json.dumps(results))

    if ('qlresults' in results) & ('qbets' in validbet):
        logging.info("Calculate qualification points")
        returnvalue = calculateResult(validbet['qbets'], results['qlresults'], factor)
        validbet['qbets'] = returnvalue['calculatedbet']
        totalpoints += returnvalue['totalpoints']
        validbet['qpoints'] = returnvalue['totalpoints']

    if ('gpresults' in results) & ('gpbets' in validbet):
        logging.info("Calculate race points")
        returnvalue = calculateResult(validbet['gpbets'], results['gpresults'], factor)
        validbet['gpbets'] = returnvalue['calculatedbet']
        totalpoints += returnvalue['totalpoints']
        hiddenpoints = returnvalue['hiddenpoints']
        validbet['gppoints'] = returnvalue['totalpoints']

    if ('fastestlap' in results) & ('fastestlap' in validbet):
        logging.info("Calculate fastest lap points")
        flresult = results['fastestlap']
        bet = validbet['fastestlap']
        if flresult['d_id'] == bet['d_id']:
            logging.info("Fastest lap " + bet['d_id'] + " matches and yields " + str(flresult['points'] * factor) + " points!!")
            bet['points'] = flresult['points'] * factor
            totalpoints += flresult['points'] * factor
        else:
            bet['points'] = 0;

        validbet['fastestlap'] = bet

    validbet['totalpoints'] = totalpoints
    validbet['hiddenpoints'] = hiddenpoints
    validbet['status'] = isbetvalid
    return validbet


def isBetValid(validbet):
    if 'qbets' not in validbet and 'gpbets' not in validbet and 'fastestlap' not in validbet:
        logging.info("Bet is not valid.")
        return __BET_INVALID
    else:
        logging.info("Bet is ok.")
        return __BET_OK


def calculateResult(validbet, result, factor):
    totalpoints = 0
    hiddenpoints = 0
    
    for key in result:
        position = key['position']
        bet = validbet[position - 1]
        if bet['driverid'] == key['driverid']:
            logging.info("Position (" + str(position) + ") matches " + bet['driverid'] + " and gives " + str(
                key['points'] * factor) + " points!!")
            bet['points'] = key['points'] * factor
            totalpoints += key['points'] * factor
            logging.debug("factorial for " + str(key['points']) + " = " + str(math.factorial(key['points'])))
            hiddenpoints += math.factorial(key['points'])
        else:
            logging.debug("No match " + bet['driverid'])
            bet['points'] = 0
        validbet[position - 1] = bet

    logging.info("Bet yields " + str(totalpoints) + " points!")
    returnvalue = dict()
    returnvalue['totalpoints'] = totalpoints
    returnvalue['hiddenpoints'] = hiddenpoints
    returnvalue['calculatedbet'] = validbet
    return returnvalue


def pushResults(gpid, gpresultlist, qresultlist, fastest):
    #        if (logging.isEnabledFor(logging.DEBUG)):
    logging.debug("Gp results  " + json.dumps(gpresultlist))
    logging.debug(qresultlist)
    logging.debug("Fastest lap " + json.dumps(fastest))

    driverlist = drivers.getAllDriverData(firebase_url, season)
    gpdata = calendar.getCalendarData(firebase_url, season, gpid)

    logging.debug(driverlist)

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
        logging.info(val)
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
        logging.info(val)
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
    query = "/calendar/" + str(gpdata['gp_id']) + ".json"
    logging.info("Pushing results to " + query)
    logging.info(json.dumps(gpdata))
    firebase.curlPut(firebase_url + query, json.dumps(gpdata))


if __name__ == "__main__":
    main(sys.argv[1:])
    print "\n"
