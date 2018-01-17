$(function () {

    $("#dialog-login").modal(
        {
            show: false
        });

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

        console.log('trying to login ??: ' + $("#login-email").val());

        myUser = doLogin(email, password);

        logger.info(JSON.stringify(myUser));

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
            logger.debug('User ID: ' + myUser.userid);
            // doLogin(user);
            logger.debug(myUser.userid + ' logged in')
            $("#opener-logout").attr('disabled', false);
            $("#opener-register").attr('disabled', true);
            $("#opener-login").attr('disabled', true);
            $("#username").html(myUser.userid);
        } else {
            // User is logged out.
            logger.debug('logged out');
            $("#opener-logout").attr('disabled', true);
            $("#opener-login").attr('disabled', false);
            $("#opener-register").attr('disabled', false);
            $("#username").html("");
            //$("#dialog-login").modal("show");
        }

    });
};


