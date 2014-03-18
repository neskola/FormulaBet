$(function () {
    $("#dialog-register").modal(
        {
            show: false
        });

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

/*    $("#confirm").click(function () {
        if (myUser == -1) {
            $("#dialog-login").modal('show');
        }
    });*/

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

function loadPage(html, arg) {
    /* insert random salt to prevent hashing */
    html = html + "?salt=" + (new Date().getTime());
    console.log("Load page " + html);
    $.ajax({
        url: html + " #body-content",
    }).done(function (data) {
        $("#body-content").html(data);
        if (myUser.userid) {
            // User is already logged in.
            console.log('User ID: ' + myUser.userid);
            // doLogin(user);
            console.log(myUser.userid + ' logged in')
            $("#opener-logout").attr('disabled', false);
            $("#opener-register").attr('disabled', true);
            $("#opener-login").attr('disabled', true);            
            $("#username").html(myUser.userid);
        } else {
            // User is logged out.
            console.log('logged out');
            $("#opener-logout").attr('disabled', true);
            $("#opener-login").attr('disabled', false);            
            $("#opener-register").attr('disabled', false);
            $("#username").html("");
            //$("#dialog-login").modal("show");
        }

    });
};


