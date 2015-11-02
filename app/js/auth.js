
var firebaseSingleton = (function () {

    // Instance stores a reference to the Singleton
    var instance;

    function init() {

        // Singleton

        //var firebaseRef = new Firebase('https://f1kaapo.firebaseio.com/' + season);
        var firebaseRef = new Firebase('https://test-f1kaapo.firebaseio.com/' + season);

        return {

            getReference: function () {
                logger.debug("Return " + firebaseRef);
                return firebaseRef;
            }

        };

    };

    return {

        // Get the Singleton instance if one exists
        // or create one if it doesn't
        getInstance: function () {

            if (!instance) {
                logger.info("Initializing firebase reference instance.")
                instance = init();
            }

            return instance;
        }

    };

})();

var ref = firebaseSingleton.getInstance().getReference();

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
   
    if (user) {
        // User is already logged in.
        logger.debug('User is logged in.', user);
        myUser = user;
        myUser.userid = user.email.split('@')[0];
        // doLogin(user);
        logger.info(myUser.userid + ' logged in ');
        $("#opener-logout").attr('disabled', false);
        $("#opener-login").attr('disabled', true);  
        $("#username").html(myUser.userid);
    } else {
        // User is logged out.
        logger.debug('User is logged out.');
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
        var ref = firebaseRef.child('/calendar/' + season);
        ref.on('value', function (dataSnapshot) {
            angular.forEach(dataSnapshot.val(), function (gpdata) {
                //console.log(gpdata);
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
        var ref = firebaseRef.child('/drivers/' + season);
        ref.on('value', function (dataSnapshot) {
            angular.forEach(dataSnapshot.val(), function (driver) {
                //console.log(driver);
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
