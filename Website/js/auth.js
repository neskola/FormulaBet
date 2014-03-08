// this is derived from
// http://stackoverflow.com/questions/15167981/how-do-i-use-firebase-simple-login-with-email-password/15167983#15167983


// CHANGE THIS to your own firebase
var ref = new Firebase("https://f1kaapo.firebaseio.com");
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
        $("#opener-register").attr('disabled', true);
        $("#opener-login").attr('disabled', true);
        $("#opener-login").attr('hidden', true);
        $("#login-name").html(myUser.userid);
    } else {
        // User is logged out.
        console.log('logged out');
        $("#opener-logout").attr('disabled', true);
        $("#opener-login").attr('disabled', false);
        $("#opener-login").attr('hidden', false);
        $("#opener-register").attr('disabled', false);
        myUser = -1;
        $("#login-name").html("");
        //$("#dialog-login").modal("show");
    }
});


$('#data').keypress(function (e) {
    if (e.keyCode == 13) {
        var data = $('#data').val();
        console.log(myUser.id);
        var myRef = new Firebase("https://f1kaapo.firebaseio.com/users/" + myUser.id);
        myRef.push({
            data: data
        });
        $('#data').val('');
    }
});