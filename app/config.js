'use strict';

var season = "2018";

var debug = false;

// TODO: this should be overwritten in firebase env if found or parsed from url location
var FIREBASE = new Firebase('https://f1kaapo.firebaseio.com/' + season);
