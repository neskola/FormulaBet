
var firebaseSingleton = (function () {

    // Instance stores a reference to the Singleton
    var instance;

    function init() {

        // Singleton

        var firebaseRef = new Firebase('https://f1kaapo.firebaseio.com');


        return {

            // Public methods and variables
            publicMethod: function () {
                console.log("The public can see me!");
            },

            getReference: function () {
                console.log("Return " + firebaseRef);
                return firebaseRef;
            }

        };

    };

    return {

        // Get the Singleton instance if one exists
        // or create one if it doesn't
        getInstance: function () {

            if (!instance) {
                console.log("Initializing firebase reference instance.")
                instance = init();
            }

            return instance;
        }

    };

})();


// this is derived from
// http://stackoverflow.com/questions/15167981/how-do-i-use-firebase-simple-login-with-email-password/15167983#15167983


// CHANGE THIS to your own firebase
var ref = firebaseSingleton.getInstance().getReference();
// then go to your firebase console, click the auth tab, scroll down to 
// authentication providers, and enable 'email/password'
// Now enter this in the 'Auth' tab to the left.
/*
{
  "rules": {
    "users": {
      "$userid": {
        ".read": "auth.id == $userid",
        ".write": "auth.id == $userid"
      }
    }
  }
}
*/
//

// global user (is this a good thing?)

function doLogin(email, password) {
    authClient.login('password', {
        email: email,
        password: password
    });
};

var authClient = new FirebaseSimpleLogin(ref, function (error, user) {
    if (error) {
        alert(error);
        return;
    }
    console.log(user);
    if (user) {
        // User is already logged in.
        console.log('User ID: ' + user.id + ', Provider: ' + user.provider);
        myUser = user;
        myUser.userid = user.email.split('@')[0];
        // doLogin(user);
        console.log('logged in')
        $("#opener-logout").attr('disabled', false);
        $("#opener-login").attr('disabled', true);
        $("#username").html(myUser.userid);
    } else {
        // User is logged out.
        console.log('logged out');
        $("#opener-logout").attr('disabled', true);
        $("#opener-login").attr('disabled', false);
        myUser = -1;
        $("#username").html("");
        //$("#dialog-login").modal("show");
    }
});

var calendarSingleton = (function () {

    var instance;
    var data = [];

    function init() {

        // Singleton
        var firebaseRef = firebaseSingleton.getInstance().getReference();
        var ref = firebaseRef.child('calendar/2014');
        console.log("Fetching calendar " + ref);
        ref.on('value', function (dataSnapshot) {
            angular.forEach(dataSnapshot.val(), function (gpdata) {
                console.log(gpdata);
                data.push(gpdata);
            });
        });

        return {

            // Public methods and variables
            getCalendarData: function () {
                return data;
            }
        };

    };

    return {

        // Get the Singleton instance if one exists
        // or create one if it doesn't
        getInstance: function () {

            if (!instance && data.length == 0) {
                console.log("Initializing calendar instance.")
                instance = init();
            }

            return instance;
        }

    };

})();

var driverSingleton = (function () {

    var instance;
    var data = [];

    function init() {

        // Singleton
        var firebaseRef = firebaseSingleton.getInstance().getReference();
        var ref = firebaseRef.child('drivers/2014');
        console.log("Fetching drivers " + ref);
        ref.on('value', function (dataSnapshot) {
            angular.forEach(dataSnapshot.val(), function (driver) {
                console.log(driver);
                data.push(driver);
            });
        });

        return {

            // Public methods and variables
            getDriverData: function () {
                return data;
            }
        };

    };

    return {

        // Get the Singleton instance if one exists
        // or create one if it doesn't
        getInstance: function () {

            if (!instance && data.length == 0) {
                console.log("Initializing drivers instance.")
                instance = init();
            }

            return instance;
        }

    };

})();

// init calendar and driver data
calendarSingleton.getInstance();
driverSingleton.getInstance();
