var functions = require('firebase-functions');
var json2html = require('node-json2html');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

exports.scores = functions.https.onRequest((req, res) => {
    res.set("Access-Control-Allow-Origin", '*');
    res.set("Access-Control-Allow-Methods", "GET");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    var scoresref = admin.database().ref(req.query.season).child("/scores");

    scoresref.on('value', function (snapshot) {
        res.send(snapshot.val());
    });

});

exports.betstatus = functions.https.onRequest((req, res) => {
    res.set("Access-Control-Allow-Origin", '*');
    res.set("Access-Control-Allow-Methods", "GET");
    res.set("Access-Control-Allow-Headers", "Content-Type");

    var bets = { doubled: 0 };
    admin.database().ref(req.query.season).child('users').once('value').then(function (snapshot) {
        var gp = req.query.gp;
        userlist = snapshot.val();
        //console.log('snapshot of userlist = [' + JSON.stringify(userlist) + ']');
        for (user in userlist) {
            //console.info('Found user ' + JSON.stringify(userlist[user]));
            bets[user] = { bet: false };
            for (bet in userlist[user].bets) {
                if (bet != null && userlist[user].bets[bet].gp_id == gp) {
                    bets[user].bet = true;
                    if (userlist[user].bets[bet].doubled) {
                        bets.doubled = bets.doubled + 1;
                    } 
                }
            }
        }
        res.status(200).send(bets);
    });
});

exports.scoretable = functions.https.onRequest((req, res) => {
    res.set("Access-Control-Allow-Origin", '*');
    res.set("Access-Control-Allow-Methods", "GET");
    res.set("Access-Control-Allow-Headers", "Content-Type");

    var bets = { };
    admin.database().ref(req.query.season).child('users').once('value').then(function (snapshot) {
        userlist = snapshot.val();
        for (user in userlist) {
            var userid = userlist[user].userid;
            console.info('Found user ' + userid);
            var totalscore = 0, totalqpoints = 0, totalgppoints = 0;
            var gpindex = 1;
            for (score in userlist[user].scores) {
                if (score != null) {
                    var qpoints = (userlist[user].scores[score]['qpoints'] != undefined) ? userlist[user].scores[score]['qpoints'] : 0;
                    var gppoints = (userlist[user].scores[score]['gppoints'] != undefined) ? userlist[user].scores[score]['gppoints'] : 0; 
                    var totalpoints = qpoints + gppoints;
                    console.log('bet ' + gpindex + ' score for ' + userid + ' = ' + totalpoints 
                        + ', qual =' + qpoints + ', gp = ' + gppoints);
                    totalscore += totalpoints;
                    totalqpoints += qpoints;
                    totalgppoints += gppoints;
                    gpindex += 1;
                }
            }
            console.log('totalscore ' + totalscore + ' for user ' + userid);
            bets[userid] = { 'totalscore' : totalscore, 'qlpoints' : totalqpoints, 'gppoints' : totalgppoints };
        }
        res.status(200).send(bets);
    });
});
