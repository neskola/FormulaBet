function loadPage(html, arg) {
    $.ajax({
        url: html + " #container",
    }).done(function (data) {
        $("#container").html(data);
    });
};