
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

