var functions = require('firebase-functions');
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

    var bets = {};
    admin.database().ref(req.query.season).child('users').once('value').then(function (snapshot) {
        var gp = req.query.gp;
        userlist = snapshot.val();
        for (user in userlist) {
            bets[user] = false;
            for (bet in userlist[user].bets) {
                if (bet != null && userlist[user].bets[bet].gp_id == gp) {
                    bets[user] = true;
                } 
            }
        }
        res.status(200).send(bets);
    });
});