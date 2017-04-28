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
        //var transform = {"<>":"div","html":"${bets.user} ${bets.user.bet}"};

        // res.status(200).send(json2html.transform(bets,transform));
        res.status(200).send(bets);
    });
});