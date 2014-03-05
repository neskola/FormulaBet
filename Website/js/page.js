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
myUser = -1;

$(function () {
    $("#dialog-register").modal(
        {
        show: false
    } );

    $("#dialog-login").modal(
        {
        show: false
    });
    /*{
        autoOpen: false,
        buttons: {
            "ok": function () {
                console.log('trying to login: ' + $("#login-email").val());

                var email = $("#login-email").val();
                var password = $("#login-password").val();

                doLogin(email, password);
                $(this).dialog("close");
            },
            Cancel: function () {
                $(this).dialog("close");
            }
        }
    });*/

    $("#register-button").click(function () {
        var email = $("#register-email").val() + "@f1kaapo.fi";
        var password = $("#register-password").val();
        authClient.createUser(email, password, function (error, user) {
            if (!error) {
                console.log('logging new registered user');
                myUser = doLogin(email, password);
            } else {
                alert(error);
            }
        });

        $("#dialog-register").modal('hide');
    });

    $("#login-button").click(function () {
        var email = $("#login-email").val() + "@f1kaapo.fi"; // to bypass email validation
        var password = $("#login-password").val();

        console.log('trying to login: ' + $("#login-email").val());

        myUser = doLogin(email, password);

        $("#dialog-login").modal('hide');
       
    });


    $("#opener-register").click(function () {
        $("#dialog-register").modal('show');
    });

    $("#opener-login").click(function () {
        $("#dialog-login").modal('show');
    });

    $("#opener-logout").click(function () {
        authClient.logout();
    });
});

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
        console.log('User ID: ' + user.id + ', Provider: ' + user.provider);
        myUser = user;
        // doLogin(user);
        console.log('logged in')
        $("#data").attr('disabled', false);
        $("#opener-logout").attr('disabled', false);
        $("#opener-register").attr('disabled', true);
        $("#opener-login").attr('disabled', true);
        $("#opener-login").attr('hidden', true);
        $("#betslip-link").attr('disabled', false);
        $("#betslip-link").attr('hidden', false);
        $("#login-name").html(user.email.split('@')[0]);
    } else {
        // User is logged out.
        console.log('logged out');
        $("#data").attr('disabled', true);
        $("#opener-logout").attr('disabled', true);
        $("#opener-login").attr('disabled', false);
        $("#opener-login").attr('hidden', false);
        $("#betslip-link").attr('disabled', true);
        $("#betslip-link").attr('hidden', true);
        $("#opener-register").attr('disabled', false);
        myUser = -1;
        $("#login-name").html("");
        $("#dialog-login").modal("show");
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

function loadPage(html, arg) {
    if (myUser == -1 && html == "form.html") {
        
    }

    /*else {
        $.ajax({
            url: html + " #container",
        }).done(function (data) {
            $("#container").html(data);
        });
    }*/
};