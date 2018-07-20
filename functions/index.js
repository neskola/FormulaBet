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
        for (user in userlist) {
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

    let sortkey = (req.query.sort != undefined) ? req.query.sort : "totalscore"; 
    let season = (req.query.season != undefined) ? req.query.season : new Date().getFullYear(); 
    var bets = [];
    admin.database().ref(season).child('users').once('value').then(function (snapshot) {
        userlist = snapshot.val();
        for (user in userlist) {
            var userid = userlist[user].userid;
            var totalscore = 0, totalqpoints = 0, totalgppoints = 0;
            var gpindex = 1;
            var doubled = "";
            for (score in userlist[user].scores) {
                if (score != null) {
                    var qpoints = (userlist[user].scores[score]['qpoints'] != undefined) ? userlist[user].scores[score]['qpoints'] : 0;
                    var gppoints = (userlist[user].scores[score]['gppoints'] != undefined) ? userlist[user].scores[score]['gppoints'] : 0; 
                    var totalpoints = qpoints + gppoints;
                    totalscore += totalpoints;
                    totalqpoints += qpoints;
                    totalgppoints += gppoints;
                    gpindex += 1;
                    if (season < 2017) {
                        doubled = "N\/A";
                    } else if (userlist[user].scores[score]['doubled']) {
                        doubled = userlist[user].scores[score]['gp_name'].replace(/\d{1,2}[\-|\.|\/]\d{1,2}[\-|\.|\/]\d{2,4}/g, "");
                        ;
                    }
                }
            }
            var jsonstring = "{\"userid\":\"" + userid + "\"" 
            + ",\"totalscore\":" + totalscore 
            + ",\"qlpoints\":" + totalqpoints 
            + ",\"gppoints\":" + totalgppoints
            + ",\"doubled\": \"" + doubled + "\"}";
        
            var jsonObj = JSON.parse(jsonstring);
            bets.push(jsonObj);    

        }
        bets.sort(function(a, b){
            return b[sortkey] - a[sortkey];
        });
        res.status(200).send(bets);
    });
});
