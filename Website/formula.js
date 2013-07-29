var http = require('http');
var LISTEN_PORT = 81;
var LISTEN_ADDRESS = "0.0.0.0";

var DEBUG = true;

var g_httpServer = null;

var testusers = {
"users": [
   { "name":"niki" }, 
   { "name":"testi" }
] 
};

var options = {
    host: 'www.formula1.com',
    port: 80,
    path: '/results/season/2013/'    
};

function httpRequestHandler (req, res) {
    var usersjson = JSON.stringify(testusers);
    var parsed = JSON.parse(usersjson);
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    var xmlDoc = getData();
    res.end(parsed.users[0].name + '\n' + xmlDoc);
}

// from MSK's chat service
function formatDateTimeISO8601(dateObject, withoutT) {
    var year = dateObject.getFullYear();
    var month = dateObject.getMonth() + 1;
    var date = dateObject.getDate();
    var hours = dateObject.getHours();
    var minutes = dateObject.getMinutes();
    var seconds = dateObject.getSeconds();
    return year + '-' +
        ((month < 10) ? '0' + month : month) + '-' +
        ((date < 10) ? '0' + date : date) +
        ((withoutT === true) ? ' ' : 'T') +
        ((hours < 10) ? '0' + hours : hours) + ':' +
        ((minutes < 10) ? '0' + minutes : minutes) + ':' +
        ((seconds < 10) ? '0' + seconds : seconds);
}

// from MSK's chat service
function debug(msg) {
    if (DEBUG) {
        var ts = formatDateTimeISO8601(new Date(), true);
        console.log(ts + ' ' + msg);
    }
}


debug('NodeJS Formula bet backend');
debug('Process id:' + process.pid);

g_httpServer = http.createServer(httpRequestHandler);
g_httpServer.listen(LISTEN_PORT, LISTEN_ADDRESS);

function getData() {    
    var today = new Date();
    
    http.get(options, function (resp) {        
        resp.on('data', function (chunk) {
            //do something with chunk
            debug('got data:\n' + chunk);            
        });
    }).on("error", function (e) {
        console.log("Got error: " + e.message);
    });
}

