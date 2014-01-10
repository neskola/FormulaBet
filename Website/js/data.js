


function CalendarDataCtrl($scope, $http) {

    $scope.entries = [];

    $.getJSON("data/calendar.json", function (data) {

        $.each(data, function (key, val) {
            if (val && typeof val === 'object') {

                $scope.entries = data;
            }
        });
        alert('bar' + $scope.entries);
    });
    alert('foo' + $scope.entries);
}


// {text:'workshop', min:'-15', max:'15'},
