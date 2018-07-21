$(function () {

    $("#dialog-login").modal(
        {
            show: false
        });

    $("#login-button").click(function () {
        var email = $("#login-email").val() + "@f1kaapo.fi"; // to bypass email validation
        var password = $("#login-password").val();

        console.log('trying to login ??: ' + $("#login-email").val());

        myUser = doLogin(email, password);

        logger.info(JSON.stringify(myUser.email) + " logged in.");

        $("#dialog-login").modal('hide');

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
            $("#opener-logout").attr('disabled', false);
            $("#opener-login").attr('disabled', true);
            $("#username").html(myUser.userid);
        } else {
            // User is logged out.
            logger.debug('logged out');
            $("#opener-logout").attr('disabled', true);
            $("#opener-login").attr('disabled', false);
            $("#username").html("");
            //$("#dialog-login").modal("show");
        }

    });
};


